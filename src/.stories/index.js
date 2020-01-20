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

import GroupedItems from './grouping-items';
import InteractiveElements from './interactive-elements-stress-test';

function getItems(count, height) {
  var heights = [65, 110, 140, 65, 90, 65];
  return range(count).map((value) => {
    return {
      value,
      height: height == null ? heights[random(0, heights.length - 1)] : height,
    };
  });
}

const Handle = SortableHandle(({tabIndex}) => (
  <div className={style.handle} tabIndex={tabIndex}>
    <svg viewBox="0 0 50 50">
      <path
        d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z"
        color="#000"
      />
    </svg>
  </div>
));

const Item = SortableElement(
  ({
    tabbable,
    className,
    isDisabled,
    height,
    style: propStyle,
    shouldUseDragHandle,
    value,
    itemIndex,
    isSorting,
  }) => {
    const bodyTabIndex = tabbable && !shouldUseDragHandle ? 0 : -1;
    const handleTabIndex = tabbable && shouldUseDragHandle ? 0 : -1;

    return (
      <div
        className={classNames(
          className,
          isDisabled && style.disabled,
          isSorting && style.sorting,
          shouldUseDragHandle && style.containsDragHandle,
        )}
        style={{
          height,
          ...propStyle,
        }}
        tabIndex={bodyTabIndex}
        data-index={itemIndex}
      >
        {shouldUseDragHandle && <Handle tabIndex={handleTabIndex} />}
        <div className={style.wrapper}>
          <span>Item</span> {value}
        </div>
      </div>
    );
  },
);

