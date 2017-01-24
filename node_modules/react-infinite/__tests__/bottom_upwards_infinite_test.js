/* eslint-env jest */

jest.dontMock('../src/react-infinite.jsx');
jest.dontMock('../src/computers/infiniteComputer.js');
jest.dontMock('../src/computers/constantInfiniteComputer.js');
jest.dontMock('../src/computers/arrayInfiniteComputer.js');
jest.dontMock('../src/utils/binaryIndexSearch.js');
jest.dontMock('../src/utils/infiniteHelpers.js');
jest.dontMock('./helpers/renderHelpers.js');
jest.dontMock('lodash.isfinite');
jest.dontMock('lodash.isarray');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Infinite = require('../src/react-infinite.jsx');

var renderHelpers = require('./helpers/renderHelpers');
var shallowRenderer = TestUtils.createRenderer();

describe('The Basic Behavior of the Bottom Upwards Display', function() {
  it('does not throw an error when set', function() {
    expect(function() {
      TestUtils.renderIntoDocument(
        <Infinite elementHeight={200}
                  containerHeight={800}
                  className={"root-scrollable-node"}
                  displayBottomUpwards>
        </Infinite>
      );
    }).not.toThrow();
  });

  it('renders a space-filling top spacer div when the total element height is less than the container height', function() {
    var infinite = <Infinite elementHeight={100}
                             containerHeight={800}
                             displayBottomUpwards>
      {renderHelpers.divGenerator(1, 100)}
    </Infinite>;
    shallowRenderer.render(infinite);

    var rootNode = shallowRenderer.getRenderOutput();
    expect(rootNode.props.children.props.children[0]).toEqual(
      <div ref="topSpacer"
           style={{
             width: '100%',
             height: 700
           }}/>
    );
  });

  // jsdom cannot do offsetheight
  //it('takes the loading spinner height into account when rendering the space-filling top spacer div', function() {
  //  var infinite = <Infinite elementHeight={100}
  //                           containerHeight={800}
  //                           loadingSpinnerDelegate={<div style={{height: 100}}/>}
  //                           displayBottomUpwards>
  //    {renderHelpers.divGenerator(1, 100)}
  //  </Infinite>;
  //  shallowRenderer.render(infinite);
  //
  //  var rootNode = shallowRenderer.getRenderOutput();
  //  expect(rootNode.props.children.props.children[0]).toEqual(
  //    <div ref="topSpacer"
  //         style={{
  //           width: '100%',
  //           height: 600
  //         }}/>
  //  );
  //});

  it('does not render a space-filling top spacer div when the total element height begins to exceed the container height', function() {
    var infinite = <Infinite elementHeight={100}
                             containerHeight={800}
                             displayBottomUpwards>
      {renderHelpers.divGenerator(9, 100)}
    </Infinite>;
    shallowRenderer.render(infinite);

    var rootNode = shallowRenderer.getRenderOutput();
    expect(rootNode.props.children.props.children[0]).toEqual(
      <div ref="topSpacer"
           style={{
             width: '100%',
             height: 0
           }}/>
    );
  });

  it('renders a space-filling top spacer div when the total element height is less than the container height when using the window as the container', function() {
    var infinite = <Infinite elementHeight={100}
                             containerHeight={800}
                             displayBottomUpwards
                             useWindowAsContainer>
      {renderHelpers.divGenerator(1, 100)}
    </Infinite>;
    shallowRenderer.render(infinite);

    var rootNode = shallowRenderer.getRenderOutput();
    expect(rootNode.props.children.props.children[0]).toEqual(
      <div ref="topSpacer"
           style={{
             width: '100%',
             height: 700
           }}/>
    );
  });

  it('does not render a space-filling top spacer div when the total element height begins to exceed the container height when using the window as the container', function() {
    var infinite = <Infinite elementHeight={100}
                             containerHeight={800}
                             useWindowAsScrollContainer
                             displayBottomUpwards
                             useWindowAsContainer>
      {renderHelpers.divGenerator(9, 100)}
    </Infinite>;
    shallowRenderer.render(infinite);

    var rootNode = shallowRenderer.getRenderOutput();
    expect(rootNode.props.children.props.children[0]).toEqual(
      <div ref="topSpacer"
           style={{
             width: '100%',
             height: 0
           }}/>
    );
  });
});

