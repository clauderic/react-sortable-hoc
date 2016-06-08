import 'babel-polyfill';
import React, {Component} from 'react';
import { render } from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from './src/index';
import {VirtualScroll} from 'react-virtualized';
import Infinite from 'react-infinite';
import 'react-virtualized/styles.css';
import range from 'lodash/range';
import random from 'lodash/random';

const Item = SortableElement((props) => {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            display: 'block',
            padding: 20,
            borderBottom: '1px solid #DEDEDE',
            boxSizing: 'border-box',
            WebkitUserSelect: 'none',
            visibility: (props.index === props.sortingIndex) ? 'hidden' : null,
            height: props.height
        }}>
            Item {props.value}
        </div>
    )
});

class List extends Component {
    state = {
        items: range(5000).map((value) => {
            return {
                value,
                height: random(49, 120)
            };
        })
    };
    onSortEnd = (previousIndex, newIndex) => {
        let {items} = this.state;
        arrayMove(items, previousIndex, newIndex);
        this.setState({items});
    };
    render() {
        let {sortingIndex} = this.props;
        const {items} = this.state;

        // return (
        //     <VirtualScroll
        //         rowHeight={59}
        //         overscanRowCount={0}
        //         rowRenderer={({index}) => {
        //             return <Item index={index} sortingIndex={sortingIndex} value={items[index]}/>;
        //         }}
        //         rowCount={300}
        //         width={500}
        //         height={400}
        //     />
        // );


        return (
            <Infinite
                containerHeight={400}
                elementHeight={items.map((item) => item.height)}
            >
                {items.map(({value, height}, index) => <Item key={`item-${index}`} sortingIndex={sortingIndex} index={index} value={value} height={height}/>)}
            </Infinite>
        );

        // return (
        //     <div>
        //         {items.map((item, index) => <Item key={`item-${index}`} sortingIndex={sortingIndex} index={index} value={item}/>)}
        //     </div>
        // );
    }
}

const SortableList = SortableContainer(List);

render(<SortableList useWindowAsScrollContainer={false} />,
  document.getElementById('root')
)
