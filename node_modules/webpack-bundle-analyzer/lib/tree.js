'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var filesize = require('filesize');

var Node = function () {
  function Node(name, parent) {
    _classCallCheck(this, Node);

    this.name = name;
    this.parent = parent;
  }

  Node.prototype.toString = function toString(indent) {
    indent = indent || '|';

    return indent + ' ' + this.name;
  };

  _createClass(Node, [{
    key: 'path',
    get: function get() {
      var path = [];
      var node = this;

      while (node) {
        path.push(node.name);
        node = node.parent;
      }

      return path.reverse().join('/');
    }
  }]);

  return Node;
}();

var Module = function (_Node) {
  _inherits(Module, _Node);

  function Module(name, data, parent) {
    _classCallCheck(this, Module);

    var _this = _possibleConstructorReturn(this, _Node.call(this, name, parent));

    _this.data = data;
    return _this;
  }

  Module.prototype.mergeData = function mergeData(data) {
    var _this2 = this;

    _.each(['size', 'parsedSize', 'gzipSize'], function (prop) {
      if (data[prop]) {
        _this2.data[prop] = (_this2.data[prop] || 0) + data[prop];
      }
    });
  };

  Module.prototype.toString = function toString(indent) {
    return _Node.prototype.toString.call(this, indent) + ' [' + this.data.id + '] (' + filesize(this.size) + ')';
  };

  Module.prototype.toChartData = function toChartData() {
    return {
      id: this.data.id,
      label: this.name,
      path: this.path,
      statSize: this.size,
      parsedSize: this.parsedSize,
      gzipSize: this.gzipSize
    };
  };

  _createClass(Module, [{
    key: 'size',
    get: function get() {
      return this.data.size;
    }
  }, {
    key: 'parsedSize',
    get: function get() {
      return this.data.parsedSize;
    }
  }, {
    key: 'gzipSize',
    get: function get() {
      return this.data.gzipSize;
    }
  }]);

  return Module;
}(Node);

var Folder = function (_Node2) {
  _inherits(Folder, _Node2);

  function Folder(name, parent) {
    _classCallCheck(this, Folder);

    var _this3 = _possibleConstructorReturn(this, _Node2.call(this, name, parent));

    _this3.children = Object.create(null);
    return _this3;
  }

  Folder.prototype.getChild = function getChild(name) {
    return this.children[name];
  };

  Folder.prototype.addFolder = function addFolder(name) {
    var folder = new Folder(name, this);

    this.children[name] = folder;
    delete this._size;
    delete this._parsedSize;

    return folder;
  };

  Folder.prototype.addModule = function addModule(name, data) {
    var node = this.children[name];

    // For some reason we already have this node in children and it's a folder.
    if (node && node instanceof Folder) return false;

    if (node) {
      // We already have this node in children and it's a module.
      // Merging it's data.
      node.mergeData(data);
    } else {
      // Creating new module.
      node = new Module(name, data, this);
      this.children[name] = node;
    }

    delete this._size;
    delete this._parsedSize;

    return true;
  };

  Folder.prototype.addModuleByPath = function addModuleByPath(path, data) {
    var _ref = [path.slice(0, -1), _.last(path)],
        folderNames = _ref[0],
        fileName = _ref[1];

    var currentFolder = this;

    _.each(folderNames, function (folderName) {
      currentFolder = currentFolder.getChild(folderName) || currentFolder.addFolder(folderName);
    });

    currentFolder.addModule(fileName, data);
  };

  Folder.prototype.walk = function walk(walker) {
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var stopped = false;

    _.each(this.children, function (child) {
      if (child.walk) {
        state = child.walk(walker, state, stop);
      } else {
        state = walker(child, state, stop);
      }

      if (stopped) return false;
    });

    return state;

    function stop(finalState) {
      stopped = true;
      return finalState;
    }
  };

  Folder.prototype.toString = function toString(indent, opts) {
    var _ref2 = opts || {},
        sortBy = _ref2.sortBy;

    indent = indent || '|';

    var str = indent + ' ' + this.name + ' (' + filesize(this.size) + ')\n';

    str += _(this.children).sortBy(sortBy).reverse().map(function (child) {
      return child.toString(indent + '  |', opts);
    }).join('\n');

    return str;
  };

  Folder.prototype.toChartData = function toChartData() {
    return {
      label: this.name,
      path: this.path,
      statSize: this.size,
      parsedSize: this.parsedSize,
      gzipSize: this.gzipSize,
      groups: _.invokeMap(this.children, 'toChartData')
    };
  };

  _createClass(Folder, [{
    key: 'size',
    get: function get() {
      if (!_.has(this, '_size')) {
        this._size = this.walk(function (node, size) {
          return size + node.size;
        }, 0);
      }

      return this._size;
    }
  }, {
    key: 'parsedSize',
    get: function get() {
      if (!_.has(this, '_parsedSize')) {
        this._parsedSize = this.walk(function (node, size, stop) {
          if (node.parsedSize === undefined) {
            return stop(undefined);
          }

          return size + node.parsedSize;
        }, 0);
      }

      return this._parsedSize;
    }
  }, {
    key: 'gzipSize',
    get: function get() {
      if (!_.has(this, '_gzipSize')) {
        this._gzipSize = this.walk(function (node, size, stop) {
          if (node.gzipSize === undefined) {
            return stop(undefined);
          }

          return size + node.gzipSize;
        }, 0);
      }

      return this._gzipSize;
    }
  }]);

  return Folder;
}(Node);

module.exports = {
  Node: Node,
  Module: Module,
  Folder: Folder
};