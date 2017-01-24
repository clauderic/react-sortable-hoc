(function() {
  var Declaration, GridRowAlign,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Declaration = require('../declaration');

  GridRowAlign = (function(superClass) {
    extend(GridRowAlign, superClass);

    function GridRowAlign() {
      return GridRowAlign.__super__.constructor.apply(this, arguments);
    }

    GridRowAlign.names = ['grid-row-align'];

    GridRowAlign.prototype.prefixed = function(prop, prefix) {
      return prefix + 'grid-row-align';
    };

    GridRowAlign.prototype.normalize = function(prop) {
      return 'align-items';
    };

    return GridRowAlign;

  })(Declaration);

  module.exports = GridRowAlign;

}).call(this);
