var React = require('react');

module.exports = {
  divGenerator: function(number = 10, height = 100) {
    var divArray = [];
    for (var i = 0; i < number; i++) {
      divArray.push(<div className={'test-div-' + i} key={i} style={{height: height}}/>);
    }

    return divArray;
  },
  variableDivGenerator: function(heights) {
    var divArray = [];
    for (var i = 0; i < heights.length; i++) {
      divArray.push(<div className={'test-div-' + i} key={i} style={{height: heights[i]}}/>);
    }
    return divArray;
  }
};
