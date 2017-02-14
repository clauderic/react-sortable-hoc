import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {storiesOf} from '@kadira/storybook';
import style from './Storybook.scss';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from '../index';
import VirtualList from 'react-tiny-virtual-list';
import {
  defaultTableRowRenderer,
  Column,
  Table,
  List,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import Infinite from 'react-infinite';
import range from 'lodash/range';
import random from 'lodash/random';
import findIndex from 'lodash/findIndex';
import classNames from 'classnames';

function getItems(count, height, label) {
	var heights = [65, 110, 140, 65, 90, 65];
	return range(count).map((value) => {
		return {
			value: label ? label + value : value,
			height: height || heights[random(0, heights.length - 1)]
		};
	});
}

const Handle = SortableHandle(() => <div className={style.handle} />);

const Item = SortableElement(props => {
  return (
    <div
      className={props.className}
      style={{
        height: props.height,
        ...props.style,
      }}
    >
      {props.shouldUseDragHandle && <Handle />}
      <div className={style.wrapper}>
        <span>Item</span> {props.value}
      </div>
    </div>
  );
});

const SortableList = SortableContainer(({
  className,
  items,
  itemClass,
  shouldUseDragHandle,
}) => {
  return (
    <div className={className}>
      {items.map(({value, height}, index) => (
        <Item
          key={`item-${value}`}
          className={itemClass}
          index={index}
          value={value}
          height={height}
          shouldUseDragHandle={shouldUseDragHandle}
        />
      ))}
    </div>
  );
});

const Category = SortableElement(props => {
  return (
    <div className={style.category}>
      <div className={style.categoryHeader}>
        <Handle />
        <span>Category {props.value}</span>
      </div>
      <ListWrapper
        component={SortableList}
        className={style.categoryList}
        items={getItems(3, 59)}
        shouldUseDragHandle={true}
        helperClass={style.stylizedHelper}
      />
    </div>
  );
});

class ListWrapper extends Component {
  constructor({items}) {
    super();
    this.state = {
      items,
      isSorting: false,
    };
  }
  static propTypes = {
    items: PropTypes.array,
    className: PropTypes.string,
    itemClass: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    onSortStart: PropTypes.func,
    onSortEnd: PropTypes.func,
    component: PropTypes.func,
    shouldUseDragHandle: PropTypes.bool,
  };
  static defaultProps = {
    className: classNames(style.list, style.stylizedList),
    itemClass: classNames(style.item, style.stylizedItem),
    width: 400,
    height: 600,
  };
  onSortStart = () => {
    const {onSortStart} = this.props;
    this.setState({isSorting: true});

    if (onSortStart) {
      onSortStart(this.refs.component);
    }
  };
  onSortEnd = ({oldIndex, newIndex}) => {
    const {onSortEnd} = this.props;
    const {items} = this.state;

    this.setState({items: arrayMove(items, oldIndex, newIndex), isSorting: false});

    if (onSortEnd) {
      onSortEnd(this.refs.component);
    }
  };
  render() {
    const Component = this.props.component;
    const {items, isSorting} = this.state;
    const props = {
      isSorting,
      items,
      onSortEnd: this.onSortEnd,
      onSortStart: this.onSortStart,
      ref: 'component',
      useDragHandle: this.props.shouldUseDragHandle,
    };

    return <Component {...this.props} {...props} />;
  }
}


const SortableVirtualList = SortableContainer(({
  className,
  items,
  height,
  width,
  itemHeight,
  itemClass,
  sortingIndex,
}) => {
  return (
    <VirtualList
      className={className}
      itemSize={index => items[index].height}
      estimatedItemSize={itemHeight}
      renderItem={({index, style}) => {
        const {value, height} = items[index];
        return (
          <Item
            key={value}
            index={index}
            className={itemClass}
            value={value}
            height={height}
            style={style}
          />
        );
      }}
      itemCount={items.length}
      width={width}
      height={height}
    />
  );
});
class GroupWrapper extends Component {
	constructor({components}) {
		super();
		this.state = {
			components: components.map((c, i) => ({...c, key: `list-${i}`}))
		};
		this.group = new SortableGroup(this.handleMove, this.getRefs);
	}
	static propTypes = {
		components: PropTypes.arrayOf(React.PropTypes.shape({
			component: PropTypes.func,
			className: PropTypes.string,
			wrapperClass: PropTypes.string,
			itemClass: PropTypes.string,
			items: React.PropTypes.array
		}))
	}
	
	handleMove = (oldIndex, oldList, newIndex, newList) => {
    	let components = this.state.components.slice(0);
    	let index = findIndex(components, { 'key': oldList});
    	let switchItem = components[index].items[oldIndex];
		
		// item found
		if(switchItem){
			
			// remove from old list
			components[index].items.splice(oldIndex, 1);
			
			// change list if required
			if(newList != oldList){
				index = findIndex(components, { 'key': newList});
			}
			
			// add to new list
			components[index].items.splice(newIndex, 0, switchItem);
		}
    	
    	this.setState({
	        components
	    });
	}
	
	getRefs = () => {
		return this.refs;
	}
	
    renderComponent = (c) => {
    	const Component = c.component;
    	const props = {
			isSorting: false,
			onSortStart: (item, e) => this.group.onSortStart(item, e, c.key),
			onSortMove: this.group.onSortMove,
			onSortEnd: this.group.onSortEnd,
			ref: c.key,
			...c
		};
		return <Component {...props} />;
    }
    
	render(){
		const {wrapperClass} = this.props;
		const {components} = this.state;
		return (
		  <div className={wrapperClass}>
		    {components.map(c => this.renderComponent(c))}
		  </div>
		);
	}
} 

// Function components cannot have refs, so we'll be using a class for React Virtualized
class VirtualizedListWrapper extends Component {
  render() {
    const {
      className,
      items,
      height,
      width,
      itemHeight,
      itemClass,
    } = this.props;
    return (
      <List
        ref="vs"
        className={className}
        rowHeight={({index}) => items[index].height}
        estimatedRowSize={itemHeight}
        rowRenderer={({index, style}) => {
          const {value, height} = items[index];
          return (
            <Item
              key={value}
              index={index}
              className={itemClass}
              value={value}
              height={height}
              style={style}
            />
          );
        }}
        rowCount={items.length}
        width={width}
        height={height}
      />
    );
  }
}

const SortableVirtualizedList = SortableContainer(VirtualizedListWrapper, {withRef: true});
const SortableTable = SortableContainer(Table, {withRef: true});
const SortableRowRenderer = SortableElement(defaultTableRowRenderer);

class TableWrapper extends Component {
  static propTypes = {
    items: PropTypes.array,
    className: PropTypes.string,
    helperClass: PropTypes.string,
    itemClass: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    itemHeight: PropTypes.number,
    onSortEnd: PropTypes.func,
  };
  render() {
    const {
      className,
      height,
      helperClass,
      itemClass,
      itemHeight,
      items,
      onSortEnd,
      width,
    } = this.props;

    return (
      <SortableTable
        getContainer={wrappedInstance => ReactDOM.findDOMNode(wrappedInstance.Grid)}
        gridClassName={className}
        headerHeight={itemHeight}
        height={height}
        helperClass={helperClass}
        onSortEnd={onSortEnd}
        rowClassName={itemClass}
        rowCount={items.length}
        rowGetter={({index}) => items[index]}
        rowHeight={itemHeight}
        rowRenderer={props => <SortableRowRenderer {...props} />}
        width={width}
      >
        <Column label="Index" dataKey="value" width={100} />
        <Column label="Height" dataKey="height" width={width - 100} />
      </SortableTable>
    );
  }
}

const SortableInfiniteList = SortableContainer(({
  className,
  items,
  itemClass,
}) => {
  return (
    <Infinite
      className={className}
      containerHeight={600}
      elementHeight={items.map(({height}) => height)}
    >
      {items.map(({value, height}, index) => (
        <Item
          key={`item-${index}`}
          className={itemClass}
          index={index}
          value={value}
          height={height}
        />
      ))}
    </Infinite>
  );
});

const ShrinkingSortableList = SortableContainer(({
  className,
  isSorting,
  items,
  itemClass,
  shouldUseDragHandle,
}) => {
  return (
    <div className={className}>
      {items.map(({value, height}, index) => (
        <Item
          key={`item-${value}`}
          className={itemClass}
          index={index}
          value={value}
          height={isSorting ? 20 : height}
          shouldUseDragHandle={shouldUseDragHandle}
        />
      ))}
    </div>
  );
});

const NestedSortableList = SortableContainer(({
  className,
  items,
  isSorting,
}) => {
  return (
    <div className={className}>
      {items.map((value, index) => (
        <Category key={`category-${value}`} index={index} value={value} />
      ))}
    </div>
  );
});

storiesOf('Basic Configuration', module)
  .add('Basic usage', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          items={getItems(50, 59)}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  })
  .add('Drag handle', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          shouldUseDragHandle={true}
          items={getItems(50, 59)}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  })
  .add('Elements of varying heights', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          items={getItems(50)}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  })
  .add('Elements that shrink', () => {
    const getHelperDimensions = ({node}) => ({height: 20, width: node.offsetWidth});
    return (
      <div className={style.root}>
        <ListWrapper
          component={ShrinkingSortableList}
          items={getItems(50)}
          helperClass={style.shrinkedHelper}
          getHelperDimensions={getHelperDimensions}
        />
      </div>
    );
  })
  .add('Horizontal', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          axis={'x'}
          items={getItems(50, 300)}
          helperClass={style.stylizedHelper}
          className={classNames(style.list, style.stylizedList, style.horizontalList)}
          itemClass={classNames(style.stylizedItem, style.horizontalItem)}
        />
      </div>
    );
  })
  .add('Grid', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          axis={'xy'}
          items={getItems(10, 110)}
          helperClass={style.stylizedHelper}
          className={classNames(style.list, style.stylizedList, style.grid)}
          itemClass={classNames(style.stylizedItem, style.gridItem)}
        />
      </div>
    );
  })
  .add('Nested Lists', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={NestedSortableList}
          items={range(4)}
          shouldUseDragHandle={true}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  });

