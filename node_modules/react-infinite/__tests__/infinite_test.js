/* eslint-env jest, jasmine */

jest.dontMock('../src/react-infinite.jsx');
jest.dontMock('../src/computers/infiniteComputer.js');
jest.dontMock('../src/computers/constantInfiniteComputer.js');
jest.dontMock('../src/computers/arrayInfiniteComputer.js');
jest.dontMock('../src/utils/binaryIndexSearch.js');
jest.dontMock('../src/utils/infiniteHelpers.js');
jest.dontMock('./helpers/renderHelpers.js');
jest.dontMock('lodash.isfinite');
jest.dontMock('lodash.isarray');
jest.dontMock('react-dom');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Infinite = require('../src/react-infinite.jsx');

var renderHelpers = require('./helpers/renderHelpers');

describe('Rendering the React Infinite Component Wrapper', function() {
  it('does not throw an error when given no children', function() {
    expect(function() {
      TestUtils.renderIntoDocument(
        <Infinite elementHeight={200}
                  containerHeight={800}
                  className={"root-scrollable-node"}>
        </Infinite>
      );
    }).not.toThrow();
  });

  it('does not throw an error when given only one child', function() {
    expect(function() {
      TestUtils.renderIntoDocument(
        <Infinite elementHeight={200}
                  containerHeight={800}
                  className={"root-scrollable-node"}>
          <div/>
        </Infinite>
      );
    }).not.toThrow();
  });

  it('renders itself into the DOM with the correct container styles', function() {
    var infinite = TestUtils.renderIntoDocument(
        <Infinite elementHeight={200}
                  containerHeight={800}
                  className={"root-scrollable-node"}>
          <div/>
          <div/>
        </Infinite>
      );

    var rootScrollable = TestUtils.findRenderedDOMComponentWithClass(infinite, 'root-scrollable-node');
    expect(rootScrollable.style.height).toEqual('800px');
    expect(rootScrollable.style.overflowX).toEqual('hidden');
    expect(rootScrollable.style.overflowY).toEqual('scroll');
    expect(rootScrollable.style.WebkitOverflowScrolling).toEqual('touch');
  });

  it('applies the provided class name to the root node', function() {
    var infinite = TestUtils.renderIntoDocument(
        <Infinite elementHeight={200}
                  containerHeight={800}
                  className={"correct-class-name"}>
          <div/>
          <div/>
        </Infinite>
      );

    expect(infinite.props.className).toEqual('correct-class-name');
  });

  it('allows preloadBatchSize to be zero', function() {
    var renderedInfinite = TestUtils.renderIntoDocument(<Infinite elementHeight={[28, 28]} containerHeight={100}
                             preloadBatchSize={0}>
                        <li>Test1</li>
                        <li>Test2</li>
                    </Infinite>);

    TestUtils.Simulate.scroll(ReactDOM.findDOMNode(renderedInfinite));
  });
});

describe('The Children of the React Infinite Component', function() {
  it('renders its children when no hiding behavior is required', function() {
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={200}
                  containerHeight={800}
                  className={"correct-class-name"}>
          <div className={"test-div-0"}/>
          <div className={"test-div-1"}/>
        </Infinite>
      );

    expect(rootNode.refs.topSpacer._style.height).toEqual('0px');
    expect(rootNode.refs.bottomSpacer._style.height).toEqual('0px');

    expect(TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-0')).not.toBeUndefined();
    expect(TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-1')).not.toBeUndefined();
  });

  it('renders its children when some DOM nodes are hidden', function() {
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(10, elementHeight)}
        </Infinite>
      );

    expect(rootNode.refs.topSpacer._style.height).toEqual('0px');
    expect(rootNode.refs.bottomSpacer._style.height).toEqual('800px');

    // Why are six nodes rendered? Since we have not scrolled at
    // all, the extent that React Infinite will render is
    // preloadBatchSize + preloadAdditionalHeight below the container.
    //
    // preloadBatchSize defaults to containerHeight / 2 pixels, 400 pixels
    // preloadAdditionalHeight defaults to the containerHeight, 800 pixels
    //
    // Their sum is 1200 pixels, or 6 200-pixel elements.
    for (var i = 0; i < 6; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).not.toThrow();
    }

    for (var i = 6; i < 10; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).toThrow();
    }


  });

  it('renders more children when preloadAdditionalHeight is increased beyond its default', function() {
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  preloadAdditionalHeight={1000}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(10, elementHeight)}
        </Infinite>
      );

    expect(rootNode.refs.topSpacer._style.height).toEqual('0px');
    expect(rootNode.refs.bottomSpacer._style.height).toEqual('600px');

    // Why are seven nodes rendered? Since we have not scrolled at
    // all, the extent that React Infinite will render is
    // preloadBatchSize + preloadAdditionalHeight below the container.
    //
    // preloadBatchSize defaults to containerHeight / 2 pixels, 400 pixels
    // preloadAdditionalHeight is declared as 1000 pixels
    //
    // Their sum is 1400 pixels, or 7 200-pixel elements.

    for (var i = 0; i < 7; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).not.toThrow();
    }

    for (var i = 7; i < 10; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).toThrow();
    }
  });

  it('renders more children when preloadBatchSize is increased beyond its default', function() {
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  preloadBatchSize={800}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(10, elementHeight)}
        </Infinite>
      );

    expect(rootNode.refs.topSpacer._style.height).toEqual('0px');
    expect(rootNode.refs.bottomSpacer._style.height).toEqual('400px');

    // Why are eight nodes rendered? Since we have not scrolled at
    // all, the extent that React Infinite will render is
    // preloadBatchSize + preloadAdditionalHeight below the container.
    //
    // preloadBatchSize is declared as 800 pixels
    // preloadAdditionalHeight defaults to containerHeight, 800 pixels
    //
    // Their sum is 1600 pixels, or 8 200-pixel elements.
    for (var i = 0; i < 8; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).not.toThrow();
    }

    for (var i = 8; i < 10; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).toThrow();
    }

  });
});

