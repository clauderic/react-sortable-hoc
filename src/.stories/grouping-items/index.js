import React from 'react';
import arrayMove from 'array-move';
import {generateItems} from './utils';

import SortableList from './List';

class GroupedItems extends React.Component {
  state = {
    selectedItems: [],
    items: generateItems(50),
  };

  render() {
    const {items, selectedItems, sortingItemKey} = this.state;

    return (
      <SortableList
        items={items.filter(this.filterItems)}
        sortingItemKey={sortingItemKey}
        selectedItems={selectedItems}
        onItemSelect={this.handleItemSelect}
        shouldCancelStart={this.handleShouldCancelStart}
        updateBeforeSortStart={this.handleUpdateBeforeSortStart}
        onSortEnd={this.handleSortEnd}
        distance={3}
      />
    );
  }

  filterItems = (value) => {
    const {selectedItems, sortingItemKey, isSorting} = this.state;

    // Do not hide the ghost of the element currently being sorted
    if (sortingItemKey === value) {
      return true;
    }

    // Hide the other items that are selected
    if (isSorting && selectedItems.includes(value)) {
      return false;
    }

    // Do not hide any other items
    return true;
  };

  handleUpdateBeforeSortStart = ({index}) => {
    return new Promise((resolve) =>
      this.setState(
        ({items}) => ({
          sortingItemKey: items[index],
          isSorting: true,
        }),
        resolve,
      ),
    );
  };

  handleSortEnd = ({oldIndex, newIndex}) => {
    const {selectedItems} = this.state;
    let newItems;

    if (selectedItems.length) {
      const items = this.state.items.filter(
        (value) => !selectedItems.includes(value),
      );

      newItems = [
        ...items.slice(0, newIndex),
        ...selectedItems,
        ...items.slice(newIndex, items.length),
      ];
    } else {
      newItems = arrayMove(this.state.items, oldIndex, newIndex);
    }

    this.setState({
      items: newItems,
      isSorting: false,
      sortingItemKey: null,
      selectedItems: [],
    });
  };

  handleItemSelect = (item) => {
    this.setState(({selectedItems}) => {
      if (selectedItems.includes(item)) {
        return {
          selectedItems: selectedItems.filter((value) => value !== item),
        };
      }

      return {
        selectedItems: [...selectedItems, item],
      };
    });
  };

  handleShouldCancelStart = (event) => {
    const {items, selectedItems} = this.state;
    const item = items[event.target.sortableInfo.index];

    // Never cancel start if there are no selected items
    if (!selectedItems.length) {
      return false;
    }

    // If there are selected items, we want to cancel sorting
    // from starting when dragging elements that are not selected
    return !selectedItems.includes(item);
  };
}

export default GroupedItems;
