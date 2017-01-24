/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponentTreeTestUtils
 */

'use strict';

var _assign = require('object-assign');

var _extends = _assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ReactComponentTreeDevtool = require('./ReactComponentTreeDevtool');

function getRootDisplayNames() {
  return ReactComponentTreeDevtool.getRootIDs().map(ReactComponentTreeDevtool.getDisplayName);
}

function getRegisteredDisplayNames() {
  return ReactComponentTreeDevtool.getRegisteredIDs().map(ReactComponentTreeDevtool.getDisplayName);
}

function expectTree(rootID, expectedTree, parentPath) {
  var displayName = ReactComponentTreeDevtool.getDisplayName(rootID);
  var ownerID = ReactComponentTreeDevtool.getOwnerID(rootID);
  var parentID = ReactComponentTreeDevtool.getParentID(rootID);
  var childIDs = ReactComponentTreeDevtool.getChildIDs(rootID);
  var text = ReactComponentTreeDevtool.getText(rootID);
  var element = ReactComponentTreeDevtool.getElement(rootID);
  var path = parentPath ? parentPath + ' > ' + displayName : displayName;

  function expectEqual(actual, expected, name) {
    // Get Jasmine to print descriptive error messages.
    // We pass path so that we know where the mismatch occurred.
    expect(_defineProperty({
      path: path
    }, name, actual)).toEqual(_defineProperty({
      path: path
    }, name, expected));
  }

  if (expectedTree.parentDisplayName !== undefined) {
    expectEqual(ReactComponentTreeDevtool.getDisplayName(parentID), expectedTree.parentDisplayName, 'parentDisplayName');
  }
  if (expectedTree.ownerDisplayName !== undefined) {
    expectEqual(ReactComponentTreeDevtool.getDisplayName(ownerID), expectedTree.ownerDisplayName, 'ownerDisplayName');
  }
  if (expectedTree.parentID !== undefined) {
    expectEqual(parentID, expectedTree.parentID, 'parentID');
  }
  if (expectedTree.text !== undefined) {
    expectEqual(text, expectedTree.text, 'text');
    expectEqual('' + element, expectedTree.text, 'element.toString()');
  } else {
    expectEqual(text, null, 'text');
  }
  if (expectedTree.element !== undefined) {
    // TODO: Comparing elements makes tests run out of memory on errors.
    // For now, compare just types.
    expectEqual(element && element.type, expectedTree.element && expectedTree.element.type, 'element.type');
  } else if (text == null) {
    expectEqual(typeof element, 'object', 'typeof element');
  }
  if (expectedTree.children !== undefined) {
    expectEqual(childIDs.length, expectedTree.children.length, 'children.length');
    for (var i = 0; i < childIDs.length; i++) {
      expectTree(childIDs[i], _extends({ parentID: rootID }, expectedTree.children[i]), path);
    }
  } else {
    expectEqual(childIDs, [], 'childIDs');
  }
}

var ReactComponentTreeTestUtils = {
  expectTree: expectTree,
  getRootDisplayNames: getRootDisplayNames,
  getRegisteredDisplayNames: getRegisteredDisplayNames
};

module.exports = ReactComponentTreeTestUtils;