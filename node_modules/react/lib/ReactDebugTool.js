/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDebugTool
 */

'use strict';

var ReactInvalidSetStateWarningDevTool = require('./ReactInvalidSetStateWarningDevTool');
var ReactHostOperationHistoryDevtool = require('./ReactHostOperationHistoryDevtool');
var ReactComponentTreeDevtool = require('./ReactComponentTreeDevtool');
var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var performanceNow = require('fbjs/lib/performanceNow');
var warning = require('fbjs/lib/warning');

var eventHandlers = [];
var handlerDoesThrowForEvent = {};

function emitEvent(handlerFunctionName, arg1, arg2, arg3, arg4, arg5) {
  eventHandlers.forEach(function (handler) {
    try {
      if (handler[handlerFunctionName]) {
        handler[handlerFunctionName](arg1, arg2, arg3, arg4, arg5);
      }
    } catch (e) {
      process.env.NODE_ENV !== 'production' ? warning(handlerDoesThrowForEvent[handlerFunctionName], 'exception thrown by devtool while handling %s: %s', handlerFunctionName, e + '\n' + e.stack) : void 0;
      handlerDoesThrowForEvent[handlerFunctionName] = true;
    }
  });
}

var isProfiling = false;
var flushHistory = [];
var lifeCycleTimerStack = [];
var currentFlushNesting = 0;
var currentFlushMeasurements = null;
var currentFlushStartTime = null;
var currentTimerDebugID = null;
var currentTimerStartTime = null;
var currentTimerNestedFlushDuration = null;
var currentTimerType = null;

function clearHistory() {
  ReactComponentTreeDevtool.purgeUnmountedComponents();
  ReactHostOperationHistoryDevtool.clearHistory();
}

function getTreeSnapshot(registeredIDs) {
  return registeredIDs.reduce(function (tree, id) {
    var ownerID = ReactComponentTreeDevtool.getOwnerID(id);
    var parentID = ReactComponentTreeDevtool.getParentID(id);
    tree[id] = {
      displayName: ReactComponentTreeDevtool.getDisplayName(id),
      text: ReactComponentTreeDevtool.getText(id),
      updateCount: ReactComponentTreeDevtool.getUpdateCount(id),
      childIDs: ReactComponentTreeDevtool.getChildIDs(id),
      // Text nodes don't have owners but this is close enough.
      ownerID: ownerID || ReactComponentTreeDevtool.getOwnerID(parentID),
      parentID: parentID
    };
    return tree;
  }, {});
}

function resetMeasurements() {
  var previousStartTime = currentFlushStartTime;
  var previousMeasurements = currentFlushMeasurements || [];
  var previousOperations = ReactHostOperationHistoryDevtool.getHistory();

  if (currentFlushNesting === 0) {
    currentFlushStartTime = null;
    currentFlushMeasurements = null;
    clearHistory();
    return;
  }

  if (previousMeasurements.length || previousOperations.length) {
    var registeredIDs = ReactComponentTreeDevtool.getRegisteredIDs();
    flushHistory.push({
      duration: performanceNow() - previousStartTime,
      measurements: previousMeasurements || [],
      operations: previousOperations || [],
      treeSnapshot: getTreeSnapshot(registeredIDs)
    });
  }

  clearHistory();
  currentFlushStartTime = performanceNow();
  currentFlushMeasurements = [];
}

function checkDebugID(debugID) {
  process.env.NODE_ENV !== 'production' ? warning(debugID, 'ReactDebugTool: debugID may not be empty.') : void 0;
}

function beginLifeCycleTimer(debugID, timerType) {
  if (currentFlushNesting === 0) {
    return;
  }
  process.env.NODE_ENV !== 'production' ? warning(!currentTimerType, 'There is an internal error in the React performance measurement code. ' + 'Did not expect %s timer to start while %s timer is still in ' + 'progress for %s instance.', timerType, currentTimerType || 'no', debugID === currentTimerDebugID ? 'the same' : 'another') : void 0;
  currentTimerStartTime = performanceNow();
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = debugID;
  currentTimerType = timerType;
}

function endLifeCycleTimer(debugID, timerType) {
  if (currentFlushNesting === 0) {
    return;
  }
  process.env.NODE_ENV !== 'production' ? warning(currentTimerType === timerType, 'There is an internal error in the React performance measurement code. ' + 'We did not expect %s timer to stop while %s timer is still in ' + 'progress for %s instance. Please report this as a bug in React.', timerType, currentTimerType || 'no', debugID === currentTimerDebugID ? 'the same' : 'another') : void 0;
  if (isProfiling) {
    currentFlushMeasurements.push({
      timerType: timerType,
      instanceID: debugID,
      duration: performanceNow() - currentTimerStartTime - currentTimerNestedFlushDuration
    });
  }
  currentTimerStartTime = null;
  currentTimerNestedFlushDuration = null;
  currentTimerDebugID = null;
  currentTimerType = null;
}

function pauseCurrentLifeCycleTimer() {
  var currentTimer = {
    startTime: currentTimerStartTime,
    nestedFlushStartTime: performanceNow(),
    debugID: currentTimerDebugID,
    timerType: currentTimerType
  };
  lifeCycleTimerStack.push(currentTimer);
  currentTimerStartTime = null;
  currentTimerNestedFlushDuration = null;
  currentTimerDebugID = null;
  currentTimerType = null;
}

