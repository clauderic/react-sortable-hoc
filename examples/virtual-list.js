import React, { Component } from 'react';
import { render } from 'react-dom';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { List } from 'react-virtualized';

const SortableItem = SortableElement(({ value }) => {
  return (
    <li>
      {value}
    </li>
  );
});

class VirtualList extends Component {
  render() {
    let { items } = this.props;

    return (
      <List
        ref={(instance) => {
          this.List = instance;
        }}
        rowHeight={({ index }) => items[index].height}
        rowRenderer={({ index }) => {
          let { value } = items[index];
          return <SortableItem index={index} value={value} />;
        }}
        rowCount={items.length}
        width={400}
        height={600}
      />
    );
  }
}

/*
 * Important note:
 * To access the ref of a component that has been wrapped with the SortableContainer HOC,
 * you *must* pass in {withRef: true} as the second param. Refs are opt-in.
 */
const SortableList = SortableContainer(VirtualList, { withRef: true });

class SortableComponent extends Component {
  state = {
    items: [
      { value: 'Item 1', height: 89 },
      { value: 'Item 2', height: 59 },
      { value: 'Item 3', height: 130 },
      { value: 'Item 4', height: 59 },
      { value: 'Item 5', height: 200 },
      { value: 'Item 6', height: 150 },
    ],
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      let { items } = this.state;

      this.setState({
        items: arrayMove(items, oldIndex, newIndex),
      });

      // We need to inform React Virtualized that the items have changed heights
      let instance = this.SortableList.getWrappedInstance();

      instance.List.recomputeRowHeights();
      instance.forceUpdate();
    }
  };
  render() {
    let { items } = this.state;

    return (
      <SortableList
        ref={(instance) => {
          this.SortableList = instance;
        }}
        items={items}
        onSortEnd={this.onSortEnd}
      />
    );
  }
}

render(<SortableComponent />, document.getElementById('root'));
