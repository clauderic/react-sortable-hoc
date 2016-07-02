import 'babel-polyfill';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from './src/index';
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
        const {items} = this.state;

        return (
            <div>
                {items.map((item, index) => <Item key={`item-${index}`} index={index} value={item}/>)}
            </div>
        );
    }
}

const SortableList = SortableContainer(List);

render(<SortableList />,
  document.getElementById('root')
)