function resumeCurrentLifeCycleTimer() {
  var _lifeCycleTimerStack$ = lifeCycleTimerStack.pop();

  var startTime = _lifeCycleTimerStack$.startTime;
  var nestedFlushStartTime = _lifeCycleTimerStack$.nestedFlushStartTime;
  var debugID = _lifeCycleTimerStack$.debugID;
  var timerType = _lifeCycleTimerStack$.timerType;

  var nestedFlushDuration = performanceNow() - nestedFlushStartTime;
  currentTimerStartTime = startTime;
  currentTimerNestedFlushDuration += nestedFlushDuration;
  currentTimerDebugID = debugID;
  currentTimerType = timerType;
}

var ReactDebugTool = {
  addDevtool: function (devtool) {
    eventHandlers.push(devtool);
  },
  removeDevtool: function (devtool) {
    for (var i = 0; i < eventHandlers.length; i++) {
      if (eventHandlers[i] === devtool) {
        eventHandlers.splice(i, 1);
        i--;
      }
    }
  },
  isProfiling: function () {
    return isProfiling;
  },
  beginProfiling: function () {
    if (isProfiling) {
      return;
    }

    isProfiling = true;
    flushHistory.length = 0;
    resetMeasurements();
    ReactDebugTool.addDevtool(ReactHostOperationHistoryDevtool);
  },
  endProfiling: function () {
    if (!isProfiling) {
      return;
    }

    isProfiling = false;
    resetMeasurements();
    ReactDebugTool.removeDevtool(ReactHostOperationHistoryDevtool);
  },
  getFlushHistory: function () {
    return flushHistory;
  },
  onBeginFlush: function () {
    currentFlushNesting++;
    resetMeasurements();
    pauseCurrentLifeCycleTimer();
    emitEvent('onBeginFlush');
  },
  onEndFlush: function () {
    resetMeasurements();
    currentFlushNesting--;
    resumeCurrentLifeCycleTimer();
    emitEvent('onEndFlush');
  },
  onBeginLifeCycleTimer: function (debugID, timerType) {
    checkDebugID(debugID);
    emitEvent('onBeginLifeCycleTimer', debugID, timerType);
    beginLifeCycleTimer(debugID, timerType);
  },
  onEndLifeCycleTimer: function (debugID, timerType) {
    checkDebugID(debugID);
    endLifeCycleTimer(debugID, timerType);
    emitEvent('onEndLifeCycleTimer', debugID, timerType);
  },
  onBeginReconcilerTimer: function (debugID, timerType) {
    checkDebugID(debugID);
    emitEvent('onBeginReconcilerTimer', debugID, timerType);
  },
  onEndReconcilerTimer: function (debugID, timerType) {
    checkDebugID(debugID);
    emitEvent('onEndReconcilerTimer', debugID, timerType);
  },
  onError: function (debugID) {
    if (currentTimerDebugID != null) {
      endLifeCycleTimer(currentTimerDebugID, currentTimerType);
    }
    emitEvent('onError', debugID);
  },
  onBeginProcessingChildContext: function () {
    emitEvent('onBeginProcessingChildContext');
  },
  onEndProcessingChildContext: function () {
    emitEvent('onEndProcessingChildContext');
  },
  onHostOperation: function (debugID, type, payload) {
    checkDebugID(debugID);
    emitEvent('onHostOperation', debugID, type, payload);
  },
  onSetState: function () {
    emitEvent('onSetState');
  },
  onSetDisplayName: function (debugID, displayName) {
    checkDebugID(debugID);
    emitEvent('onSetDisplayName', debugID, displayName);
  },
  onSetChildren: function (debugID, childDebugIDs) {
    checkDebugID(debugID);
    childDebugIDs.forEach(checkDebugID);
    emitEvent('onSetChildren', debugID, childDebugIDs);
  },
  onSetOwner: function (debugID, ownerDebugID) {
    checkDebugID(debugID);
    emitEvent('onSetOwner', debugID, ownerDebugID);
  },
  onSetParent: function (debugID, parentDebugID) {
    checkDebugID(debugID);
    emitEvent('onSetParent', debugID, parentDebugID);
  },
  onSetText: function (debugID, text) {
    checkDebugID(debugID);
    emitEvent('onSetText', debugID, text);
  },
  onMountRootComponent: function (debugID) {
    checkDebugID(debugID);
    emitEvent('onMountRootComponent', debugID);
  },
  onBeforeMountComponent: function (debugID, element) {
    checkDebugID(debugID);
    emitEvent('onBeforeMountComponent', debugID, element);
  },
  onMountComponent: function (debugID) {
    checkDebugID(debugID);
    emitEvent('onMountComponent', debugID);
  },
  onBeforeUpdateComponent: function (debugID, element) {
    checkDebugID(debugID);
    emitEvent('onBeforeUpdateComponent', debugID, element);
  },
  onUpdateComponent: function (debugID) {
    checkDebugID(debugID);
    emitEvent('onUpdateComponent', debugID);
  },
  onUnmountComponent: function (debugID) {
    checkDebugID(debugID);
    emitEvent('onUnmountComponent', debugID);
  },
  onTestEvent: function () {
    emitEvent('onTestEvent');
  }
};

ReactDebugTool.addDevtool(ReactInvalidSetStateWarningDevTool);
ReactDebugTool.addDevtool(ReactComponentTreeDevtool);
var url = ExecutionEnvironment.canUseDOM && window.location.href || '';
if (/[?&]react_perf\b/.test(url)) {
  ReactDebugTool.beginProfiling();
}

module.exports = ReactDebugTool;