describe('The Scrolling Behavior of the Constant Height React Infinite Component', function() {
  it('hides visible elements when the user scrolls sufficiently', function() {
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );

    var rootDomNode = ReactDOM.findDOMNode(rootNode);
    rootDomNode.scrollTop = 1500;
    TestUtils.Simulate.scroll(rootDomNode, {
      target: rootDomNode
    });

    //  Schematic
    //  0 pixels: start of topSpacer element
    //  400 pixels: windowTop, start of first displayed element
    //  1200 pixels: blockStart, start of the block that scrollTop of 1500 pixels is in
    //    (the block size default is containerHeight / 2)
    //  1600 pixels: blockEnd, end of block that scrollTop of 1500 pixels is in
    //  2400 pixels: windowBottom, end of first displayed element
    //  4000 pixels: end of bottomSpacer element
    expect(rootNode.refs.topSpacer._style.height).toEqual('400px');
    expect(rootNode.refs.bottomSpacer._style.height).toEqual('1600px');

    // Above the batch and its preloadAdditionalHeight
    for (var i = 0; i < 2; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).toThrow();
    }

    // Within the batch and its preloadAdditionalHeight, top and bottom
    for (var i = 2; i < 12; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).not.toThrow();
    }

    // Below the batch and its preloadAdditionalHeight
    for (var i = 12; i < 20; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).toThrow();
    }
  });

  it('functions correctly at the end of its range', function() {
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );

    // The total scrollable height here is 4000 pixels
    var rootDomNode = ReactDOM.findDOMNode(rootNode);
    rootDomNode.scrollTop = 3600;
    TestUtils.Simulate.scroll(rootDomNode, {
      target: rootDomNode
    });

    expect(rootNode.refs.topSpacer._style.height).toEqual('2800px');
    expect(rootNode.refs.bottomSpacer._style.height).toEqual('0px');

    // Above the batch and its preloadAdditionalHeight
    for (var i = 0; i < 14; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).toThrow();
    }

    // Within the batch and its preloadAdditionalHeight, top and bottom
    for (var i = 14; i < 20; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).not.toThrow();
    }
  });
});

