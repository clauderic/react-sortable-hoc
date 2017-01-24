/* eslint-env jest */

// Under certain conditions React Infinite cannot run at all. This
// is when required props are not provided, or if the props provided
// do not make sense. This logic is centralized in checkProps, and
// throws an error.

jest.dontMock('../src/react-infinite.jsx');
jest.dontMock('../src/utils/checkProps');
jest.dontMock('lodash.isfinite');
jest.dontMock('lodash.isarray');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Infinite = require('../src/react-infinite.jsx');

var shallowRenderer;

describe('Errors when the container height is not provided in some way', function() {
  beforeEach(function() {
    shallowRenderer = TestUtils.createRenderer();
  });

  it('throws an error when neither containerHeight nor useWindowAsScrollContainer is not provided', function() {
    var errorfulInfinite = <Infinite elementHeight={22}>
        <div/>
        <div/>
      </Infinite>;

    expect(function() {
      shallowRenderer.render(errorfulInfinite);
    }).toThrow('Invariant Violation: Either containerHeight or useWindowAsScrollContainer must be provided.');
  });
});

describe('Errors when the elementHeight does not make sense', function() {
  beforeEach(function() {
    shallowRenderer = TestUtils.createRenderer();
  });

  it('throws an error when the elementHeight is neither a number nor an array', function() {
    var errorfulInfinite = <Infinite elementHeight={"not a sensible element height"}
                                     containerHeight={400}>
      <div/>
      <div/>
    </Infinite>;

    expect(function() {
      shallowRenderer.render(errorfulInfinite);
    }).toThrow('Invariant Violation: You must provide either a number or an array of numbers as the elementHeight.');
  });
});

describe('Errors an error on elementHeight array length mismatch', function() {
  beforeEach(function() {
    shallowRenderer = TestUtils.createRenderer();
  });

  it('throws an error when the number of children is not equal to the length of the elementHeight array when ', function() {
    var errorfulInfinite = <Infinite elementHeight={[1, 2, 3]}
                                     containerHeight={400}>
      <div/>
      <div/>
    </Infinite>;

    expect(function() {
      shallowRenderer.render(errorfulInfinite);
    }).toThrow('Invariant Violation: There must be as many values provided in the elementHeight prop as there are children.');
  });
});
