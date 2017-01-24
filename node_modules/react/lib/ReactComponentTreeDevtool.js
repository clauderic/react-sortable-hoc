/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponentTreeDevtool
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var tree = {};
var unmountedIDs = {};
var rootIDs = {};

function updateTree(id, update) {
  if (!tree[id]) {
    tree[id] = {
      element: null,
      parentID: null,
      ownerID: null,
      text: null,
      childIDs: [],
      displayName: 'Unknown',
      isMounted: false,
      updateCount: 0
    };
  }
  update(tree[id]);
}

function purgeDeep(id) {
  var item = tree[id];
  if (item) {
    var childIDs = item.childIDs;

    delete tree[id];
    childIDs.forEach(purgeDeep);
  }
}

function describeComponentFrame(name, source, ownerName) {
  return '\n    in ' + name + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
}

function describeID(id) {
  var name = ReactComponentTreeDevtool.getDisplayName(id);
  var element = ReactComponentTreeDevtool.getElement(id);
  var ownerID = ReactComponentTreeDevtool.getOwnerID(id);
  var ownerName;
  if (ownerID) {
    ownerName = ReactComponentTreeDevtool.getDisplayName(ownerID);
  }
  process.env.NODE_ENV !== 'production' ? warning(element, 'ReactComponentTreeDevtool: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
  return describeComponentFrame(name, element && element._source, ownerName);
}

var ReactComponentTreeDevtool = {
  onSetDisplayName: function (id, displayName) {
    updateTree(id, function (item) {
      return item.displayName = displayName;
    });
  },
  onSetChildren: function (id, nextChildIDs) {
    updateTree(id, function (item) {
      item.childIDs = nextChildIDs;

      nextChildIDs.forEach(function (nextChildID) {
        var nextChild = tree[nextChildID];
        !nextChild ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected devtool events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('68') : void 0;
        !(nextChild.displayName != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetDisplayName() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('69') : void 0;
        !(nextChild.childIDs != null || nextChild.text != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetChildren() or onSetText() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('70') : void 0;
        !nextChild.isMounted ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('71') : void 0;
        if (nextChild.parentID == null) {
          nextChild.parentID = id;
          // TODO: This shouldn't be necessary but mounting a new root during in
          // componentWillMount currently causes not-yet-mounted components to
          // be purged from our tree data so their parent ID is missing.
        }
        !(nextChild.parentID === id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetParent() and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant('72', nextChildID, nextChild.parentID, id) : void 0;
      });
    });
  },
  onSetOwner: function (id, ownerID) {
    updateTree(id, function (item) {
      return item.ownerID = ownerID;
    });
  },
  onSetParent: function (id, parentID) {
    updateTree(id, function (item) {
      return item.parentID = parentID;
    });
  },
  onSetText: function (id, text) {
    updateTree(id, function (item) {
      return item.text = text;
    });
  },
  onBeforeMountComponent: function (id, element) {
    updateTree(id, function (item) {
      return item.element = element;
    });
  },
  onBeforeUpdateComponent: function (id, element) {
    updateTree(id, function (item) {
      return item.element = element;
    });
  },
  onMountComponent: function (id) {
    updateTree(id, function (item) {
      return item.isMounted = true;
    });
  },
  onMountRootComponent: function (id) {
    rootIDs[id] = true;
  },
  onUpdateComponent: function (id) {
    updateTree(id, function (item) {
      return item.updateCount++;
    });
  },
  onUnmountComponent: function (id) {
    updateTree(id, function (item) {
      return item.isMounted = false;
    });
    unmountedIDs[id] = true;
    delete rootIDs[id];
  },
  purgeUnmountedComponents: function () {
    if (ReactComponentTreeDevtool._preventPurging) {
      // Should only be used for testing.
      return;
    }

    for (var id in unmountedIDs) {
      purgeDeep(id);
    }
    unmountedIDs = {};
  },
  isMounted: function (id) {
    var item = tree[id];
    return item ? item.isMounted : false;
  },
  getCurrentStackAddendum: function (topElement) {
    var info = '';
    if (topElement) {
      var type = topElement.type;
      var name = typeof type === 'function' ? type.displayName || type.name : type;
      var owner = topElement._owner;
      info += describeComponentFrame(name || 'Unknown', topElement._source, owner && owner.getName());
    }

    var currentOwner = ReactCurrentOwner.current;
    var id = currentOwner && currentOwner._debugID;

    info += ReactComponentTreeDevtool.getStackAddendumByID(id);
    return info;
  },
  getStackAddendumByID: function (id) {
    var info = '';
    while (id) {
      info += describeID(id);
      id = ReactComponentTreeDevtool.getParentID(id);
    }
    return info;
  },
  getChildIDs: function (id) {
    var item = tree[id];
    return item ? item.childIDs : [];
  },
  getDisplayName: function (id) {
    var item = tree[id];
    return item ? item.displayName : 'Unknown';
  },
  getElement: function (id) {
    var item = tree[id];
    return item ? item.element : null;
  },
  getOwnerID: function (id) {
    var item = tree[id];
    return item ? item.ownerID : null;
  },
  getParentID: function (id) {
    var item = tree[id];
    return item ? item.parentID : null;
  },
  getSource: function (id) {
    var item = tree[id];
    var element = item ? item.element : null;
    var source = element != null ? element._source : null;
    return source;
  },
  getText: function (id) {
    var item = tree[id];
    return item ? item.text : null;
  },
  getUpdateCount: function (id) {
    var item = tree[id];
    return item ? item.updateCount : 0;
  },
  getRootIDs: function () {
    return Object.keys(rootIDs);
  },
  getRegisteredIDs: function () {
    return Object.keys(tree);
  }
};

module.exports = ReactComponentTreeDevtool;