describe('The Behavior of the Variable Height React Infinite Component', function() {
  it('hides elements when the user has not yet scrolled', function() {
                      // 20  40  200  300  350 500  525 550 575 600 725  805 880 900 1050 1300 1400 (16)
    var elementHeight = [20, 20, 160, 100, 50, 150, 25, 25, 25, 25, 125, 80, 75, 20, 150, 250, 100];
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={420}
                  className={"correct-class-name"}>
          {renderHelpers.variableDivGenerator(elementHeight)}
        </Infinite>
      );

    //  Schematic
    //  0 pixels: start of topSpacer element, start of windowTop
    //  420 pixels: end of container
    //  630 pixels: end of windowBottom
    //  1400 pixels: end of bottomSpacer element
    expect(rootNode.refs.topSpacer._style.height).toEqual('0px');
    expect(rootNode.refs.bottomSpacer._style.height).toEqual('675px');

    // Within the batch and its preloadAdditionalHeight, top and bottom
    for (var i = 1; i < 11; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).not.toThrow();
    }

    // Below the batch and its preloadAdditionalHeight
    for (var i = 11; i < 16; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).toThrow();
    }
  });

  it('hides visible elements when the user scrolls sufficiently', function() {
                      // 20  40  200  300  350 500  525 550 575 600 725  805 880 900 1050 1300 1400 (17)
    var elementHeight = [20, 20, 160, 100, 50, 150, 25, 25, 25, 25, 125, 80, 75, 20, 150, 250, 100];
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={400}
                  className={"correct-class-name"}>
          {renderHelpers.variableDivGenerator(elementHeight)}
        </Infinite>
      );

    var rootDomNode = ReactDOM.findDOMNode(rootNode);
    rootDomNode.scrollTop = 700;
    TestUtils.Simulate.scroll(rootDomNode, {
      target: rootDomNode
    });

    //  Schematic
    //  0 pixels: start of topSpacer element
    //  200 pixels: windowTop, start of first displayed element
    //  600 pixels: blockStart, start of the block that the scrollTop of 700 pixels is in
    //  800 pixels: blockEnd, end of the block that the scrollTop of 700 pixels is in
    //  1200 pixels: windowBottom, end of displayed element
    //  1400 pixels: end of bottomSpacer element

    expect(rootNode.refs.topSpacer._style.height).toEqual('40px');
    expect(rootNode.refs.bottomSpacer._style.height).toEqual('100px');

    // Above the batch and its preloadAdditionalHeight
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-0') }).toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-1') }).toThrow();

    // Within the batch and its preloadAdditionalHeight, top and bottom
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-2') }).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-3');}).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-4') }).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-5');}).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-6');}).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-7');}).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-8') }).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-9');}).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-10') }).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-11') }).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-12') }).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-13') }).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-14');}).not.toThrow();
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-15') }).not.toThrow();

    // Below the batch and its preloadAdditionalHeight
    expect(function() { TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-16');}).toThrow();
  });

  it('functions correctly at the end of its range', function() {
                      // 20  40  200  300  350 500  525 550 575 600 725  805 880 900 1050 1300 1400 (16)
    var elementHeight = [20, 20, 160, 100, 50, 150, 25, 25, 25, 25, 125, 80, 75, 20, 150, 250, 100];
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={400}
                  className={"correct-class-name"}>
          {renderHelpers.variableDivGenerator(elementHeight)}
        </Infinite>
      );

    // The total scrollable height here is 4000 pixels
    var rootDomNode = ReactDOM.findDOMNode(rootNode);
    rootDomNode.scrollTop = 1000;
    TestUtils.Simulate.scroll(rootDomNode, {
      target: rootDomNode
    });

    //  Schematic
    //  0 pixels: start of topSpacer element
    //  600 pixels: start of windowTop
    //  1000 pixels: start of block
    //  1400 pixels: end of block
    //  1400 pixels: end of windowBottom
    expect(rootNode.refs.topSpacer._style.height).toEqual('575px');
    expect(rootNode.refs.bottomSpacer._style.height).toEqual('0px');

    // Above the batch and its preloadAdditionalHeight
    for (var i = 0; i < 9; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).toThrow();
    }

    // Within the batch and its preloadAdditionalHeight, top and bottom
    for (var i = 9; i < 15; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).not.toThrow();
    }
  });
});