const SortableList = SortableContainer(
  ({
    className,
    items,
    disabledItems = [],
    itemClass,
    isSorting,
    shouldUseDragHandle,
    type,
  }) => {
    return (
      <div className={className}>
        {items.map(({value, height}, index) => {
          const disabled = disabledItems.includes(value);

          return (
            <Item
              tabbable
              key={`item-${value}`}
              disabled={disabled}
              isDisabled={disabled}
              className={itemClass}
              index={index}
              itemIndex={index}
              value={value}
              height={height}
              shouldUseDragHandle={shouldUseDragHandle}
              type={type}
              isSorting={isSorting}
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
  const tabIndex = props.tabbable ? 0 : -1;

  return (
    <div className={style.category}>
      <div className={style.categoryHeader}>
        <Handle tabIndex={tabIndex} />
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

  onSortStart = (sortEvent, nativeEvent) => {
    const {onSortStart} = this.props;
    this.setState({isSorting: true});

    document.body.style.cursor = 'grabbing';

    if (onSortStart) {
      onSortStart(sortEvent, nativeEvent, this.refs.component);
    }
  };

  onSortEnd = (sortEvent, nativeEvent) => {
    const {onSortEnd} = this.props;
    const {oldIndex, newIndex} = sortEvent;
    const {items} = this.state;

    this.setState({
      items: arrayMove(items, oldIndex, newIndex),
      isSorting: false,
    });

    document.body.style.cursor = '';

    if (onSortEnd) {
      onSortEnd(sortEvent, nativeEvent, this.refs.component);
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
            className={classNames(className, style.isSorting)}
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
        const {items, itemClass, isSorting} = this.props;
        const {value, height} = items[index];

        return (
          <Item
            tabbable
            key={value}
            index={index}
            className={itemClass}
            value={value}
            height={height}
            style={style}
            isSorting={isSorting}
          />
        );
      };
    },
    {withRef: true},
  );

const SortableVirtualList = SortableContainer(
  ({className, items, height, width, itemHeight, itemClass, isSorting}) => {
    return (
      <VirtualList
        className={className}
        itemSize={(index) => items[index].height}
        estimatedItemSize={itemHeight}
        renderItem={({index, style}) => {
          const {value, height} = items[index];
          return (
            <Item
              tabbable
              key={value}
              index={index}
              className={itemClass}
              value={value}
              height={height}
              style={style}
              isSorting={isSorting}
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
    const {
      className,
      items,
      height,
      width,
      itemHeight,
      itemClass,
      isSorting,
    } = this.props;
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
              tabbable
              key={value}
              index={index}
              className={itemClass}
              value={value}
              height={height}
              style={style}
              isSorting={isSorting}
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
  ({className, items, itemClass, isSorting}) => {
    return (
      <Infinite
        className={className}
        containerHeight={600}
        elementHeight={items.map(({height}) => height)}
        // for react-infinite, a larger preload is better for keyboard sorting
        preloadBatchSize={Infinite.containerHeightScaleFactor(2)}
        preloadAdditionalHeight={Infinite.containerHeightScaleFactor(2)}
      >
        {items.map(({value, height}, index) => (
          <Item
            tabbable
            key={`item-${index}`}
            className={itemClass}
            index={index}
            value={value}
            height={height}
            isSorting={isSorting}
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
            tabbable
            key={`item-${value}`}
            className={itemClass}
            index={index}
            value={value}
            height={isSorting ? 20 : height}
            shouldUseDragHandle={shouldUseDragHandle}
            isSorting={isSorting}
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
          <Category
            tabbable
            key={`category-${value}`}
            index={index}
            value={value}
          />
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

storiesOf('General | Layout / Grid', module)
  .add('Basic setup', () => {
    const transformOrigin = {
      x: 0,
      y: 0,
    };

    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          axis={'xy'}
          items={getItems(10, false)}
          helperClass={style.stylizedHelper}
          className={classNames(style.list, style.stylizedList, style.grid)}
          itemClass={classNames(style.stylizedItem, style.gridItem)}
        />
      </div>
    );
  })
  .add('Large first item', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableList}
          axis={'xy'}
          items={getItems(9, false)}
          helperClass={style.stylizedHelper}
          className={classNames(
            style.list,
            style.stylizedList,
            style.grid,
            style.gridVariableSized,
          )}
          itemClass={classNames(
            style.stylizedItem,
            style.gridItem,
            style.gridItemVariableSized,
          )}
          onSortStart={({node, helper}, event) => {
            const nodeBoundingClientRect = node.getBoundingClientRect();
            const helperWrapperNode = helper.childNodes[0];
            const transformOrigin = {
              x:
                ((event.clientX - nodeBoundingClientRect.left) /
                  nodeBoundingClientRect.width) *
                100,
              y:
                ((event.clientY - nodeBoundingClientRect.top) /
                  nodeBoundingClientRect.height) *
                100,
            };

            helperWrapperNode.style.transformOrigin = `${transformOrigin.x}% ${transformOrigin.y}%`;
          }}
          onSortOver={({nodes, newIndex, index, helper}) => {
            const finalNodes = arrayMove(nodes, index, newIndex);
            const oldNode = nodes[index].node;
            const newNode = nodes[newIndex].node;
            const helperScale = newNode.offsetWidth / oldNode.offsetWidth;
            const helperWrapperNode = helper.childNodes[0];

            helperWrapperNode.style.transform = `scale(${helperScale})`;

            finalNodes.forEach(({node}, i) => {
              const oldNode = nodes[i].node;
              const scale = oldNode.offsetWidth / node.offsetWidth;
              const wrapperNode = node.querySelector(`.${style.wrapper}`);

              wrapperNode.style.transform = `scale(${scale})`;
              wrapperNode.style.transformOrigin =
                newIndex > i ? '0 0' : '100% 0';
            });
          }}
          onSortEnd={({nodes}) => {
            nodes.forEach(({node}) => {
              const wrapperNode = node.querySelector(`.${style.wrapper}`);

              wrapperNode.style.transform = '';
            });
          }}
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

storiesOf(
  'Advanced examples | Virtualization libraries / react-tiny-virtual-list',
  module,
)
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

storiesOf('Advanced examples | Virtualization libraries / react-window', module)
  .add('Basic setup', () => {
    return (
      <div className={style.root}>
        <ListWrapper
          component={SortableReactWindow(FixedSizeList)}
          items={getItems(500, 59)}
          itemHeight={59}
          helperClass={style.stylizedHelper}
          onSortEnd={(_sortEvent, _nativeEvent, ref) => {
            // We need to inform React Window that the order of the items has changed
            const instance = ref.getWrappedInstance();
            const list = instance.refs.VirtualList;

            list.forceUpdate();
          }}
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
          onSortEnd={(_sortEvent, _nativeEvent, ref) => {
            // We need to inform React Window that the item heights have changed
            const instance = ref.getWrappedInstance();
            const list = instance.refs.VirtualList;

            list.resetAfterIndex(0);
          }}
        />
      </div>
    );
  });

storiesOf(
  'Advanced examples | Virtualization libraries / react-virtualized',
  module,
)
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
          onSortEnd={(_sortEvent, _nativeEvent, ref) => {
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

storiesOf(
  'Advanced examples | Virtualization libraries / react-infinite',
  module,
)
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

storiesOf('Advanced examples | Re-rendering before sorting', module)
  .add('Grouping items', () => (
    <div className={style.root}>
      <GroupedItems />
    </div>
  ))
  .add('Elements that shrink', () => {
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
  });

storiesOf('Stress Testing | Nested elements', module).add(
  'Interactive elements',
  () => (
    <div className={style.root}>
      <InteractiveElements />
    </div>
  ),
);
