# React Sortable (HOC)

[![Join the chat at https://gitter.im/clauderic/react-sortable-hoc](https://badges.gitter.im/clauderic/react-sortable-hoc.svg)](https://gitter.im/clauderic/react-sortable-hoc?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://img.shields.io/npm/v/react-sortable-hoc.svg)](https://www.npmjs.com/package/react-sortable-hoc)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/clauderic/react-sortable-hoc/blob/master/LICENSE)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![Gitter](https://badges.gitter.im/clauderic/react-sortable-hoc.svg)](https://gitter.im/clauderic/react-sortable-hoc)

### Examples available here: <a href="#">http://clauderic.github.io/react-sortable-hoc/</a>

Features
---------------
* **Suuuper smooth animations** – Chasing the 60FPS dream 🌈
* **Higher Order Components** – Integrates with your existing components
* **Drag handle, locked axis, events, and more!**
* **Works with React Virtualized, React-Infinite, etc.**
* **Horizontal or vertical lists** ↔ ↕
* **Touch support** 👌

Installation
------------

Using [npm](https://www.npmjs.com/):

	$ npm install react-sortable-hoc --save


Then, using a module bundler that supports either CommonJS or ES2015 modules, such as [webpack](https://github.com/webpack/webpack):

```js
// Using an ES6 transpiler like Babel
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

// Not using an ES6 transpiler
var Sortable = require('react-sortable-hoc');
var SortableContainer = Sortable.SortableContainer;
var SortableElement = Sortable.SortableElement;
```

Alternatively, an UMD build is also available:
```html
<script src="react-sortable-hoc/dist/umd/react-sortable-hoc.js"></script>
```

Usage
------------
### Basic Example

```js
import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value}) => <li>{value}</li>);

const SortableList = SortableContainer(({items}) => {
	return (
		<ul>
			{items.map((value, index) =>
                <SortableItem key={`item-${index}`} index={index} value={value} />
            )}
		</ul>
	);
});

class SortableComponent extends Component {
    state = {
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']
    }
    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex)
        });
    };
    render() {
        return (
            <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />
        )
    }
}

render(<SortableComponent/>, document.getElementById('root'));
```
That's it! React Sortable does not come with any styles by default, since it's meant to enhance your existing components.

More code examples are available [here](https://github.com/clauderic/react-sortable-hoc/blob/master/examples/).

### Prop Types

#### SortableContainer HOC
| Property                   | Type     | Default | Description                                                                                                                                                                                                                  |
|:---------------------------|:---------|:--------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| axis                       | String   | `y`     | The axis you want to sort on, either 'x' or 'y'                                                                                                                                                                              |
| lockAxis                   | String   |         | If you'd like, you can lock movement to an axis while sorting. This is not something that is possible with HTML5 Drag & Drop                                                                                                 |
| helperClass                | String   |         | You can provide a class you'd like to add to the sortable helper to add some styles to it                                                                                                                                    |
| transitionDuration         | Number   | `300`   | The duration of the transition when elements shift positions. Set this to `0` if you'd like to disable transitions                                                                                                           |
| pressDelay                 | Number   | `0`     | If you'd like elements to only become sortable after being pressed for a certain time, change this property. A good sensible default value for mobile is `200`                                                               |
| onSortStart                | Function |         | Callback that get's invoked when sorting begins. `function({node, index, collection}, event)`                                                                                                                                |
| onSortMove                 | Function |         | Callback that get's invoked during sorting as the cursor moves. `function(event)`                                                                                                                                            |
| onSortEnd                  | Function |         | Callback that get's invoked when sortin ends. `function({oldIndex, newIndex, collection}, e)`                                                                                                                                |
| useDragHandle              | Boolean  | `false` | If you're using the `SortableHandle` HOC, set this to `true`                                                                                                                                                                 |
| useWindowAsScrollContainer | Boolean  | `false` | If you want, you can set the `window` as the scrolling container                                                                                                                                                             |
| hideSortableGhost          | Boolean  | `true`  | Whether to auto-hide the ghost element. By default, as a convenience, React Sortable List will automatically hide the element that is currently being sorted. Set this to false if you would like to apply your own styling. |
| lockToContainerEdges       | Boolean  | `false` | You can lock movement of the sortable element to it's parent `SortableContainer`                                                                                                                                             |

#### SortableElement HOC
| Property   | Type             | Default | Required? | Description                                                                                                                                                                                                                               |
|:-----------|:-----------------|:--------|:---------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| index      | Number           |         |     ✓     | This is the element's sortableIndex within it's collection. This prop is required.                                                                                                                                                        |
| collection | Number or String | `0`     |           | The collection the element is part of. This is useful if you have multiple groups of sortable elements within the same `SortableContainer`. [Example](http://clauderic.github.io/react-sortable-hoc/#/basic-configuration/multiple-lists) |
| disabled   | Boolean          | `false` |           | Whether the element should be sortable or not                                                                                                                                                                                             |

Dependencies
------------
React Sortable List has very few dependencies. It depends on `invariant` and a couple `lodash` functions. It has the following peerDependencies: `react`, `react-dom`

Contributions
------------
Yes please! Feature requests / pull requests are welcome.

<div align="center">
<a href="http://peoplelikeus.ca">
<img src="https://cloud.githubusercontent.com/assets/1416436/15581553/d7596d76-233a-11e6-9ac6-aade6b00f6b3.png" border="0" width="72"/>
</a>
</div>
<div align="center">
<small>Made with ❤︎ in the heart of Montreal.</small>
</div>