describe('The Bottom Scroll Preserving Behavior of the Bottom Upwards Display', function() {
  // Check that it handles browser elasticity as well

  it('keeps the scroll attached to the bottom even when the element is capable of scrolling upwards', function() {
    var rootNode = TestUtils.renderIntoDocument(
      <Infinite elementHeight={100}
                containerHeight={800}
                displayBottomUpwards>
        {renderHelpers.divGenerator(20, 100)}
      </Infinite>
    );

    var rootDomNode = ReactDOM.findDOMNode(rootNode);
    expect(rootDomNode.scrollTop).toEqual(1200);
  });

  it('keeps the scroll attached to the bottom even when the element is capable of scrolling upwards when the window is used as the container', function () {
    window.scroll = jest.genMockFunction();
    window.innerHeight = 768;
    runs(function () {
      TestUtils.renderIntoDocument(
        <Infinite elementHeight={100}
                  displayBottomUpwards
                  useWindowAsScrollContainer>
          {renderHelpers.divGenerator(20, 100)}
        </Infinite>
      )
    });

    waitsFor(function() {
      return window.scroll.mock.calls.length > 0;
    });

    runs(function() {
      expect(window.scroll).lastCalledWith(0, 2000 - 768);
    });
  });

  it('allows upwards scrolling to proceed once the user starts scrolling', function() {
    var rootNode = TestUtils.renderIntoDocument(
      <Infinite elementHeight={100}
                containerHeight={800}
                displayBottomUpwards>
        {renderHelpers.divGenerator(20, 100)}
      </Infinite>
    );

    var rootDOMNode = ReactDOM.findDOMNode(rootNode);
    rootDOMNode.scrollTop = 504;
    TestUtils.Simulate.scroll(rootDOMNode, {
      target: rootDOMNode
    });

    expect(rootDOMNode.scrollTop).toEqual(504);
  });
});

describe('The Infinite Loading Triggering Behavior of the Bottom Upwards Display', function() {
  it('triggers when the user passes the required point when scrolling upwards', function() {
    var infiniteLoader = jest.genMockFunction();
    var rootNode = TestUtils.renderIntoDocument(
      <Infinite elementHeight={100}
                infiniteLoadBeginEdgeOffset={300}
                onInfiniteLoad={infiniteLoader}
                containerHeight={800}
                displayBottomUpwards>
        {renderHelpers.divGenerator(20, 100)}
      </Infinite>
    );

    var rootDOMNode = ReactDOM.findDOMNode(rootNode);
    rootDOMNode.scrollTop = 299;
    TestUtils.Simulate.scroll(rootDOMNode, {
      target: rootDOMNode
    });

    expect(infiniteLoader.mock.calls.length).toEqual(1);
  });

  it('does not trigger when the user does not pass the required point when scrolling upwards', function() {
    var infiniteLoader = jest.genMockFunction();
    var rootNode = TestUtils.renderIntoDocument(
      <Infinite elementHeight={100}
                infiniteLoadBeginEdgeOffset={300}
                onInfiniteLoad={infiniteLoader}
                containerHeight={800}
                displayBottomUpwards>
        {renderHelpers.divGenerator(20, 100)}
      </Infinite>
    );

    var rootDOMNode = ReactDOM.findDOMNode(rootNode);
    rootDOMNode.scrollTop = 301;
    TestUtils.Simulate.scroll(rootDOMNode, {
      target: rootDOMNode
    });

    expect(infiniteLoader.mock.calls.length).toEqual(0);
  });

  it('triggers when the user passes the required point when the window is used as the scroll container', function() {
    var infiniteLoader = jest.genMockFunction();

    var rootNode;
    var scrollListener;

    window.addEventListener = function(event, f) {
      if (event === 'scroll') {
        scrollListener = f;
      }
    };

    runs(function() {
      rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={100}
                  infiniteLoadBeginEdgeOffset={300}
                  onInfiniteLoad={infiniteLoader}
                  useWindowAsScrollContainer
                  displayBottomUpwards>
          {renderHelpers.divGenerator(20, 100)}
        </Infinite>
      );
    });

    waitsFor(function() {
      return !!scrollListener;
    });

    runs(function() {
      window.pageYOffset = 299;
      scrollListener();

      expect(infiniteLoader.mock.calls.length).toEqual(1);
    });
  });

  it('does not trigger when the user does not pass the required point when the window is used as the scroll container', function() {
    var infiniteLoader = jest.genMockFunction();

    var rootNode;
    var scrollListener;

    window.addEventListener = function(event, f) {
      if (event === 'scroll') {
        scrollListener = f;
      }
    };

    runs(function() {
      rootNode = TestUtils.renderIntoDocument(
        <Infinite elementHeight={100}
                  infiniteLoadBeginEdgeOffset={300}
                  onInfiniteLoad={infiniteLoader}
                  useWindowAsScrollContainer
                  displayBottomUpwards>
          {renderHelpers.divGenerator(20, 100)}
        </Infinite>
      );
    });

    waitsFor(function() {
      return !!scrollListener;
    });

    runs(function() {
      window.pageYOffset = 301;
      scrollListener();

      expect(infiniteLoader.mock.calls.length).toEqual(0);
    });
  });
});

