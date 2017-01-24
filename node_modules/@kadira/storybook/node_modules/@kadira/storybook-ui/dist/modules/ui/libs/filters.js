'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storyFilter = storyFilter;

var _fuzzysearch = require('fuzzysearch');

var _fuzzysearch2 = _interopRequireDefault(_fuzzysearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function storyFilter(stories, filter, selectedKind) {
  if (!stories) return null;
  if (!filter) return stories;

  return stories.filter(function (kindInfo) {
    if (kindInfo.kind === selectedKind) return true;
    var needle = filter.toLocaleLowerCase();
    var hstack = kindInfo.kind.toLocaleLowerCase();
    return (0, _fuzzysearch2.default)(needle, hstack);
  });
}