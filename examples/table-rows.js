import 'babel-polyfill';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from './src/index';
import './table-rows.css';

const SortableItem = SortableElement(({row}) => (
    <tr>
        <td>{row[0]}</td>
        <td>{row[1]}</td>
    </tr>
));

const SortableList = SortableContainer(({items}) => (
    <table>
        <tbody>
            {items.map((item, index) => <SortableItem key={`item-${index}`} index={index} row={item} />)}
        </tbody>
    </table>
));

class TableRows extends Component {
    state = {
        items: [
            ["to sort table rows", "in IE & Edge"],
            ["you will need to supply", "the prop translatableSelector=\"td\""],
            ["as table rows can't be translated in CSS", "but table cells can be"]
        ]
    };
    onSortEnd = ({oldIndex, newIndex}) => {
        let {items} = this.state;

        this.setState({
            items: arrayMove(items, oldIndex, newIndex)
        });
    };
    render() {
        const {items} = this.state;

        return <SortableList items={items} onSortEnd={this.onSortEnd} translatableSelector="td" />;
    }
}

render(<TableRows />,
  document.getElementById('root')
)
