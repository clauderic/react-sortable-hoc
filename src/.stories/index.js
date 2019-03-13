import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {storiesOf} from '@storybook/react';
import style from './Storybook.scss';
import {SortableContainer, SortableElement, SortableHandle} from '../index';
import arrayMove from 'array-move';
import VirtualList from 'react-tiny-virtual-list';
import {FixedSizeList, VariableSizeList} from 'react-window';
import {defaultTableRowRenderer, Column, Table, List} from 'react-virtualized';
import '!style-loader!css-loader!react-virtualized/styles.css';
import Infinite from 'react-infinite';
import range from 'lodash/range';
import random from 'lodash/random';
import classNames from 'classnames';

function getItems(count, height) {
  var heights = [65, 110, 140, 65, 90, 65];
  return range(count).map((value) => {
    return {
      value,
      height: height || heights[random(0, heights.length - 1)],
    };
  });
}

const Handle = SortableHandle(() => (
  <div className={style.handle}>
    <svg viewBox="0 0 50 50">
      <path
        d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z"
        color="#000"
      />
    </svg>
  </div>
));

const Item = SortableElement((props) => {
  return (
    <div
      className={classNames(
        props.className,
        props.isDisabled && style.disabled,
      )}
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

const SortableList = SortableContainer(
  ({className, items, disabledItems = [], itemClass, shouldUseDragHandle}) => {
    return (
      <div className={className}>
        {items.map(({value, height}, index) => {
          const disabled = disabledItems.includes(value);

          return (
            <Item
              key={`item-${value}`}
              disabled={disabled}
              isDisabled={disabled}
              className={itemClass}
              index={index}
              value={value}
              height={height}
              shouldUseDragHandle={shouldUseDragHandle}
            />
          );
        })}
      </div>
    );
  },
);

class SortableListWithCustomContainer extends React.Component {
  state = {
    container: null,
  };

  render() {
    const {container} = this.state;

    return (
      <div id="CustomHelperContainer" ref={this.setContainerNode}>
        <SortableList {...this.props} helperContainer={container} />
      </div>
    );
  }

  setContainerNode = (node) => {
    this.setState({container: node});
  };
}

const Category = SortableElement((props) => {
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
  state = {
    items: this.props.items,
    isSorting: false,
  };

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
    disabledItems: PropTypes.arrayOf(PropTypes.string),
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

    this.setState({
      items: arrayMove(items, oldIndex, newIndex),
      isSorting: false,
    });

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

const SortableReactWindow = (Component) =>
  SortableContainer(
    class ReactWindowList extends React.Component {
      render() {
        const {className, items, itemHeight, height, width} = this.props;

        return (
          <Component
            ref="VirtualList"
            className={className}
            itemSize={
              itemHeight == null ? (index) => items[index].height : itemHeight
            }
            itemCount={items.length}
            width={width}
            height={height}
            children={this.renderRow}
          />
        );
      }

      renderRow = ({index, style}) => {
        const {items, itemClass} = this.props;
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
      };
    },
    {withRef: true},
  );

const SortableVirtualList = SortableContainer(
  ({className, items, height, width, itemHeight, itemClass}) => {
    return (
      <VirtualList
        className={className}
        itemSize={(index) => items[index].height}
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
  },
);

// Function components cannot have refs, so we'll be using a class for React Virtualized
class VirtualizedListWrapper extends Component {
  render() {
    const {className, items, height, width, itemHeight, itemClass} = this.props;
    return (
      <List
        ref="VirtualList"
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

const SortableVirtualizedList = SortableContainer(VirtualizedListWrapper, {
  withRef: true,
});
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
        getContainer={(wrappedInstance) =>
          ReactDOM.findDOMNode(wrappedInstance.Grid)
        }
        gridClassName={className}
        headerHeight={itemHeight}
        height={height}
        helperClass={helperClass}
        onSortEnd={onSortEnd}
        rowClassName={itemClass}
        rowCount={items.length}
        rowGetter={({index}) => items[index]}
        rowHeight={itemHeight}
        rowRenderer={(props) => <SortableRowRenderer {...props} />}
        width={width}
      >
        <Column label="Index" dataKey="value" width={100} />
        <Column label="Height" dataKey="height" width={width - 100} />
      </SortableTable>
    );
  }
}

const SortableInfiniteList = SortableContainer(
  ({className, items, itemClass}) => {
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
  },
);

const ShrinkingSortableList = SortableContainer(
  ({className, isSorting, items, itemClass, shouldUseDragHandle}) => {
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
  },
);

const NestedSortableList = SortableContainer(
  ({className, items, isSorting}) => {
    return (
      <div className={className}>
        {items.map((value, index) => (
          <Category key={`category-${value}`} index={index} value={value} />
        ))}
      </div>
    );
  },
);

storiesOf('General | Layout / Vertical list', module)
  .add('Basic setup', () => {
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
  .add('Variable heights', () => {
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

storiesOf('General | Layout / Horizontal list', module).add(
  'Basic setup',
  () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          axis={'x'}
          items={getItems(50, 300)}
          helperClass={style.stylizedHelper}
          className={classNames(
            style.list,
            style.stylizedList,
            style.horizontalList,
          )}
          itemClass={classNames(style.stylizedItem, style.horizontalItem)}
        />
      </div>
    );
  },
);

storiesOf('General | Layout / Grid', module).add('Basic setup', () => {
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
});

storiesOf('General | Configuration / Options', module)
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
  .add('Disabled items', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          items={getItems(10, 59)}
          helperClass={style.stylizedHelper}
          disabledItems={[2, 3, 7]}
        />
      </div>
    );
  })
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
  })
  .add('Custom sortable helper container', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableListWithCustomContainer}
          items={getItems(50, 59)}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  });

storiesOf('General | Configuration / Customization', module)
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

storiesOf('Other | Virtualization libraries / react-tiny-virtual-list', module)
  .add('Basic setup', () => {
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
  .add('Variable heights', () => {
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

storiesOf('Other | Virtualization libraries / react-window', module)
  .add('Basic setup', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableReactWindow(FixedSizeList)}
          items={getItems(500, 59)}
          itemHeight={59}
          helperClass={style.stylizedHelper}
        />
      </div>
    );
  })
  .add('Variable heights', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableReactWindow(VariableSizeList)}
          items={getItems(500)}
          helperClass={style.stylizedHelper}
          onSortEnd={(ref) => {
            // We need to inform React Virtualized that the item heights have changed
            const instance = ref.getWrappedInstance();
            const list = instance.refs.VirtualList;

            list.resetAfterIndex(0);
          }}
        />
      </div>
    );
  });

storiesOf('Other | Virtualization libraries / react-virtualized', module)
  .add('Basic setup', () => {
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
  .add('Variable heights', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableVirtualizedList}
          items={getItems(500)}
          itemHeight={89}
          helperClass={style.stylizedHelper}
          onSortEnd={(ref) => {
            // We need to inform React Virtualized that the item heights have changed
            const instance = ref.getWrappedInstance();
            const list = instance.refs.VirtualList;

            list.recomputeRowHeights();
            instance.forceUpdate();
          }}
        />
      </div>
    );
  })
  .add('Table', () => {
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

storiesOf('Other | Virtualization libraries / react-infinite', module)
  .add('Basic setup', () => {
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
  .add('Variable heights', () => {
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

storiesOf('Stress Test | Re-rendering before sorting', module).add(
  'Elements that shrink',
  () => {
    const getHelperDimensions = ({node}) => ({
      height: 20,
      width: node.offsetWidth,
    });
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
  },
);