storiesOf('Advanced', module)
  .add('Press delay (200ms)', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          items={getItems(50, 59)}
          pressDelay={200}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  })
  .add('Distance (20px)', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          items={getItems(50, 50)}
          distance={20}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  })
  .add('Lock axis', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          items={getItems(50)}
          helperClass={style.stylizedHelper}
          lockAxis={'y'}
          lockToContainerEdges={true}
          lockOffset={['0%', '100%']}
        />
      </div>
    );
  })
  .add('Window as scroll container', () => {
    return (
      <ListWrapper
        component={SortableList}
        items={getItems(50, 59)}
        className=""
        useWindowAsScrollContainer={true}
        helperClass={style.stylizedHelper}
      />
    );
  });

storiesOf('Grouping', module)
.add('Vertical', () => {
	const className = classNames(style.list, style.stylizedList);
	const itemClass = classNames(style.item, style.stylizedItem);
	return (
		<GroupWrapper
			wrapperClass={style.vertGroups}
			components={[
				{component:SortableList, className:className, itemClass:itemClass, items:getItems(5, 59, 'Dog')},
				{component:SortableList, className:className, itemClass:itemClass, items:getItems(5, 59, 'Cat')},
				{component:SortableList, className:className, itemClass:itemClass, items:getItems(5, 59, 'Bird')}
			]}
		/>
	);
})
.add('Horizontal', () => {
	const className = classNames(style.list, style.stylizedList, style.horizontalList);
	const itemClass = classNames(style.item, style.stylizedItem, style.horizontalItem);
	return (
		<GroupWrapper
			wrapperClass={style.root}
			components={[
				{component:SortableList, className:className, itemClass:itemClass, items:getItems(5, 300, 'Dog'), axis:'x'},
				{component:SortableList, className:className, itemClass:itemClass, items:getItems(5, 300, 'Cat'), axis:'x'}
			]}
		/>
	);
})
.add('Grid', () => {
	const className = classNames(style.list, style.stylizedList, style.grid);
	const itemClass = classNames(style.stylizedItem, style.gridItem);
	return (
		<GroupWrapper
			wrapperClass={style.root}
			components={[
				{component:SortableList, className:className, itemClass:itemClass, items:getItems(5, 110, 'Dog'), axis:'xy'},
				{component:SortableList, className:className, itemClass:itemClass, items:getItems(5, 110, 'Cat'), axis:'xy'}
			]}
		/>
	);
})
.add('Different Height Containers', () => {
	const classNameA = classNames(style.list, style.stylizedList, style.sizedA);
	const classNameB = classNames(style.list, style.stylizedList, style.sizedB);
	const itemClass = classNames(style.item, style.stylizedItem);
	return (
		<GroupWrapper
			wrapperClass={style.root}
			components={[
				{component:SortableList, className:classNameA, itemClass:itemClass, items:getItems(3, 50, 'Dog')},
				{component:SortableList, className:classNameB, itemClass:itemClass, items:getItems(3, 50, 'Cat')}
			]}
		/>
	);
})

