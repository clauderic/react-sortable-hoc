'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _ObjectValue = require('./ObjectValue');

var _ObjectValue2 = _interopRequireDefault(_ObjectValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import objectStyles from '../styles/objectStyles'

var renderer = _reactAddonsTestUtils2.default.createRenderer();

describe('ObjectValue', function () {
  beforeEach(function () {});

  it('should render', function () {
    // console.log(ObjectValue)
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: 0 }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
  });

  it('should render number', function () {
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: 0 }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual(0);
  });

  it('should render string with quotes', function () {
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: "octocat" }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual(['"', 'octocat', '"']);
  });

  it('should render boolean', function () {
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: true }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual('true');
  });

  it('should render undefined', function () {
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: undefined }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual('undefined');
  });

  it('should render null', function () {
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: null }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual('null');
  });

  it('should display date correctly', function () {
    var dateString = 'December 17, 1995 03:24:00';
    var date = new Date(dateString);
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: date }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual(date.toString());
  });

  it('should render array with length information', function () {
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: [1, 2, 3, 4, 5] }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual('Array[5]');
  });

  it('should render an empty object', function () {
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: {} }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual('Object');
  });

  it('should render a simple object', function () {
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: { 'k': 'v' } }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual('Object');
  });

  /*
  it('should render an anonymous function', () => {
    renderer.render(<ObjectValue object={function(){}} />)
    const tree = renderer.getRenderOutput()
    expect(tree.type).toBe('span')
    // const n = tree.props.children[1].props.children[1]
    // console.log(JSON.stringify(n, null, 2))
    // console.log(typeof n)
    // console.log(tree.props.children[1].props.children)
    expect(tree.props.children[0]).toEqual(<span style={objectStyles.value.function.keyword}>function</span>)
    expect(tree.props.children[1]).toEqual(<span style={objectStyles.value.function.name}>{[ '\xa0', 'object', '()' ]}</span>)
  });
  */

  /*
  it('should render a named function', () => {
    renderer.render(<ObjectValue object={function id(a){return a;}} />)
    const tree = renderer.getRenderOutput()
    expect(tree.type).toBe('span')
    expect(tree.props.children).toEqual([
                                          <span style={objectStyles.value.function.keyword}>function</span>,
                                          <span style={objectStyles.value.function.name}>{[ '\xa0', 'id', '()' ]}</span>
                                        ])
  });
  */

  it('should render a symbol', function () {
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: Symbol() }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual('Symbol()');
  });

  it('should render a symbol', function () {
    renderer.render(_react2.default.createElement(_ObjectValue2.default, { object: Symbol("foo") }));
    var tree = renderer.getRenderOutput();
    (0, _expect2.default)(tree.type).toBe('span');
    (0, _expect2.default)(tree.props.children).toEqual('Symbol(foo)');
  });
});