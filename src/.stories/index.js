import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {storiesOf} from '@kadira/storybook';
import style from './Storybook.scss';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from '../index';
import {defaultFlexTableRowRenderer, FlexColumn, FlexTable, VirtualScroll} from 'react-virtualized';
import 'react-virtualized/styles.css';
import Infinite from 'react-infinite';
import range from 'lodash/range';
import random from 'lodash/random';
import classNames from 'classnames';

function getItems(count, height) {
	var heights = [65, 110, 140, 65, 90, 65];
	return range(count).map((value) => {
		return {
			value,
			height: height || heights[random(0, heights.length - 1)]
		};
	});
}

const Handle = SortableHandle(() => <div className={style.handle}></div>);

const Item = SortableElement((props) => {
    return (
        <div className={props.className} style={{
            height: props.height
        }}>
			{props.useDragHandle && <Handle/>}
            Item {props.value}
        </div>
    )
});

class ListWrapper extends Component {
	constructor({items}) {
		super();
		this.state = {
			items
		};
	}
	static propTypes = {
		items: PropTypes.array,
		className: PropTypes.string,
		itemClass: PropTypes.string,
		width: PropTypes.number,
		height: PropTypes.number,
		onSortEnd: PropTypes.func,
		component: PropTypes.func
	}
	static defaultProps = {
		className: classNames(style.list, style.stylizedList),
		itemClass: classNames(style.item, style.stylizedItem),
		width: 400,
		height: 600
	};
    onSortEnd = ({oldIndex, newIndex}) => {
		let {onSortEnd} = this.props;
        let {items} = this.state;
        arrayMove(items, oldIndex, newIndex);
        this.setState({items});

		if (onSortEnd) {
			onSortEnd(this.refs.component);
		}
    };
	render() {
		const Component = this.props.component;
		const {items} = this.state;

		return <Component ref="component" {...this.props} items={items} onSortEnd={this.onSortEnd} />;
	}
}

// Function components cannot have refs, so we'll be using a class for React Virtualized
class VirtualList extends Component {
	render() {
		let {className, items, height, width, itemHeight, itemClass, sortingIndex} = this.props;
		return (
			<VirtualScroll
				ref="vs"
				className={className}
				rowHeight={({index}) => items[index].height}
				estimatedRowSize={itemHeight}
				rowRenderer={({index}) => {
					let {value, height} = items[index];
					return <Item index={index} className={itemClass} sortingIndex={sortingIndex} value={value} height={height}/>;
				}}
				rowCount={items.length}
				width={width}
				height={height}
			/>
		);
	}
}
const SortableVirtualList = SortableContainer(VirtualList, {withRef: true});

const SortableFlexTable = SortableContainer(FlexTable, {withRef: true});
const SortableRowRenderer = SortableElement(defaultFlexTableRowRenderer);

class FlexTableWrapper extends Component {
	render () {
		const {
			className,
			height,
			helperClass,
			itemClass,
			itemHeight,
			items,
			onSortEnd,
			width
		} = this.props

		return (
			<SortableFlexTable
				getContainer={(wrappedInstance) => ReactDOM.findDOMNode(wrappedInstance.Grid)}
				gridClassName={className}
				headerHeight={itemHeight}
				height={height}
				helperClass={helperClass}
				onSortEnd={onSortEnd}
				rowClassName={itemClass}
				rowCount={items.length}
				rowGetter={({ index }) => items[index]}
				rowHeight={itemHeight}
				rowRenderer={(props) => <SortableRowRenderer {...props} />}
				width={width}
			>
				<FlexColumn
					label='Index'
					dataKey='value'
					width={100}
				/>
				<FlexColumn
					label='Height'
					dataKey='height'
					width={width - 100}
				/>
			</SortableFlexTable>
		);
	}
}

const SortableInfiniteList = SortableContainer(({className, items, itemClass, sortingIndex}) => {
	return (
		<Infinite
			className={className}
			containerHeight={600}
			elementHeight={items.map(({height}) => height)}
		>
			{items.map(({value, height}, index) =>
				<Item
					key={`item-${index}`}
					className={itemClass}
					sortingIndex={sortingIndex}
					index={index}
					value={value}
					height={height}
				/>
			)}
		</Infinite>
	)
});

const SortableList = SortableContainer(({className, items, itemClass, sortingIndex, useDragHandle}) => {
	return (
		<div className={className}>
			{items.map(({value, height}, index) =>
				<Item
					key={`item-${value}`}
					className={itemClass}
					sortingIndex={sortingIndex}
					index={index}
					value={value}
					height={height}
					useDragHandle={useDragHandle}
				/>
			)}
		</div>
	);
});


storiesOf('Basic Configuration', module)
.add('Basic usage', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableList} items={getItems(50, 59)} helperClass={style.stylizedHelper} />
		</div>
	);
})
.add('Drag handle', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableList} useDragHandle={true} items={getItems(50, 59)} helperClass={style.stylizedHelper} />
		</div>
	);
})
.add('Elements of varying heights', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableList}  items={getItems(50)} helperClass={style.stylizedHelper} />
		</div>
	);
})
.add('Horizontal', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableList} axis={'x'} items={getItems(50, 300)} helperClass={style.stylizedHelper} className={classNames(style.list, style.stylizedList, style.horizontalList)} itemClass={classNames(style.stylizedItem, style.horizontalItem)} />
		</div>
	);
})

storiesOf('Advanced', module)
.add('Press delay (200ms)', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableList} items={getItems(50, 59)} pressDelay={200} helperClass={style.stylizedHelper} />
		</div>
	);
})
.add('Lock axis', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableList} items={getItems(50)} helperClass={style.stylizedHelper} lockAxis={'y'} lockToContainerEdges={true} lockOffset={['0%', '100%']} />
		</div>
	);
})
.add('Window as scroll container', () => {
	return (
		<ListWrapper component={SortableList} items={getItems(50, 59)} className="" useWindowAsScrollContainer={true} helperClass={style.stylizedHelper} />
	);
})

storiesOf('Customization', module)
.add('Minimal styling', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableList} items={getItems(50)} className={style.list} itemClass={style.item} helperClass={style.helper} />
		</div>
	);
})
.add('Transition duration', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableList} items={getItems(50, 59)} transitionDuration={450} helperClass={style.stylizedHelper} />
		</div>
	);
})
.add('Disable transitions', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableList} items={getItems(50, 59)} transitionDuration={0} helperClass={style.stylizedHelper} />
		</div>
	);
})

storiesOf('React Virtualized', module)
.add('Basic usage', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableVirtualList} items={getItems(500, 59)} itemHeight={59} helperClass={style.stylizedHelper} />
		</div>
	);
})
.add('Elements of varying heights', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableVirtualList} items={getItems(500)} itemHeight={89} helperClass={style.stylizedHelper}
				onSortEnd={(ref) => {
					// We need to inform React Virtualized that the item heights have changed
					let instance = ref.getWrappedInstance();
					let vs = instance.refs.vs;

					vs.recomputeRowHeights();
					instance.forceUpdate();
				}}
			/>
		</div>
	);
})
.add('FlexTable usage', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={FlexTableWrapper} items={getItems(500, 50)} itemHeight={50} helperClass={style.stylizedHelper} />
		</div>
	);
})

storiesOf('React Infinite', module)
.add('Basic usage', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableInfiniteList} items={getItems(500, 59)} helperClass={style.stylizedHelper} />
		</div>
	);
})
.add('Elements of varying heights', () => {
	return (
		<div className={style.root}>
			<ListWrapper component={SortableInfiniteList} items={getItems(500)} helperClass={style.stylizedHelper} />
		</div>
	);
})