storiesOf('Customization', module)
  .add('Minimal styling', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          items={getItems(50)}
          className={style.list}
          itemClass={style.item}
          helperClass={style.helper}
        />
      </div>
    );
  })
  .add('Transition duration', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          items={getItems(50, 59)}
          transitionDuration={450}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  })
  .add('Disable transitions', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          items={getItems(50, 59)}
          transitionDuration={0}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  });

storiesOf('react-tiny-virtual-list', module)
  .add('Basic usage', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableVirtualList}
          items={getItems(500, 59)}
          itemHeight={59}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  })
  .add('Elements of varying heights', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableVirtualList}
          items={getItems(500)}
          itemHeight={89}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  });

storiesOf('react-virtualized', module)
  .add('Basic usage', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableVirtualizedList}
          items={getItems(500, 59)}
          itemHeight={59}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  })
  .add('Elements of varying heights', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableVirtualizedList}
          items={getItems(500)}
          itemHeight={89}
          helperClass={style.stylizedHelper}
          onSortEnd={ref => {
            // We need to inform React Virtualized that the item heights have changed
            const instance = ref.getWrappedInstance();
            const vs = instance.refs.vs;

            vs.recomputeRowHeights();
            instance.forceUpdate();
          }}
        />
      </div>
    );
  })
  .add('Table usage', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={TableWrapper}
          items={getItems(500, 50)}
          itemHeight={50}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  });

storiesOf('react-infinite', module)
  .add('Basic usage', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableInfiniteList}
          items={getItems(500, 59)}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  })
  .add('Elements of varying heights', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableInfiniteList}
          items={getItems(500)}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  });