describe('The Infinite Loading Scroll Maintenance Behavior of the Bottom Upwards Display', function() {
  var renderNode;

  beforeEach(function() {
    renderNode = document.createElement('div');
  });

  var divs = renderHelpers.divGenerator(20, 100);

  it('scrolls to the correct place after new components come in', function() {
    var infiniteLoader = jest.genMockFunction();
    var rootNode = ReactDOM.render(
      <Infinite elementHeight={100}
                infiniteLoadBeginEdgeOffset={300}
                onInfiniteLoad={infiniteLoader}
                containerHeight={800}
                displayBottomUpwards>
        {divs}
      </Infinite>,
      renderNode
    );

    var rootDOMNode = ReactDOM.findDOMNode(rootNode);
    rootDOMNode.scrollTop = 299;
    TestUtils.Simulate.scroll(rootDOMNode, {
      target: rootDOMNode
    });

    expect(infiniteLoader.mock.calls.length).toEqual(1);

    //The parent component acknowledges that the component
    // is in the infinite loading state
    rootNode = ReactDOM.render(
      <Infinite elementHeight={100}
                infiniteLoadBeginEdgeOffset={300}
                onInfiniteLoad={infiniteLoader}
                isInfiniteLoading
                loadingSpinnerDelegate={<div/>}
                containerHeight={800}
                displayBottomUpwards>
        {divs}
      </Infinite>,
      renderNode
    );

    // The component is now in the infinite loading state. We
    // disable infinite loading and give it new divs.
    rootNode = ReactDOM.render(
      <Infinite elementHeight={100}
                infiniteLoadBeginEdgeOffset={300}
                onInfiniteLoad={infiniteLoader}
                isInfiniteLoading={false}
                containerHeight={800}
                displayBottomUpwards>
        {renderHelpers.divGenerator(30, 100)}
      </Infinite>,
      renderNode
    );

    // Why is this 1299? Because 10 new components of height 100
    // each enter, presumably from the top. Previously, we scrolled
    // to 299, so the final scrollTop is 1299.
    expect(rootDOMNode.scrollTop).toEqual(1299);
  });

  it('scrolls to the correct place after new components come in when the window is the scroll container', function() {
    var infiniteLoader = jest.genMockFunction();

    var rootNode;
    var scrollListener;
    window.scroll = jest.genMockFunction();

    window.addEventListener = function(event, f) {
      if (event === 'scroll') {
        scrollListener = f;
      }
    };

    runs(function() {
      rootNode = ReactDOM.render(
        <Infinite elementHeight={100}
                  infiniteLoadBeginEdgeOffset={300}
                  onInfiniteLoad={infiniteLoader}
                  useWindowAsScrollContainer
                  displayBottomUpwards>
          {divs}
        </Infinite>,
        renderNode
      );
    });

    waitsFor(function() {
      return !!scrollListener;
    });

    runs(function() {
      window.pageYOffset = 298;
      scrollListener();
      expect(infiniteLoader.mock.calls.length).toEqual(1);

      rootNode = ReactDOM.render(
        <Infinite elementHeight={100}
                  infiniteLoadBeginEdgeOffset={300}
                  onInfiniteLoad={infiniteLoader}
                  isInfiniteLoading
                  loadingSpinnerDelegate={<div/>}
                  useWindowAsScrollContainer
                  displayBottomUpwards>
          {divs}
        </Infinite>,
        renderNode
      );

      rootNode = ReactDOM.render(
        <Infinite elementHeight={100}
                  infiniteLoadBeginEdgeOffset={300}
                  onInfiniteLoad={infiniteLoader}
                  isInfiniteLoading={false}
                  useWindowAsScrollContainer
                  displayBottomUpwards>
          {renderHelpers.divGenerator(30, 100)}
        </Infinite>,
        renderNode);

      expect(window.scroll).lastCalledWith(0, 1000 + 298);
    });
  });
});