describe("React Infinite's Infinite Scroll Capabilities", function() {

  it('infiniteLoadBeginEdgeOffset does not always trigger infinite load on scroll', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  onInfiniteLoad={infiniteSpy}
                  infiniteLoadBeginEdgeOffset={1000}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );

    var rootDomNode = ReactDOM.findDOMNode(rootNode);
    rootDomNode.scrollTop = 300;
    TestUtils.Simulate.scroll(rootDomNode, {
      target: rootDomNode
    });

    expect(infiniteSpy).not.toHaveBeenCalled();
  });

  it('triggers the onInfiniteLoad function when scrolling past infiniteLoadBeginEdgeOffset', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  onInfiniteLoad={infiniteSpy}
                  infiniteLoadBeginEdgeOffset={1000}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );

    var rootDomNode = ReactDOM.findDOMNode(rootNode);
    rootDomNode.scrollTop = 3600;
    TestUtils.Simulate.scroll(rootDomNode, {
      target: rootDomNode
    });

    expect(infiniteSpy).toHaveBeenCalled();
  });

  it('does not always display the loadingSpinnerDelegate', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  onInfiniteLoad={infiniteSpy}
                  infiniteLoadBeginEdgeOffset={1000}
                  loadingSpinnerDelegate={<div className={"delegate-div"} />}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );

    var rootDomNode = ReactDOM.findDOMNode(rootNode);
    rootDomNode.scrollTop = 100;
    TestUtils.Simulate.scroll(rootDomNode, {
      target: rootDomNode
    });

    expect(function() {
      TestUtils.findRenderedDOMComponentWithClass(rootNode, 'delegate-div');
    }).toThrow();
  });

  it('displays the loadingSpinnerDelegate when isInfiniteLoading', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  onInfiniteLoad={infiniteSpy}
                  infiniteLoadBeginEdgeOffset={1000}
                  loadingSpinnerDelegate={<div className={"delegate-div"} />}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );

    var rootDomNode = ReactDOM.findDOMNode(rootNode);
    rootDomNode.scrollTop = 3600;
    TestUtils.Simulate.scroll(rootDomNode, {
      target: rootDomNode
    });

    expect(function() {
      TestUtils.findRenderedDOMComponentWithClass(rootNode, 'delegate-div');
    }).not.toThrow();
  });
});

describe("Maintaining React Infinite's internal scroll state", function() {
  it('has does not have pointer-events: none by default', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  timeScrollStateLastsForAfterUserScrolls={10000}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );
    var wrapper = rootNode.refs.smoothScrollingWrapper;
    expect(wrapper._style.pointerEvents).toEqual('');
  });

  it('has pointer-events: none upon scroll', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  timeScrollStateLastsForAfterUserScrolls={10000}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );

    var rootDomNode = ReactDOM.findDOMNode(rootNode);
    rootDomNode.scrollTop = 100;
    TestUtils.Simulate.scroll(rootDomNode, {
      target: rootDomNode
    });

    var wrapper = rootNode.refs.smoothScrollingWrapper;
    expect(wrapper._style.pointerEvents).toEqual('none');
  });
});

describe('Handling infinite scrolling', function() {
  it('triggers an infinite scroll the first time the component mounts if the elements do not fill the container', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;
    var rootNode;

    runs(function() {
      rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  infiniteLoadBeginEdgeOffset={1000}
                  onInfiniteLoad={infiniteSpy}
                  timeScrollStateLastsForAfterUserScrolls={10000}
                  className={"correct-class-name"}>
        </Infinite>
      );
    });

    waitsFor(function() {
      return infiniteSpy.callCount > 0;
    });

    runs(function() {
      expect(infiniteSpy).toHaveBeenCalled();
    });
  });

  it('considers a scroll to have occurred when the container itself is scrolled', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;

    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  handleScroll={infiniteSpy}
                  timeScrollStateLastsForAfterUserScrolls={10000}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );

    var properDiv = TestUtils.findRenderedDOMComponentWithClass(rootNode, 'correct-class-name');
    properDiv.scrollTop = 100;
    TestUtils.Simulate.scroll(properDiv, {
      target: ReactDOM.findDOMNode(properDiv)
    });

    expect(infiniteSpy).toHaveBeenCalled();
  });

  it('does not consider an infinite scroll to have occurred when one of its children scrolls', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;

    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  containerHeight={800}
                  handleScroll={infiniteSpy}
                  timeScrollStateLastsForAfterUserScrolls={10000}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );

    var childDiv = TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-0');
    childDiv.scrollTop = 100;
    TestUtils.Simulate.scroll(childDiv, {
      target: ReactDOM.findDOMNode(childDiv)
    });

    expect(infiniteSpy).not.toHaveBeenCalled();
  });
});

