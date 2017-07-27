const React = require('react');
const ReactDOM = require('react-dom');

const
{
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayInsert,
  arrayMove,
  DragLayer,
} = require('../index');

const { List } = require('react-virtualized');

function getItems(count, height, label="Item", value) {
  const result = [];
  for(let i = 0; i < count; i++)
  {
    const value = i;
    result[i] = {label, value, height};
  }
  return result;
}

const Item = SortableElement(props =>
{
  return (
    <div
      className="item-wrapper"
      style={{
        height: props.height,
        ...props.style,
      }}
    >
      <div className="item-body">
        <span>{props.label}</span> {props.value}
      </div>
    </div>);
});

const dragLayer = new DragLayer();

class ListWrapper extends React.Component {
  constructor({items}) {
    super();
    this.state = {
      items,
      isSorting: false,
    };
  }
  static propTypes = {
    items: React.PropTypes.array,
    className: React.PropTypes.string,
    itemClass: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    onSortStart: React.PropTypes.func,
    onSortEnd: React.PropTypes.func,
    onSortSwap: React.PropTypes.func,
    component: React.PropTypes.func,
    shouldUseDragHandle: React.PropTypes.bool,
    dragLayer: React.PropTypes.object,
    emulateUpdates: React.PropTypes.bool
  };
  static defaultProps = {
    className: "list",
    itemClass: "item",
    width: 300,
    height: 600,
  };
  onSortStart = () => {
    const {onSortStart} = this.props;
    this.setState({isSorting: true});

    // if (onSortStart) {
    //   onSortStart(this.refs.component);
    // }
  };
  onSortEnd = ({oldIndex, newIndex, newList}) => {
    const {onSortEnd} = this.props;
    const {items} = this.state;

    if(newList){
      newList.handleSortSwap(newIndex, {...items[oldIndex]});
      newIndex = -1;
    }

    this.setState({
      items: arrayMove(items, oldIndex, newIndex),
      isSorting: false,
    });

    if (onSortEnd) {
      onSortEnd(this.refs.component);
    }
  };
  onSortSwap = ({index, item}) => {
    const {onSortSwap} = this.props;
    const {items} = this.state;

    console.log(index);

    this.setState({
      items: arrayInsert(items, index, item),
      isSorting: true
    });

    // if (onSortSwap) {
    //   onSortSwap(this.refs.component);
    // }
  };

  componentWillUnmount() {
    clearTimeout(this.updateTimeoutId)
  }

  render() {
    const Component = this.props.component;
    const {items, isSorting} = this.state;
    const props = {
      isSorting,
      items,
      onSortEnd: this.onSortEnd,
      onSortStart: this.onSortStart,
      onSortSwap: this.onSortSwap,
      ref: 'component',
      useDragHandle: this.props.shouldUseDragHandle,
    };

    return <Component {...this.props} {...props} />;
  }
}

class VirtualizedListWrapper extends React.Component {
  render() {
    const {
      className,
      items,
      height,
      width,
      itemHeight,
      itemClass,
    } = this.props;
    return (
      <List
        ref="vs"
        className={className}
        rowHeight={({index}) => items[index].height}
        estimatedRowSize={itemHeight}
        rowRenderer={({index, style}) => {
          const {label, value, height} = items[index];
          return (
            <Item
              key={label + value}
              label={label}
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

const SortableVirtualizedList = SortableContainer(VirtualizedListWrapper, {withRef: true});

class TestComponent extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <div style={{position: "absolute", display: "inline-block", width: 900, height: 600, left: 0, top: 0}}>
        <div style={{position: "absolute", display: "inline-block", width: 300, height: 600, left: 0, top: 0}}>
        <ListWrapper
          component={SortableVirtualizedList}
          items={getItems(50, 59, "Dog")}
          helperClass="helper"
          dragLayer={dragLayer}
        />
        </div>
        <div style={{position: "absolute", display: "inline-block", width: 300, height: 600, left: 300, top: 0}}>
        <ListWrapper
          component={SortableVirtualizedList}
          items={getItems(50, 59, "Cat")}
          helperClass="helper"
          dragLayer={dragLayer}
        />
        </div>
        <div style={{position: "absolute", display: "inline-block", width: 300, height: 600, left: 600, top: 0}}>
        <ListWrapper
          component={SortableVirtualizedList}
          items={getItems(50, 59, "Mouse")}
          helperClass="helper"
          dragLayer={dragLayer}
        />
        </div>
      </div>);
  }
}

export default TestComponent
