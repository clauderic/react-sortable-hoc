import React from 'react';
import {sortableContainer} from '../../../../src';

import Item from '../Item';

import styles from './List.scss';

function List({items, isSorting, selectedItems, sortingItemKey, onItemSelect}) {
  return (
    <div className={styles.List}>
      {items.map((value, index) => {
        const isSelected = selectedItems.includes(value);
        const itemIsBeingDragged = sortingItemKey === value;

        return (
          <Item
            key={`item-${value}`}
            selected={isSelected}
            dragging={itemIsBeingDragged}
            sorting={isSorting}
            index={index}
            value={value}
            onClick={onItemSelect}
            selectedItemsCount={selectedItems.length}
          />
        );
      })}
    </div>
  );
}

export default sortableContainer(List);
