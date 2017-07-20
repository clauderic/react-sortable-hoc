import 'babel-polyfill';
import * as React from 'react';
import {render} from 'react-dom';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
  SortEndHandler,
  SortableElementProps,
  SortableContainerProps,
} from './src/index';
import {range, random} from 'lodash';

interface ItemProps {
  value: number;
  height: number;
}

class Item extends React.Component<ItemProps, never> {
  render() {
    const {height, value} = this.props;

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'block',
          padding: 20,
          backgroundColor: '#FFF',
          borderBottom: '1px solid #EFEFEF',
          boxSizing: 'border-box',
          WebkitUserSelect: 'none',
          height: height,
        }}
      >
        Item {value}
      </div>
    );
  }
}

const SortableItem = SortableElement(Item);

interface ListProps {
  items: ItemProps[];
}

const List = ({
  items,
}: ListProps) =>
  <div
    style={{
      width: '80%',
      height: '80vh',
      maxWidth: '500px',
      margin: '0 auto',
      overflow: 'auto',
      backgroundColor: '#f3f3f3',
      border: '1px solid #EFEFEF',
      borderRadius: 3,
    }}
  >
    {items.map(({height, value}, index) =>
      <SortableItem
        key={`item-${index}`}
        index={index}
        collection={0}
        value={value}
        height={height}
      />
    )}
  </div>;

const SortableList = SortableContainer(List);

interface State {
  items: ItemProps[];
}

class Example extends React.Component<{}, State> {
  state = {
    items: range(100).map(value => {
      return {
        value,
        height: random(49, 120),
      };
    }),
  };
  onSortEnd: SortEndHandler = ({oldIndex, newIndex}) => {
    let {items} = this.state;

    this.setState({
      items: arrayMove(items, oldIndex, newIndex),
    });
  };
  render() {
    const {items} = this.state;

    return <SortableList items={items} onSortEnd={this.onSortEnd} />;
  }
}

render(<Example />, document.getElementById('root'));
