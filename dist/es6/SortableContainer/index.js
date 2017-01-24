import _extends from 'babel-runtime/helpers/extends';
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';

import Manager from '../Manager';
import { closest, events, vendorPrefix, limit, getElementMargin, provideDisplayName, omit } from '../utils';

// Export Higher Order Sortable Container Component
export default function sortableContainer(WrappedComponent) {
	var _class, _temp;

	var config = arguments.length <= 1 || arguments[1] === undefined ? { withRef: false } : arguments[1];

	return _temp = _class = function (_Component) {
		_inherits(_class, _Component);

		function _class(props) {
			_classCallCheck(this, _class);

			var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(_class).call(this, props));

			_this.handleStart = function (e) {
				var _this$props = _this.props;
				var distance = _this$props.distance;
				var shouldCancelStart = _this$props.shouldCancelStart;


				if (e.button === 2 || shouldCancelStart(e)) {
					return false;
				}

				_this._touched = true;
				_this._pos = {
					x: e.clientX,
					y: e.clientY
				};

				var node = closest(e.target, function (el) {
					return el.sortableInfo != null;
				});

				if (node && node.sortableInfo && _this.nodeIsChild(node) && !_this.state.sorting) {
					var useDragHandle = _this.props.useDragHandle;
					var _node$sortableInfo = node.sortableInfo;
					var index = _node$sortableInfo.index;
					var collection = _node$sortableInfo.collection;


					if (useDragHandle && !closest(e.target, function (el) {
						return el.sortableHandle != null;
					})) return;

					_this.manager.active = { index: index, collection: collection };

					/*
      * Fixes a bug in Firefox where the :active state of anchor tags
      * prevent subsequent 'mousemove' events from being fired
      * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
      */
					if (e.target.tagName.toLowerCase() === 'a') {
						e.preventDefault();
					}

					if (!distance) {
						if (_this.props.pressDelay === 0) {
							_this.handlePress(e);
						} else {
							_this.pressTimer = setTimeout(function () {
								return _this.handlePress(e);
							}, _this.props.pressDelay);
						}
					}
				}
			};

			_this.nodeIsChild = function (node) {
				return node.sortableInfo.manager == _this.manager;
			};

			_this.handleMove = function (e) {
				var distance = _this.props.distance;


				if (!_this.state.sorting && _this._touched) {
					_this._delta = {
						x: _this._pos.x - e.clientX,
						y: _this._pos.y - e.clientY
					};
					var delta = Math.abs(_this._delta.x) + Math.abs(_this._delta.y);

					if (!distance) {
						clearTimeout(_this.cancelTimer);
						_this.cancelTimer = setTimeout(_this.cancel, 0);
					} else if (delta >= distance) {
						_this.handlePress(e);
					}
				}
			};

			_this.handleEnd = function () {
				var distance = _this.props.distance;


				_this._touched = false;

				if (!distance) {
					_this.cancel();
				}
			};

			_this.cancel = function () {
				if (!_this.state.sorting) {
					clearTimeout(_this.pressTimer);
					_this.manager.active = null;
				}
			};

			_this.handlePress = function (e) {
				var active = _this.manager.getActive();

				if (active) {
					(function () {
						var _this$props2 = _this.props;
						var axis = _this$props2.axis;
						var getHelperDimensions = _this$props2.getHelperDimensions;
						var helperClass = _this$props2.helperClass;
						var hideSortableGhost = _this$props2.hideSortableGhost;
						var onSortStart = _this$props2.onSortStart;
						var useWindowAsScrollContainer = _this$props2.useWindowAsScrollContainer;
						var node = active.node;
						var collection = active.collection;
						var index = node.sortableInfo.index;

						var margin = getElementMargin(node);

						var containerBoundingRect = _this.container.getBoundingClientRect();
						var dimensions = getHelperDimensions({ index: index, node: node, collection: collection });

						_this.node = node;
						_this.margin = margin;
						_this.width = dimensions.width;
						_this.height = dimensions.height;
						_this.marginOffset = {
							x: _this.margin.left + _this.margin.right,
							y: Math.max(_this.margin.top, _this.margin.bottom)
						};
						_this.boundingClientRect = node.getBoundingClientRect();
						_this.containerBoundingRect = containerBoundingRect;
						_this.index = index;
						_this.newIndex = index;

						_this.axis = {
							x: axis.indexOf('x') >= 0,
							y: axis.indexOf('y') >= 0
						};
						_this.offsetEdge = _this.getEdgeOffset(node);
						_this.initialOffset = _this.getOffset(e);
						_this.initialScroll = {
							top: _this.scrollContainer.scrollTop,
							left: _this.scrollContainer.scrollLeft
						};

						var fields = node.querySelectorAll('input, textarea, select');
						var clonedNode = node.cloneNode(true);
						var clonedFields = [].concat(_toConsumableArray(clonedNode.querySelectorAll('input, textarea, select'))); // Convert NodeList to Array

						clonedFields.forEach(function (field, index) {
							return field.value = fields[index] && fields[index].value;
						});

						_this.helper = _this.document.body.appendChild(clonedNode);

						_this.helper.style.position = 'fixed';
						_this.helper.style.top = _this.boundingClientRect.top - margin.top + 'px';
						_this.helper.style.left = _this.boundingClientRect.left - margin.left + 'px';
						_this.helper.style.width = _this.width + 'px';
						_this.helper.style.height = _this.height + 'px';
						_this.helper.style.boxSizing = 'border-box';

						if (hideSortableGhost) {
							_this.sortableGhost = node;
							node.style.visibility = 'hidden';
						}

						_this.minTranslate = {};
						_this.maxTranslate = {};
						if (_this.axis.x) {
							_this.minTranslate.x = (useWindowAsScrollContainer ? 0 : containerBoundingRect.left) - _this.boundingClientRect.left - _this.width / 2;
							_this.maxTranslate.x = (useWindowAsScrollContainer ? _this.contentWindow.innerWidth : containerBoundingRect.left + containerBoundingRect.width) - _this.boundingClientRect.left - _this.width / 2;
						}
						if (_this.axis.y) {
							_this.minTranslate.y = (useWindowAsScrollContainer ? 0 : containerBoundingRect.top) - _this.boundingClientRect.top - _this.height / 2;
							_this.maxTranslate.y = (useWindowAsScrollContainer ? _this.contentWindow.innerHeight : containerBoundingRect.top + containerBoundingRect.height) - _this.boundingClientRect.top - _this.height / 2;
						}

						if (helperClass) {
							var _this$helper$classLis;

							(_this$helper$classLis = _this.helper.classList).add.apply(_this$helper$classLis, _toConsumableArray(helperClass.split(' ')));
						}

						_this.listenerNode = e.touches ? node : _this.contentWindow;
						events.move.forEach(function (eventName) {
							return _this.listenerNode.addEventListener(eventName, _this.handleSortMove, false);
						});
						events.end.forEach(function (eventName) {
							return _this.listenerNode.addEventListener(eventName, _this.handleSortEnd, false);
						});

						_this.setState({
							sorting: true,
							sortingIndex: index
						});

						if (onSortStart) onSortStart({ node: node, index: index, collection: collection }, e);
					})();
				}
			};

			_this.handleSortMove = function (e) {
				var onSortMove = _this.props.onSortMove;

				e.preventDefault(); // Prevent scrolling on mobile

				_this.updatePosition(e);
				_this.animateNodes();
				_this.autoscroll();

				if (onSortMove) onSortMove(e);
			};

			_this.handleSortEnd = function (e) {
				var _this$props3 = _this.props;
				var hideSortableGhost = _this$props3.hideSortableGhost;
				var onSortEnd = _this$props3.onSortEnd;
				var collection = _this.manager.active.collection;

				// Remove the event listeners if the node is still in the DOM

				if (_this.listenerNode) {
					events.move.forEach(function (eventName) {
						return _this.listenerNode.removeEventListener(eventName, _this.handleSortMove);
					});
					events.end.forEach(function (eventName) {
						return _this.listenerNode.removeEventListener(eventName, _this.handleSortEnd);
					});
				}

				// Remove the helper from the DOM
				_this.helper.parentNode.removeChild(_this.helper);

				if (hideSortableGhost && _this.sortableGhost) {
					_this.sortableGhost.style.visibility = '';
				}

				var nodes = _this.manager.refs[collection];
				for (var i = 0, len = nodes.length; i < len; i++) {
					var node = nodes[i];
					var el = node.node;

					// Clear the cached offsetTop / offsetLeft value
					node.edgeOffset = null;

					// Remove the transforms / transitions
					el.style[vendorPrefix + 'Transform'] = '';
					el.style[vendorPrefix + 'TransitionDuration'] = '';
				}

				if (typeof onSortEnd === 'function') {
					onSortEnd({
						oldIndex: _this.index,
						newIndex: _this.newIndex,
						collection: collection
					}, e);
				}

				// Stop autoscroll
				clearInterval(_this.autoscrollInterval);
				_this.autoscrollInterval = null;

				// Update state
				_this.manager.active = null;

				_this.setState({
					sorting: false,
					sortingIndex: null
				});

				_this._touched = false;
			};

			_this.autoscroll = function () {
				var translate = _this.translate;
				var direction = {
					x: 0,
					y: 0
				};
				var speed = {
					x: 1,
					y: 1
				};
				var acceleration = {
					x: 10,
					y: 10
				};

				if (translate.y >= _this.maxTranslate.y - _this.height / 2) {
					direction.y = 1; // Scroll Down
					speed.y = acceleration.y * Math.abs((_this.maxTranslate.y - _this.height / 2 - translate.y) / _this.height);
				} else if (translate.x >= _this.maxTranslate.x - _this.width / 2) {
					direction.x = 1; // Scroll Right
					speed.x = acceleration.x * Math.abs((_this.maxTranslate.x - _this.width / 2 - translate.x) / _this.width);
				} else if (translate.y <= _this.minTranslate.y + _this.height / 2) {
					direction.y = -1; // Scroll Up
					speed.y = acceleration.y * Math.abs((translate.y - _this.height / 2 - _this.minTranslate.y) / _this.height);
				} else if (translate.x <= _this.minTranslate.x + _this.width / 2) {
					direction.x = -1; // Scroll Left
					speed.x = acceleration.x * Math.abs((translate.x - _this.width / 2 - _this.minTranslate.x) / _this.width);
				}

				if (_this.autoscrollInterval) {
					clearInterval(_this.autoscrollInterval);
					_this.autoscrollInterval = null;
					_this.isAutoScrolling = false;
				}

				if (direction.x !== 0 || direction.y !== 0) {
					_this.autoscrollInterval = setInterval(function () {
						_this.isAutoScrolling = true;
						var offset = {
							left: 1 * speed.x * direction.x,
							top: 1 * speed.y * direction.y
						};
						_this.scrollContainer.scrollTop += offset.top;
						_this.scrollContainer.scrollLeft += offset.left;
						_this.translate.x += offset.left;
						_this.translate.y += offset.top;
						_this.animateNodes();
					}, 5);
				}
			};

			_this.manager = new Manager();
			_this.events = {
				start: _this.handleStart,
				move: _this.handleMove,
				end: _this.handleEnd
			};

			invariant(!(props.distance && props.pressDelay), 'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.');

			_this.state = {};
			return _this;
		}

		_createClass(_class, [{
			key: 'getChildContext',
			value: function getChildContext() {
				return {
					manager: this.manager
				};
			}
		}, {
			key: 'componentDidMount',
			value: function componentDidMount() {
				var _this2 = this;

				var _props = this.props;
				var contentWindow = _props.contentWindow;
				var getContainer = _props.getContainer;
				var useWindowAsScrollContainer = _props.useWindowAsScrollContainer;


				this.container = typeof getContainer === 'function' ? getContainer(this.getWrappedInstance()) : ReactDOM.findDOMNode(this);
				this.document = this.container.ownerDocument || document;
				this.scrollContainer = useWindowAsScrollContainer ? this.document.body : this.container;
				this.contentWindow = typeof contentWindow === 'function' ? contentWindow() : contentWindow;

				var _loop = function _loop(key) {
					events[key].forEach(function (eventName) {
						return _this2.container.addEventListener(eventName, _this2.events[key], false);
					});
				};

				for (var key in this.events) {
					_loop(key);
				}
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				var _this3 = this;

				var _loop2 = function _loop2(key) {
					events[key].forEach(function (eventName) {
						return _this3.container.removeEventListener(eventName, _this3.events[key]);
					});
				};

				for (var key in this.events) {
					_loop2(key);
				}
			}
		}, {
			key: 'getEdgeOffset',
			value: function getEdgeOffset(node) {
				var offset = arguments.length <= 1 || arguments[1] === undefined ? { top: 0, left: 0 } : arguments[1];

				// Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
				if (node) {
					var nodeOffset = {
						top: offset.top + node.offsetTop,
						left: offset.left + node.offsetLeft
					};
					if (node.parentNode !== this.container) {
						return this.getEdgeOffset(node.parentNode, nodeOffset);
					} else {
						return nodeOffset;
					}
				}
			}
		}, {
			key: 'getOffset',
			value: function getOffset(e) {
				return {
					x: e.touches ? e.touches[0].clientX : e.clientX,
					y: e.touches ? e.touches[0].clientY : e.clientY
				};
			}
		}, {
			key: 'getLockPixelOffsets',
			value: function getLockPixelOffsets() {
				var lockOffset = this.props.lockOffset;


				if (!Array.isArray(lockOffset)) {
					lockOffset = [lockOffset, lockOffset];
				}

				invariant(lockOffset.length === 2, 'lockOffset prop of SortableContainer should be a single ' + 'value or an array of exactly two values. Given %s', lockOffset);

				var _lockOffset = lockOffset;

				var _lockOffset2 = _slicedToArray(_lockOffset, 2);

				var minLockOffset = _lockOffset2[0];
				var maxLockOffset = _lockOffset2[1];


				return [this.getLockPixelOffset(minLockOffset), this.getLockPixelOffset(maxLockOffset)];
			}
		}, {
			key: 'getLockPixelOffset',
			value: function getLockPixelOffset(lockOffset) {
				var offsetX = lockOffset;
				var offsetY = lockOffset;
				var unit = 'px';

				if (typeof lockOffset === 'string') {
					var match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);

					invariant(match !== null, 'lockOffset value should be a number or a string of a ' + 'number followed by "px" or "%". Given %s', lockOffset);

					offsetX = offsetY = parseFloat(lockOffset);
					unit = match[1];
				}

				invariant(isFinite(offsetX) && isFinite(offsetY), 'lockOffset value should be a finite. Given %s', lockOffset);

				if (unit === '%') {
					offsetX = offsetX * this.width / 100;
					offsetY = offsetY * this.height / 100;
				}

				return {
					x: offsetX,
					y: offsetY
				};
			}
		}, {
			key: 'updatePosition',
			value: function updatePosition(e) {
				var _props2 = this.props;
				var lockAxis = _props2.lockAxis;
				var lockToContainerEdges = _props2.lockToContainerEdges;

				var offset = this.getOffset(e);
				var translate = {
					x: offset.x - this.initialOffset.x,
					y: offset.y - this.initialOffset.y
				};
				this.translate = translate;

				if (lockToContainerEdges) {
					var _getLockPixelOffsets = this.getLockPixelOffsets();

					var _getLockPixelOffsets2 = _slicedToArray(_getLockPixelOffsets, 2);

					var minLockOffset = _getLockPixelOffsets2[0];
					var maxLockOffset = _getLockPixelOffsets2[1];

					var minOffset = {
						x: this.width / 2 - minLockOffset.x,
						y: this.height / 2 - minLockOffset.y
					};
					var maxOffset = {
						x: this.width / 2 - maxLockOffset.x,
						y: this.height / 2 - maxLockOffset.y
					};

					translate.x = limit(this.minTranslate.x + minOffset.x, this.maxTranslate.x - maxOffset.x, translate.x);
					translate.y = limit(this.minTranslate.y + minOffset.y, this.maxTranslate.y - maxOffset.y, translate.y);
				}

				switch (lockAxis) {
					case 'x':
						translate.y = 0;
						break;
					case 'y':
						translate.x = 0;
						break;
				}

				this.helper.style[vendorPrefix + 'Transform'] = 'translate3d(' + translate.x + 'px,' + translate.y + 'px, 0)';
			}
		}, {
			key: 'animateNodes',
			value: function animateNodes() {
				var _props3 = this.props;
				var transitionDuration = _props3.transitionDuration;
				var hideSortableGhost = _props3.hideSortableGhost;

				var nodes = this.manager.getOrderedRefs();
				var deltaScroll = {
					left: this.scrollContainer.scrollLeft - this.initialScroll.left,
					top: this.scrollContainer.scrollTop - this.initialScroll.top
				};
				var sortingOffset = {
					left: this.offsetEdge.left + this.translate.x + deltaScroll.left,
					top: this.offsetEdge.top + this.translate.y + deltaScroll.top
				};
				this.newIndex = null;

				for (var i = 0, len = nodes.length; i < len; i++) {
					var _nodes$i = nodes[i];
					var node = _nodes$i.node;
					var edgeOffset = _nodes$i.edgeOffset;

					var index = node.sortableInfo.index;
					var width = node.offsetWidth;
					var height = node.offsetHeight;
					var offset = {
						width: this.width > width ? width / 2 : this.width / 2,
						height: this.height > height ? height / 2 : this.height / 2
					};
					var translate = {
						x: 0,
						y: 0
					};

					// If we haven't cached the node's offsetTop / offsetLeft value
					if (!edgeOffset) {
						nodes[i].edgeOffset = edgeOffset = this.getEdgeOffset(node);
					}

					// Get a reference to the next and previous node
					var nextNode = i < nodes.length - 1 && nodes[i + 1];
					var prevNode = i > 0 && nodes[i - 1];

					// Also cache the next node's edge offset if needed.
					// We need this for calculating the animation in a grid setup
					if (nextNode && !nextNode.edgeOffset) {
						nextNode.edgeOffset = this.getEdgeOffset(nextNode.node);
					}

					// If the node is the one we're currently animating, skip it
					if (index === this.index) {
						if (hideSortableGhost) {
							/*
        * With windowing libraries such as `react-virtualized`, the sortableGhost
        * node may change while scrolling down and then back up (or vice-versa),
        * so we need to update the reference to the new node just to be safe.
        */
							this.sortableGhost = node;
							node.style.visibility = 'hidden';
						}
						continue;
					}

					if (transitionDuration) {
						node.style[vendorPrefix + 'TransitionDuration'] = transitionDuration + 'ms';
					}

					if (this.axis.x) {
						if (this.axis.y) {
							// Calculations for a grid setup
							if (index < this.index && (sortingOffset.left - offset.width <= edgeOffset.left && sortingOffset.top <= edgeOffset.top + offset.height || sortingOffset.top + offset.height <= edgeOffset.top)) {
								// If the current node is to the left on the same row, or above the node that's being dragged
								// then move it to the right
								translate.x = this.width + this.marginOffset.x;
								if (edgeOffset.left + translate.x > this.containerBoundingRect.width - offset.width) {
									// If it moves passed the right bounds, then animate it to the first position of the next row.
									// We just use the offset of the next node to calculate where to move, because that node's original position
									// is exactly where we want to go
									translate.x = nextNode.edgeOffset.left - edgeOffset.left;
									translate.y = nextNode.edgeOffset.top - edgeOffset.top;
								}
								if (this.newIndex === null) {
									this.newIndex = index;
								}
							} else if (index > this.index && (sortingOffset.left + offset.width >= edgeOffset.left && sortingOffset.top + offset.height >= edgeOffset.top || sortingOffset.top + offset.height >= edgeOffset.top + height)) {
								// If the current node is to the right on the same row, or below the node that's being dragged
								// then move it to the left
								translate.x = -(this.width + this.marginOffset.x);
								if (edgeOffset.left + translate.x < this.containerBoundingRect.left + offset.width) {
									// If it moves passed the left bounds, then animate it to the last position of the previous row.
									// We just use the offset of the previous node to calculate where to move, because that node's original position
									// is exactly where we want to go
									translate.x = prevNode.edgeOffset.left - edgeOffset.left;
									translate.y = prevNode.edgeOffset.top - edgeOffset.top;
								}
								this.newIndex = index;
							}
						} else {
							if (index > this.index && sortingOffset.left + offset.width >= edgeOffset.left) {
								translate.x = -(this.width + this.marginOffset.x);
								this.newIndex = index;
							} else if (index < this.index && sortingOffset.left <= edgeOffset.left + offset.width) {
								translate.x = this.width + this.marginOffset.x;
								if (this.newIndex == null) {
									this.newIndex = index;
								}
							}
						}
					} else if (this.axis.y) {
						if (index > this.index && sortingOffset.top + offset.height >= edgeOffset.top) {
							translate.y = -(this.height + this.marginOffset.y);
							this.newIndex = index;
						} else if (index < this.index && sortingOffset.top <= edgeOffset.top + offset.height) {
							translate.y = this.height + this.marginOffset.y;
							if (this.newIndex == null) {
								this.newIndex = index;
							}
						}
					}
					node.style[vendorPrefix + 'Transform'] = 'translate3d(' + translate.x + 'px,' + translate.y + 'px,0)';
				}

				if (this.newIndex == null) {
					this.newIndex = this.index;
				}
			}
		}, {
			key: 'getWrappedInstance',
			value: function getWrappedInstance() {
				invariant(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call');
				return this.refs.wrappedInstance;
			}
		}, {
			key: 'render',
			value: function render() {
				var ref = config.withRef ? 'wrappedInstance' : null;

				return React.createElement(WrappedComponent, _extends({
					ref: ref
				}, omit(this.props, 'contentWindow', 'useWindowAsScrollContainer', 'distance', 'helperClass', 'hideSortableGhost', 'transitionDuration', 'useDragHandle', 'pressDelay', 'shouldCancelStart', 'onSortStart', 'onSortMove', 'onSortEnd', 'axis', 'lockAxis', 'lockOffset', 'lockToContainerEdges', 'getContainer')));
			}
		}]);

		return _class;
	}(Component), _class.displayName = provideDisplayName('sortableList', WrappedComponent), _class.defaultProps = {
		axis: 'y',
		transitionDuration: 300,
		pressDelay: 0,
		distance: 0,
		useWindowAsScrollContainer: false,
		hideSortableGhost: true,
		contentWindow: typeof window !== 'undefined' ? window : null,
		shouldCancelStart: function shouldCancelStart(e) {
			// Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
			if (['input', 'textarea', 'select', 'option'].indexOf(e.target.tagName.toLowerCase()) !== -1) {
				return true; // Return true to cancel sorting
			}
		},
		lockToContainerEdges: false,
		lockOffset: '50%',
		getHelperDimensions: function getHelperDimensions(_ref) {
			var node = _ref.node;
			return {
				width: node.offsetWidth,
				height: node.offsetHeight
			};
		}
	}, _class.propTypes = {
		axis: PropTypes.oneOf(['x', 'y', 'xy']),
		distance: PropTypes.number,
		lockAxis: PropTypes.string,
		helperClass: PropTypes.string,
		transitionDuration: PropTypes.number,
		contentWindow: PropTypes.any,
		onSortStart: PropTypes.func,
		onSortMove: PropTypes.func,
		onSortEnd: PropTypes.func,
		shouldCancelStart: PropTypes.func,
		pressDelay: PropTypes.number,
		useDragHandle: PropTypes.bool,
		useWindowAsScrollContainer: PropTypes.bool,
		hideSortableGhost: PropTypes.bool,
		lockToContainerEdges: PropTypes.bool,
		lockOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))]),
		getContainer: PropTypes.func,
		getHelperDimensions: PropTypes.func
	}, _class.childContextTypes = {
		manager: PropTypes.object.isRequired
	}, _temp;
}