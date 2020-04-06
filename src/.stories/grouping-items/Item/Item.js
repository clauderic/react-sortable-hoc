import React from 'react';
import classNames from 'classnames';
import {sortableElement} from '../../../../src';

import styles from './Item.scss';

const ENTER_KEY = 13;

function Item(props) {
  const {
    dragging,
    sorting,
    onClick,
    selected,
    selectedItemsCount,
    value,
  } = props;
  const shouldRenderItemCountBadge = dragging && selectedItemsCount > 1;

  return (
    <div
      className={classNames(
        styles.Item,
        selected && !dragging && styles.selected,
        dragging && styles.dragging,
        sorting && styles.sorting,
      )}
      onClick={() => onClick(value)}
      onKeyPress={(event) => {
        if (event.which === ENTER_KEY) {
          onClick(value);
        }
      }}
      tabIndex={0}
    >
      Item {value}
      {shouldRenderItemCountBadge ? <Badge count={selectedItemsCount} /> : null}
    </div>
  );
}

function Badge(props) {
  return <div className={styles.Badge}>{props.count}</div>;
}

export default sortableElement(Item);
