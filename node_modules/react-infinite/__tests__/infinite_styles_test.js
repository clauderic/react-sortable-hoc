/* eslint-env jest */

// Under certain conditions React Infinite cannot run at all. This
// is when required props are not provided, or if the props provided
// do not make sense. This logic is centralized in checkProps, and
// throws an error.

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
var TestUtils = require('react-addons-test-utils');
var Infinite = require('../src/react-infinite.jsx');


describe("Infinite Styles Override: can override styles on the scrollable container", function() {
  it("will be able to override styles on the scrollable container", function() {
    var rootNode = TestUtils.renderIntoDocument(
      <Infinite elementHeight={200}
                containerHeight={800}
                className={"correct-class-name"}
                styles={{scrollableStyle: {'overflowY': 'hidden'}}}>
        <div className={"test-div-0"}/>
        <div className={"test-div-1"}/>
      </Infinite>
    );

    expect(rootNode.refs.scrollable.getAttribute('style')).toEqual('height: 800px; overflow-x: hidden; overflow-y: hidden;')
  });
});
