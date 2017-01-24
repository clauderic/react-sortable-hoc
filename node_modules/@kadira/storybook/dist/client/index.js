'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStorybook = exports.configure = exports.addDecorator = exports.setAddon = exports.linkTo = exports.action = exports.storiesOf = undefined;

var _preview = require('./preview');

var previewApi = _interopRequireWildcard(_preview);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var storiesOf = exports.storiesOf = previewApi.storiesOf;
var action = exports.action = previewApi.action;
var linkTo = exports.linkTo = previewApi.linkTo;
var setAddon = exports.setAddon = previewApi.setAddon;
var addDecorator = exports.addDecorator = previewApi.addDecorator;
var configure = exports.configure = previewApi.configure;
var getStorybook = exports.getStorybook = previewApi.getStorybook;