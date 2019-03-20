import React from 'react';
import arrayMove from 'array-move';

import SortableList from './List';

const items = {
  input: <input placeholder="Regular text input" />,
  textarea: <textarea placeholder="Textarea input" />,
  select: (
    <select>
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </select>
  ),
  checkbox: (
    <>
      <label>
        <input type="checkbox" name="checkbox" />
        Checkbox 1
      </label>
      <label>
        <input type="checkbox" name="checkbox" />
        Checkbox 2
      </label>
    </>
  ),
  radio: (
    <>
      <label>
        <input type="radio" name="option" />
        Option 1
      </label>
      <label>
        <input type="radio" name="option" />
        Option 2
      </label>
    </>
  ),
  range: <input type="range" min="1" max="100" />,
  contentEditable: (
    <div
      contentEditable
      dangerouslySetInnerHTML={{
        __html: 'Lorem ipsum <strong>dolor sit</strong> amet',
      }}
    />
  ),
};

export default class InteractiveElements extends React.Component {
  state = {
    items: Object.entries(items),
  };

  render() {
    return (
      <SortableList
        // The distance prop isn't strictly required for this example, but it is recommended
        // to set it to a low value for sortable items with nested interactive elements
        // such as clickable labels for checkbox / radio inputs
        distance={2}
        items={this.state.items}
        onSortEnd={this.onSortEnd}
      />
    );
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({items}) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));
  };
}
