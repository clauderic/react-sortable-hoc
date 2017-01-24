'use strict';

var React = global.React || require('react');

module.exports = {
  preloadType: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.shape({
    type: React.PropTypes.oneOf(['containerHeightScaleFactor']).isRequired,
    amount: React.PropTypes.number.isRequired
  })])
};