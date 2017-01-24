React Infinite
===
[![Build Status](https://travis-ci.org/seatgeek/react-infinite.svg?branch=master)](https://travis-ci.org/seatgeek/react-infinite)
[![Coverage Status](https://coveralls.io/repos/seatgeek/react-infinite/badge.svg)](https://coveralls.io/r/seatgeek/react-infinite)
[![npm version](https://badge.fury.io/js/react-infinite.svg)](http://badge.fury.io/js/react-infinite)
[![bitHound Score](https://www.bithound.io/github/seatgeek/react-infinite/badges/score.svg)](https://www.bithound.io/github/seatgeek/react-infinite)

**A browser-ready efficient scrolling container based on UITableView.**

**React Infinite 0.7.1 only supports React 0.14 and above. Please pin your package to 0.6.0 for React 0.13 support.**

- Support for both static and [variable element heights](https://github.com/seatgeek/react-infinite#elements-of-varying-heights)
- Built-in support for [infinite loading](https://github.com/seatgeek/react-infinite#number-infiniteloadbeginedgeoffset) of upcoming pages
- Ability to use the [window as the scroll container](https://github.com/seatgeek/react-infinite#bool-usewindowasscrollcontainer)
- Ability to be used as a [chat/messaging-style display](https://github.com/seatgeek/react-infinite#bool-displaybottomupwards)
- [94% test coverage with Jest](https://coveralls.io/github/seatgeek/react-infinite) and typechecked with Facebook's Flow
- [Examples are available](https://github.com/seatgeek/react-infinite/tree/master/examples) for experimentation

When a long list of DOM elements are placed in a scrollable container, all of them are kept in the DOM even when they are out the user's view. This is highly inefficient, especially in cases when scrolling lists can be tens or hundreds of thousands of items long. React Infinite solves this by rendering only DOM nodes that the user is able to see or might soon see. Other DOM nodes are clustered and rendered as a single blank node.

## Installation

### In the Browser
The relevant files are `dist/react-infinite.js` and `dist/react-infinite.min.js`. You **must** have React available as a global variable named `React` on the `window`. Including either file, through concatenation or a script tag, will produce a global variable named **`Infinite`** representing the component.

### In NPM
React Infinite uses a Universal Module Definition so you can use it in NPM as well. `npm install` this package and
```js
var Infinite = require('react-infinite');
```

### In Browserify
If you want to use the source with Browserify, the ES5-compiled source is directly requirable from the `/build` folder off NPM.

Otherwise, you can follow the instructions for NPM.

## Basic Use
### Elements of Equal Height
To use React Infinite with a list of elements you want to make scrollable, provide them to React Infinite as children.

```xml
<Infinite containerHeight={200} elementHeight={40}>
    <div className="one"/>
    <div className="two"/>
    <div className="three"/>
</Infinite>
```

### Elements of Varying Heights
If not all of the children have the same height, you must provide an array of integers to the `elementHeight` prop instead.
```xml
<Infinite containerHeight={200} elementHeight={[111, 252, 143]}>
    <div className="111-px"/>
    <div className="252-px"/>
    <div className="143-px"/>
</Infinite>
```

### Using the Window to Scroll (`useWindowAsScrollContainer` mode)
To use the entire window as a scroll container instead of just a single `div` (thus using `window.scrollY` instead of a DOM element's `scrollTop`), add the `useWindowAsScrollContainer` prop.

```xml
<Infinite containerHeight={200} elementHeight={[111, 252, 143]}
          useWindowAsScrollContainer>
    <div className="111-px"/>
    <div className="252-px"/>
    <div className="143-px"/>
</Infinite>
```

### As A Chat or Message Box (`displayBottomUpwards` mode)
React Infinite now supports being used as a chat box, i.e. appended elements appear at the bottom when added, and the loading of the next page occurs when the user scrolls to the top of the container. To do so, simply add the `displayBottomUpwards` prop. A [sample implementation](https://github.com/seatgeek/react-infinite/blob/master/examples/chat.jsx) can be consulted for more information - run `gulp develop` to compile the example files.

```xml
<Infinite containerHeight={200} elementHeight={[111, 252, 143]}
          displayBottomUpwards>
    // insert messages for subsequent pages at this point
    <div className="third-latest-chat"/>
    <div className="second-latest-chat"/>
    <div className="latest-chat-message"/>
</Infinite>
```

### Note on Smooth Scrolling
A wrapper `div` is applied that disables pointer events on the children for a default of 150 milliseconds after the last user scroll action for browsers with inertial scrolling. To configure this, set `timeScrollStateLastsForAfterUserScrolls`.

## Static Methods

#### **Function** `Infinite.containerHeightScaleFactor(Number number)`
This function allows a value to be specified for `preloadBatchSize` and `preloadAdditionalHeight` that is a relative to the container height. Please see the documentation for those two configuration options for further information on how to use it.

## Configuration Options

#### Children
The children of the `<Infinite>` element are the components you want to render. This gives you as much flexibility as you need in the presentation of those components. Each child can be a different component if you desire. If you wish to render a set of children not all of which have the same height, you must map each component in the children array to an number representing its height and pass it in as the `elementHeight` prop.

### Major Display Modes
By default, React Infinite renders a single element with the provided `containerHeight`, and the list sticks to the top like a regular table. However, you can choose to use the entire window as the scroll container or make React Infinite like a chatbox with the following options. They can be used together if you wish.

#### Bool `useWindowAsScrollContainer`
Defaults to `false`. This option allows the window to be used as the scroll container, instead of an arbitrary `div`, when it is set to `true`. This means that scroll position is detected by `window.scrollY` instead of the `scrollTop` of the `div` that React Infinite creates. Using this option is a way of achieving smoother scrolling on mobile before the problem is solved for container `div`s.

#### Bool `displayBottomUpwards`
Defaults to `false`. This allows React Infinite to be used as a chatbox. This means that the scroll is stuck to the bottom by default, and the user scrolls up to the top of the container to load the next page. The `children` are displayed in the same order.

### Configuration Options

#### (Required) Number | [Number] `elementHeight`
If each child element has the same height, you can pass a number representing that height as the `elementHeight` prop. If the children do not all have the same height, you can pass an array which is a map the children to numbers representing their heights to the `elementHeight` prop.

#### **Number** `containerHeight`
The height of the scrolling container in pixels. This is a **required** prop if `useWindowAsScrollContainer` is not set to `true`.

#### Number | Object `preloadBatchSize`
Defaults to `this.props.containerHeight * 0.5`. Imagine the total height of the scrollable divs. Now divide this equally into blocks `preloadBatchSize` pixels high. Every time the container's scrollTop enters each of these blocks the set of elements rendered in full are those contained within the block and elements that are within `preloadAdditionalHeight` above and below it.

When working with the window as the scroll container, it is sometimes useful to specify a scale factor relative to the container height as the batch size, so your code does not need to know anything about the `window`. To do this, use `Infinite.containerHeightScaleFactor`. So, for example, if you want the preloaded batch size to be twice the container height, write `preloadBatchSize={Infinite.containerHeightScaleFactor(2)}`.

#### Number | Object `preloadAdditionalHeight`
Defaults to `this.props.containerHeight`. The total height of the area in which elements are rendered in full is height of the current scroll block (see `preloadBatchSize`) as well as `preloadAdditionalHeight` above and below it.

When working with the window as the scroll container, it is sometimes useful to specify this relative to the container height. If you want the preloaded additional height to be twice the container height, write `preloadAdditionalHeight={Infinite.containerHeightScaleFactor(2)}`. Please see `preloadBatchSize` for more details.

#### **Function** `handleScroll(DOMNode node)`
Defaults to `function(){}`. A function that is called when the container is scrolled, i.e. when the `onScroll` event of the infinite scrolling container is fired. The only argument passed to it is the native DOM [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) of the scrolling container.

#### **Number** `infiniteLoadBeginBottomOffset`
**Deprecated as of 0.6.0. Please use `infiniteLoadBeginEdgeOffset`, which is identical but renamed.**

#### **Number** `infiniteLoadBeginEdgeOffset`
Defaults to `undefined`, which means that infinite loading is disabled. To disable infinite loading, do not provide this property or set it to undefined.

**Regular Mode**
When the user reaches this number of pixels from the bottom, the infinite load sequence will be triggered by showing the infinite load spinner delegate and calling the function `onInfiniteLoad`.

**`displayBottomUpwards` mode**
When the user reaches this number of pixels from the top of the container, the infinite load sequence will be triggered by showing the infinite loading spinner delegate at the top of the container and calling `onInfiniteLoad`.

#### Function `onInfiniteLoad()`
Defaults to `function(){}`. This function is called when the scroll exceeds `infiniteLoadBeginEdgeOffset`. Before this function is called, **the infinite loading spinner is automatically turned on**. You can set up infinite scrolling with this function like this:

1. Fetch a new page of records from the appropriate API
2. When the AJAX call returns, send the new list of elements (with the items that were just fetched) back as the children of React Infinite.
3. Set React Infinite's `isInfiniteLoading` prop to `false` to hide the loading spinner display

`onInfiniteLoad` relies heavily on passing props as a means of communication in the style of idiomatic React.

#### React Node `loadingSpinnerDelegate`
Defaults to `<div/>`. The element that is provided is used to render the loading view when React Infinite's `isInfiniteLoading` property is set to `true`. A React Node is anything that satisfies `React.PropTypes.node`.

#### Bool `isInfiniteLoading`
Defaults to `false`. This property determines whether the infinite spinner is showing.

#### Number `timeScrollStateLastsForAfterUserScrolls`
Defaults to `150` (in milliseconds). On Apple and some other devices, scroll is inertial. This means that the window continues to scroll for several hundred milliseconds after an `onScroll` event is fired. To prevent janky behavior, we do not want `pointer-events` to reactivate before the window has finished moving. Setting this parameter causes the `Infinite` component to think that the user is still scrolling for the specified number of milliseconds after the last `onScroll` event is received.

#### String `className`
Allows a CSS class to be set on the scrollable container.

## Sample Code

Code samples are now available in the `/examples` directory for your perusal. Two examples are provided, one for constant height with infinite loading and another with random variable heights with infinite loading. To generate the files necessary for the examples, execute `npm install && gulp build -E`. You may need to first install `gulp` with `npm install -g gulp`.

To get you started, here is some sample code that implements an infinite scroll with an simulated delay of 2.5 seconds. A [live demo of this example is available](http://chairnerd.seatgeek.com/react-infinite-a-browser-ready-efficient-scrolling-container-based-on-uitableview/) on our blog.

```js
var ListItem = React.createClass({
    render: function() {
        return <div className="infinite-list-item">
        List Item {this.props.num}
        </div>;
    }
});

var InfiniteList = React.createClass({
    getInitialState: function() {
        return {
            elements: this.buildElements(0, 20),
            isInfiniteLoading: false
        }
    },

    buildElements: function(start, end) {
        var elements = [];
        for (var i = start; i < end; i++) {
            elements.push(<ListItem key={i} num={i}/>)
        }
        return elements;
    },

    handleInfiniteLoad: function() {
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        setTimeout(function() {
            var elemLength = that.state.elements.length,
                newElements = that.buildElements(elemLength, elemLength + 1000);
            that.setState({
                isInfiniteLoading: false,
                elements: that.state.elements.concat(newElements)
            });
        }, 2500);
    },

    elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading...
        </div>;
    },

    render: function() {
        return <Infinite elementHeight={40}
                         containerHeight={250}
                         infiniteLoadBeginEdgeOffset={200}
                         onInfiniteLoad={this.handleInfiniteLoad}
                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
                         isInfiniteLoading={this.state.isInfiniteLoading}
                         >
            {this.state.elements}
        </Infinite>;
    }
});

ReactDOM.render(<InfiniteList/>, document.getElementById('react-example-one'));
```

SeatGeek also currently uses React Infinite in production on our event pages; because we only have pages for events in the future, a link would not be appropriate. To see one, head to one of our team pages for the [New York Giants](https://seatgeek.com/new-york-giants-tickets), or the [New York Mets](https://seatgeek.com/new-york-mets-tickets), or the [New York Knicks](https://seatgeek.com/new-york-knicks-tickets), and click on the green button for an event to see them in action in the Omnibox.

![](http://cl.ly/image/0y0L04220U2T/Screen%20Shot%202014-10-16%20at%2010.56.19%20AM.png)

# Contributing to React Infinite

Useful notes for [how to contribute](https://github.com/seatgeek/react-infinite/blob/master/docs/developing.md) are available.