describe('React Infinite when the window is used as the Container', function() {
  var elementHeight = 200;
  it('does not attach a scrollable style', function() {
    var rootNode = TestUtils.renderIntoDocument(
      <Infinite elementHeight={elementHeight}
                timeScrollStateLastsForAfterUserScrolls={10000}
                className={"correct-class-name"}
                useWindowAsScrollContainer>
        {renderHelpers.divGenerator(20, elementHeight)}
      </Infinite>);

    var scrollable = rootNode.refs.scrollable;
    expect(scrollable.getAttribute('style')).toEqual('');
  });


  it('considers a scroll to have occurred when the window is scrolled', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;

    var oldAdd = window.addEventListener;
    var scrollListener;

    // I would very much like to know if there
    // is a better way of doing this.
    window.addEventListener = function(event, f) {
      if (event === 'scroll') {
        scrollListener = f;
      }
    };

    var rootNode;
    runs(function() {
      rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  handleScroll={infiniteSpy}
                  timeScrollStateLastsForAfterUserScrolls={10000}
                  className={"correct-class-name"}
                  useWindowAsScrollContainer>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );
    });

    waitsFor(function() {
      return !!scrollListener;
    });

    runs(function() {
      window.pageYOffset = 200;
      scrollListener();
      expect(infiniteSpy).toHaveBeenCalled();
    });
  });

  it('hides DOM elements that are below the visible range of the window', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;
    window.innerHeight = 800;

    var oldAdd = window.addEventListener;
    var scrollListener;

    // I would very much like to know if there
    // is a better way of doing this.
    window.addEventListener = function(event, f) {
      if (event === 'scroll') {
        scrollListener = f;
      }
    };

    var rootNode = TestUtils.renderIntoDocument(
      <Infinite elementHeight={elementHeight}
                handleScroll={infiniteSpy}
                timeScrollStateLastsForAfterUserScrolls={10000}
                className={"correct-class-name"}
                useWindowAsScrollContainer>
        {renderHelpers.divGenerator(20, elementHeight)}
      </Infinite>);

    for (var i = 0; i < 6; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).not.toThrow();
    }

    for (var i = 6; i < 10; i++) {
      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
      }).toThrow();
    }
  });

  it('alters the elements displayed when a scroll has occurred', function() {
    var infiniteSpy = jasmine.createSpy('infiniteSpy');
    var elementHeight = 200;

    var oldAdd = window.addEventListener;
    var scrollListener;

    // I would very much like to know if there
    // is a better way of doing this.
    window.addEventListener = function(event, f) {
      if (event === 'scroll') {
        scrollListener = f;
      }
    };

    var rootNode;
    runs(function() {
      rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={elementHeight}
                  handleScroll={infiniteSpy}
                  timeScrollStateLastsForAfterUserScrolls={10000}
                  className={"correct-class-name"}
                  useWindowAsScrollContainer>
          {renderHelpers.divGenerator(20, elementHeight)}
        </Infinite>
      );

      for (var i = 0; i < 6; i++) {
        expect(function() {
          TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
        }).not.toThrow();
      }

      for (var i = 6; i < 20; i++) {
        expect(function() {
          TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
        }).toThrow();
      }
    });

    waitsFor(function() {
      return !!scrollListener;
    });

    runs(function() {
      window.pageYOffset = 1500;
      scrollListener();

      for (var i = 0; i < 2; i++) {
        expect(function() {
          TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
        }).toThrow();
      }

      for (var i = 2; i < 12; i++) {
        expect(function() {
          TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
        }).not.toThrow();
      }

      // Below the batch and its preloadAdditionalHeight
      for (var i = 12; i < 20; i++) {
        expect(function() {
          TestUtils.findRenderedDOMComponentWithClass(rootNode, 'test-div-' + i);
        }).toThrow();
      }
    });
  });
});

describe("Specifying React Infinite's preload amounts", function() {
  it('has correct preload batch size defaults', function() {
    var infinite = TestUtils.renderIntoDocument(
      <Infinite elementHeight={200}
                containerHeight={800}
                className={"correct-class-name"}>
        <div/>
        <div/>
      </Infinite>
    );

    expect(infinite.computedProps.preloadBatchSize).toEqual(400);
  });

  it('can use a number to set preload batch size', function() {
    var infinite = TestUtils.renderIntoDocument(
      <Infinite elementHeight={200}
                containerHeight={800}
                preloadBatchSize={742}
                className={"correct-class-name"}>
        <div/>
        <div/>
      </Infinite>
    );

    expect(infinite.computedProps.preloadBatchSize).toEqual(742);
  });

  it('can be used with a preload batch size scale factor', function() {
    var infinite = TestUtils.renderIntoDocument(
      <Infinite elementHeight={200}
                containerHeight={800}
                preloadBatchSize={Infinite.containerHeightScaleFactor(4)}
                className={"correct-class-name"}>
        <div/>
        <div/>
      </Infinite>
    );

    expect(infinite.computedProps.preloadBatchSize).toEqual(3200);
  });

  it('has correct preload additional height defaults', function() {
    var infinite = TestUtils.renderIntoDocument(
      <Infinite elementHeight={200}
                containerHeight={800}
                className={"correct-class-name"}>
        <div/>
        <div/>
      </Infinite>
    );

    expect(infinite.computedProps.preloadAdditionalHeight).toEqual(800);
  });

  it('can use a number to set preload additional height', function() {
    var infinite = TestUtils.renderIntoDocument(
      <Infinite elementHeight={200}
                containerHeight={200}
                preloadAdditionalHeight={465}
                className={"correct-class-name"}>
        <div/>
        <div/>
      </Infinite>
    );

    expect(infinite.computedProps.preloadAdditionalHeight).toEqual(465);
  });

  it('can be used with a preload additional height scale factor', function() {
    var infinite = TestUtils.renderIntoDocument(
      <Infinite elementHeight={200}
                containerHeight={500}
                preloadAdditionalHeight={Infinite.containerHeightScaleFactor(1.5)}
                className={"correct-class-name"}>
        <div/>
        <div/>
      </Infinite>
    );

    expect(infinite.computedProps.preloadAdditionalHeight).toEqual(750);
  });
});

