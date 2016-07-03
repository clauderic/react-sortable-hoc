import 'babel-polyfill';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from './src/index';
import range from 'lodash/range';
import random from 'lodash/random';

const SortableItem = SortableElement(({height, value}) => (
    <div style={{
        position: 'relative',
        width: '100%',
        display: 'block',
        padding: 20,
        borderBottom: '1px solid #DEDEDE',
        boxSizing: 'border-box',
        WebkitUserSelect: 'none',
        height: height
    }}>
        Item {value}
    </div>
));

const SortableList = SortableContainer(({items}) => (
    <div>
        {items.map(({height, value}, index) => <SortableItem key={`item-${index}`} index={index} value={value} height={height}/>)}
    </div>
));

class Example extends Component {
    state = {
        items: range(100).map((value) => {
            return {
                value,
                height: random(49, 120)
            };
        })
    };
    onSortEnd = ({oldIndex, newIndex}) => {
        let {items} = this.state;
        arrayMove(items, oldIndex, newIndex);
        this.setState({items});
    };
    render() {
        const {items} = this.state;

        return <SortableList items={items} onSortEnd={this.onSortEnd} />;
    }
}

render(<Example />,
  document.getElementById('root')
)
