# React Split Pane

Split-Pane component built with [React](http://facebook.github.io/react), can be split vertically or horizontally.


[![Build Status](https://img.shields.io/travis/tomkp/react-split-pane/master.svg?style=flat-square)](https://travis-ci.org/tomkp/react-split-pane)
[![Coverage Status](https://img.shields.io/coveralls/tomkp/react-split-pane/master.svg?style=flat-square)](https://coveralls.io/r/tomkp/react-split-pane)


Check out the [demo](http://react-split-pane.surge.sh/)


```html
   <SplitPane split="vertical" minSize={50} defaultSize={100}>
       <div></div>
       <div></div>
   </SplitPane>
```

```html
    <SplitPane split="vertical" minSize={50}>
        <div></div>
        <SplitPane split="horizontal">
            <div></div>
            <div></div>
        </SplitPane>
    </SplitPane>
```

### Primary pane

By dragging 'draggable' surface you can change size of the first pane.
The first pane keeps then its size while the second pane is resized by browser window.
By default it is the left pane for 'vertical' SplitPane and the top pane for 'horizontal' SplitPane.
If you want to keep size of the second pane and let the first pane to shrink or grow by browser window dimensions,
set SplitPane prop `primary` to `second`. In case of 'horizontal' SplitPane the height of bottom pane remains the same.

Resizing can be disabled by passing the `enableResizing` prop as `false`. Resizing is enabled by default.

You can also set the size of the pane using the `size` prop. Note that a size set through props ignores the `defaultSize` and `minSize` properties.

In this example right pane keeps its width 200px while user is resizing browser window.

```html
    <SplitPane split="vertical" defaultSize={200} primary="second">
        <div></div>
        <div></div>
    </SplitPane>
```

### Persisting Positions

Each SplitPane accepts an onChange function prop.  Used in conjunction with
defaultSize and a persistence layer, you can ensure that your splitter choices
survive a refresh of your app.

For example, if you are comfortable with the trade-offs of localStorage, you
could do something like the following:

```html
    <SplitPane split="vertical" minSize={50}
               defaultSize={ localStorage.getItem('splitPos') }
               onChange={ size => localStorage.setItem('splitPos', size) }>
        <div></div>
        <div></div>
    </SplitPane>
```

Disclaimer: localStorage has a variety of performance trade-offs.  Browsers such
as Firefox have now optimized localStorage use so that they will asynchronously
initiate a read of all saved localStorage data for an origin once they know the
page will load.  If the data has not fully loaded by the time code accesses
localStorage, the code will cause the page's main thread to block until the
database load completes.  When the main thread is blocked, no other JS code will
run or layout will occur.  In multiprocess browsers and for users with fast
disk storage, this will be less of a problem.  You *are* likely to get yelled at
if you use localStorage.

A potentially better idea is to use something like
https://github.com/mozilla/localForage although hooking it up will be slightly
more involved.  You are likely to be admired by all for judiciously avoiding
use of localStorage.

### Resizing callbacks

If you need more control over resizing, SplitPane can notify you about when resizing started
and when it ended through two callbacks: `onDragStarted` and `onDragFinished`.

### Customise Dividers

By default it gives a 5 pixel wide divider, but you can use your own elements for the divider with the `resizerChildren` property. Check the demo for a custom horizontal divider with a header and a button.