describe('Rerendering React Infinite', function() {
  it('updates the infinite computer', function() {
    var rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={17}
                  containerHeight={450}
                  infiniteLoadBeginEdgeOffset={1000}
                  loadingSpinnerDelegate={<div className={"delegate-div"} />}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(20, 17)}
        </Infinite>
      );

    expect(rootNode.state.infiniteComputer.heightData).toEqual(17);
    expect(rootNode.state.infiniteComputer.numberOfChildren).toEqual(20);

    rootNode = TestUtils.renderIntoDocument(
      <Infinite elementHeight={17}
                containerHeight={450}
                infiniteLoadBeginEdgeOffset={1000}
                loadingSpinnerDelegate={<div className={"delegate-div"} />}
                className={"correct-class-name"}>
        {renderHelpers.divGenerator(74, 17)}
      </Infinite>
    );
    expect(rootNode.state.infiniteComputer.numberOfChildren).toEqual(74);

    rootNode = TestUtils.renderIntoDocument(
      <Infinite elementHeight={[10, 20, 30]}
                containerHeight={450}
                infiniteLoadBeginEdgeOffset={1000}
                loadingSpinnerDelegate={<div className={"delegate-div"} />}
                className={"correct-class-name"}>
        {renderHelpers.divGenerator(74, 17)}
      </Infinite>
    );
    expect(rootNode.state.infiniteComputer.heightData).toEqual([10, 20, 30]);
  });
});

describe('Requesting all visible rows', function () {
  var InfiniteWrapper = React.createClass({
    getInitialState() {
      return { currentRows: 0, totalRequests: 0 }
    },

    onInfiniteLoad() {
      this.setState({
        totalRequests: this.state.totalRequests + 1
      });

      if (this.state.currentRows < this.props.totalRows) {
        this.setState({
          currentRows: this.state.currentRows + 1
        });
      }
    },

    render() {
      return (
        <Infinite elementHeight={this.props.elementHeight}
                  containerHeight={this.props.containerHeight}
                  onInfiniteLoad={this.onInfiniteLoad}
                  infiniteLoadBeginEdgeOffset={100}
                  className={"correct-class-name"}>
          {renderHelpers.divGenerator(this.state.currentRows, this.props.elementHeight)}
        </Infinite>
      );
    }
  });

  it('will request all possible rows until the scroll height is met', function () {
    var rootNode = TestUtils.renderIntoDocument(
      <InfiniteWrapper totalRows={50}
                       elementHeight={40}
                       containerHeight={400} />
    );

    expect(rootNode.state.totalRequests).toEqual(10);
    expect(rootNode.state.currentRows).toEqual(10);
  });

  it('will stop requesting when no further rows are provided', function () {
    var rootNode = TestUtils.renderIntoDocument(
      <InfiniteWrapper totalRows={3}
                       elementHeight={40}
                       containerHeight={400} />
    );

    expect(rootNode.state.totalRequests).toEqual(4);
    expect(rootNode.state.currentRows).toEqual(3);
  });

  it('will work when no possible rows can be loaded', function () {
    var rootNode = TestUtils.renderIntoDocument(
      <InfiniteWrapper totalRows={0}
                       elementHeight={40}
                       containerHeight={400} />
    );

    expect(rootNode.state.totalRequests).toEqual(1);
    expect(rootNode.state.currentRows).toEqual(0);
  });
});
