import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import invariant from 'invariant';
import Manager from '../Manager';
<<<<<<< HEAD
import {
<<<<<<< HEAD
  closest,
  events,
  vendorPrefix,
  limit,
  getElementMargin,
  provideDisplayName,
  omit,
=======
  clamp,
  closest,
  events,
  getElementMargin,
  omit,
  provideDisplayName,
  vendorPrefix
>>>>>>> Refactoring
} from '../utils';
=======
import {clamp, closest, events, getElementMargin, omit, provideDisplayName, vendorPrefix} from '../utils';
>>>>>>> Enforce consistent linting

// Export Higher Order Sortable Container Component
export default function sortableContainer(WrappedComponent, config = {withRef: false}) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.manager = new Manager();
      this.events = {
        start: this.handleStart,
        move: this.handleMove,
        end: this.handleEnd,
      };

<<<<<<< HEAD
      invariant(
        !(props.distance && props.pressDelay),
        'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.'
      );
=======
      invariant(!(props.distance && props.pressDelay), 'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.');
>>>>>>> Enforce consistent linting

      this.state = {};
    }

    static displayName = provideDisplayName('sortableList', WrappedComponent);

    static defaultProps = {
      axis: 'y',
      transitionDuration: 300,
      pressDelay: 0,
<<<<<<< HEAD
      pressThreshold: 5,
=======
>>>>>>> Enforce consistent linting
      distance: 0,
      useWindowAsScrollContainer: false,
      hideSortableGhost: true,
      contentWindow: typeof window !== 'undefined' ? window : null,
      shouldCancelStart: function(e) {
        // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
<<<<<<< HEAD
        const disabledElements = ['input', 'textarea', 'select', 'option', 'button'];

        if (disabledElements.indexOf(e.target.tagName.toLowerCase()) !== -1) {
=======
        if (['input', 'textarea', 'select', 'option'].indexOf(e.target.tagName.toLowerCase()) !== -1) {
>>>>>>> Enforce consistent linting
          return true; // Return true to cancel sorting
        }
      },
      lockToContainerEdges: false,
      lockOffset: '50%',
      getHelperDimensions: ({node}) => ({
        width: node.offsetWidth,
        height: node.offsetHeight,
      }),
    };

    static propTypes = {
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
<<<<<<< HEAD
      lockOffset: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        ),
      ]),
=======
      lockOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))]),
>>>>>>> Enforce consistent linting
      getContainer: PropTypes.func,
      getHelperDimensions: PropTypes.func,
    };

    static childContextTypes = {
      manager: PropTypes.object.isRequired,
    };

    getChildContext() {
      return {
        manager: this.manager,
      };
    }

    componentDidMount() {
      const {
        contentWindow,
        getContainer,
        useWindowAsScrollContainer,
      } = this.props;

      this.container = typeof getContainer === 'function'
        ? getContainer(this.getWrappedInstance())
<<<<<<< HEAD
        : findDOMNode(this);
=======
        : ReactDOM.findDOMNode(this);
>>>>>>> Enforce consistent linting
      this.document = this.container.ownerDocument || document;
      this.scrollContainer = useWindowAsScrollContainer
        ? this.document.body
        : this.container;
      this.contentWindow = typeof contentWindow === 'function'
        ? contentWindow()
        : contentWindow;

<<<<<<< HEAD
      for (const key in this.events) {
        if (this.events.hasOwnProperty(key)) {
          events[key].forEach(eventName =>
            this.container.addEventListener(eventName, this.events[key], false)
          );
        }
      }
    }

    componentWillUnmount() {
      for (const key in this.events) {
        if (this.events.hasOwnProperty(key)) {
          events[key].forEach(eventName =>
            this.container.removeEventListener(eventName, this.events[key])
          );
        }
      }
=======
      Object.keys(this.events).forEach(key => events[key].forEach(eventName =>
        this.container.addEventListener(eventName, this.events[key], false)
      ));
    }

    componentWillUnmount() {
      Object.keys(this.events).forEach(key => events[key].forEach(eventName =>
        this.container.removeEventListener(eventName, this.events[key], false)
      ));
>>>>>>> Enforce consistent linting
    }

    handleStart = e => {
      const {distance, shouldCancelStart} = this.props;

      if (e.button === 2 || shouldCancelStart(e)) {
        return false;
      }

      this._touched = true;
      this._pos = {
        x: e.clientX,
        y: e.clientY,
      };

      const node = closest(e.target, el => el.sortableInfo != null);

<<<<<<< HEAD
      if (
        node &&
        node.sortableInfo &&
        this.nodeIsChild(node) &&
        !this.state.sorting
      ) {
        const {useDragHandle} = this.props;
        const {index, collection} = node.sortableInfo;

        if (
          useDragHandle && !closest(e.target, el => el.sortableHandle != null)
        )
          return;
=======
      if (node && node.sortableInfo && this.nodeIsChild(node) && !this.state.sorting) {
        const {useDragHandle} = this.props;
        const {index, collection} = node.sortableInfo;

        if (useDragHandle && !closest(e.target, el => el.sortableHandle != null)) return;
>>>>>>> Enforce consistent linting

        this.manager.active = {index, collection};

        /*
				 * Fixes a bug in Firefox where the :active state of anchor tags
				 * prevent subsequent 'mousemove' events from being fired
				 * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
				 */
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Enforce consistent linting
        if (e.target.tagName.toLowerCase() === 'a') {
          e.preventDefault();
        }

        if (!distance) {
          if (this.props.pressDelay === 0) {
            this.handlePress(e);
          } else {
<<<<<<< HEAD
            this.pressTimer = setTimeout(
              () => this.handlePress(e),
              this.props.pressDelay
            );
=======
            this.pressTimer = setTimeout(() => this.handlePress(e), this.props.pressDelay);
>>>>>>> Enforce consistent linting
          }
        }
      }
    };

    nodeIsChild = node => {
      return node.sortableInfo.manager === this.manager;
    };

    handleMove = e => {
<<<<<<< HEAD
      const {distance, pressThreshold} = this.props;
=======
      const {distance} = this.props;
>>>>>>> Enforce consistent linting

      if (!this.state.sorting && this._touched) {
        this._delta = {
          x: this._pos.x - e.clientX,
          y: this._pos.y - e.clientY,
        };
        const delta = Math.abs(this._delta.x) + Math.abs(this._delta.y);

<<<<<<< HEAD
        if (!distance && (!pressThreshold || pressThreshold && delta >= pressThreshold)) {
          clearTimeout(this.cancelTimer);
          this.cancelTimer = setTimeout(this.cancel, 0);
        } else if (distance && delta >= distance) {
=======
        if (!distance) {
          clearTimeout(this.cancelTimer);
          this.cancelTimer = setTimeout(this.cancel, 0);
        } else if (delta >= distance) {
>>>>>>> Enforce consistent linting
          this.handlePress(e);
        }
      }
    };

    handleEnd = () => {
      const {distance} = this.props;

      this._touched = false;

      if (!distance) {
        this.cancel();
      }
    };

    cancel = () => {
      if (!this.state.sorting) {
        clearTimeout(this.pressTimer);
        this.manager.active = null;
      }
    };

    handlePress = e => {
      const active = this.manager.getActive();

      if (active) {
        const {
          axis,
          getHelperDimensions,
          helperClass,
          hideSortableGhost,
          onSortStart,
          useWindowAsScrollContainer,
        } = this.props;
        const {node, collection} = active;
        const {index} = node.sortableInfo;
        const margin = getElementMargin(node);

        const containerBoundingRect = this.container.getBoundingClientRect();
        const dimensions = getHelperDimensions({index, node, collection});

        this.node = node;
        this.margin = margin;
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.marginOffset = {
          x: this.margin.left + this.margin.right,
          y: Math.max(this.margin.top, this.margin.bottom),
        };
        this.boundingClientRect = node.getBoundingClientRect();
        this.containerBoundingRect = containerBoundingRect;
        this.index = index;
        this.newIndex = index;

        this.axis = {
          x: axis.indexOf('x') >= 0,
          y: axis.indexOf('y') >= 0,
        };
        this.offsetEdge = this.getEdgeOffset(node);
        this.initialOffset = this.getOffset(e);
        this.initialScroll = {
          top: this.scrollContainer.scrollTop,
          left: this.scrollContainer.scrollLeft,
        };

        const fields = node.querySelectorAll('input, textarea, select');
        const clonedNode = node.cloneNode(true);
<<<<<<< HEAD
        const clonedFields = [
          ...clonedNode.querySelectorAll('input, textarea, select'),
        ]; // Convert NodeList to Array
=======
        const clonedFields = [...clonedNode.querySelectorAll('input, textarea, select')];
>>>>>>> Enforce consistent linting

        clonedFields.forEach((field, index) => {
          return (field.value = fields[index] && fields[index].value);
        });

        this.helper = this.document.body.appendChild(clonedNode);

        this.helper.style.position = 'fixed';
        this.helper.style.top = `${this.boundingClientRect.top - margin.top}px`;
        this.helper.style.left = `${this.boundingClientRect.left - margin.left}px`;
        this.helper.style.width = `${this.width}px`;
        this.helper.style.height = `${this.height}px`;
        this.helper.style.boxSizing = 'border-box';
<<<<<<< HEAD
        this.helper.style.pointerEvents = 'none';
=======
>>>>>>> Enforce consistent linting

        if (hideSortableGhost) {
          this.sortableGhost = node;
          node.style.visibility = 'hidden';
        }

        this.minTranslate = {};
        this.maxTranslate = {};
<<<<<<< HEAD
        if (this.axis.x) {
          this.minTranslate.x = (useWindowAsScrollContainer
            ? 0
            : containerBoundingRect.left) -
            this.boundingClientRect.left -
            this.width / 2;
          this.maxTranslate.x = (useWindowAsScrollContainer
            ? this.contentWindow.innerWidth
            : containerBoundingRect.left + containerBoundingRect.width) -
            this.boundingClientRect.left -
            this.width / 2;
        }
        if (this.axis.y) {
          this.minTranslate.y = (useWindowAsScrollContainer
            ? 0
            : containerBoundingRect.top) -
            this.boundingClientRect.top -
            this.height / 2;
          this.maxTranslate.y = (useWindowAsScrollContainer
            ? this.contentWindow.innerHeight
            : containerBoundingRect.top + containerBoundingRect.height) -
            this.boundingClientRect.top -
            this.height / 2;
=======

        if (this.axis.x) {
          this.minTranslate.x = (useWindowAsScrollContainer ? 0 : containerBoundingRect.left) - this.boundingClientRect.left - this.width / 2;
          this.maxTranslate.x = (useWindowAsScrollContainer ? this.contentWindow.innerWidth : containerBoundingRect.left + containerBoundingRect.width) - this.boundingClientRect.left - this.width / 2;
        }

        if (this.axis.y) {
          this.minTranslate.y = (useWindowAsScrollContainer ? 0 : containerBoundingRect.top) - this.boundingClientRect.top - this.height / 2;
          this.maxTranslate.y = (useWindowAsScrollContainer ? this.contentWindow.innerHeight : containerBoundingRect.top + containerBoundingRect.height) - this.boundingClientRect.top - this.height / 2;
>>>>>>> Enforce consistent linting
        }

        if (helperClass) {
          this.helper.classList.add(...helperClass.split(' '));
        }

        this.listenerNode = e.touches ? node : this.contentWindow;
<<<<<<< HEAD
        events.move.forEach(eventName =>
          this.listenerNode.addEventListener(
            eventName,
            this.handleSortMove,
            false
          ));
        events.end.forEach(eventName =>
          this.listenerNode.addEventListener(
            eventName,
            this.handleSortEnd,
            false
          ));
=======
        events.move.forEach(eventName => this.listenerNode.addEventListener(eventName, this.handleSortMove, {
          passive: false,
        }));
        events.end.forEach(eventName => this.listenerNode.addEventListener(eventName, this.handleSortEnd, {
          passive: false,
        }));
>>>>>>> Enforce consistent linting

        this.setState({
          sorting: true,
          sortingIndex: index,
        });

        if (onSortStart) onSortStart({node, index, collection}, e);
      }
    };

    handleSortMove = e => {
      const {onSortMove} = this.props;
      e.preventDefault(); // Prevent scrolling on mobile

      this.updatePosition(e);
      this.animateNodes();
      this.autoscroll();

      if (onSortMove) onSortMove(e);
    };

    handleSortEnd = e => {
      const {hideSortableGhost, onSortEnd} = this.props;
      const {collection} = this.manager.active;

      // Remove the event listeners if the node is still in the DOM
      if (this.listenerNode) {
<<<<<<< HEAD
        events.move.forEach(eventName =>
          this.listenerNode.removeEventListener(
            eventName,
            this.handleSortMove
          ));
        events.end.forEach(eventName =>
          this.listenerNode.removeEventListener(eventName, this.handleSortEnd));
=======
        events.move.forEach(eventName => this.listenerNode.removeEventListener(eventName, this.handleSortMove));
        events.end.forEach(eventName => this.listenerNode.removeEventListener(eventName, this.handleSortEnd));
>>>>>>> Enforce consistent linting
      }

      // Remove the helper from the DOM
      this.helper.parentNode.removeChild(this.helper);

      if (hideSortableGhost && this.sortableGhost) {
        this.sortableGhost.style.visibility = '';
      }

      const nodes = this.manager.refs[collection];
      for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        const el = node.node;

        // Clear the cached offsetTop / offsetLeft value
        node.edgeOffset = null;

        // Remove the transforms / transitions
        el.style[`${vendorPrefix}Transform`] = '';
        el.style[`${vendorPrefix}TransitionDuration`] = '';
      }

      // Stop autoscroll
      clearInterval(this.autoscrollInterval);
      this.autoscrollInterval = null;

      // Update state
      this.manager.active = null;

      this.setState({
        sorting: false,
        sortingIndex: null,
      });

      if (typeof onSortEnd === 'function') {
        onSortEnd(
          {
            oldIndex: this.index,
            newIndex: this.newIndex,
            collection,
          },
          e
        );
      }

      this._touched = false;
    };

    getEdgeOffset(node, offset = {top: 0, left: 0}) {
      // Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
      if (node) {
        const nodeOffset = {
          top: offset.top + node.offsetTop,
          left: offset.left + node.offsetLeft,
        };
        if (node.parentNode !== this.container) {
          return this.getEdgeOffset(node.parentNode, nodeOffset);
        } else {
          return nodeOffset;
        }
      }
    }

    getOffset(e) {
      return {
        x: e.touches ? e.touches[0].clientX : e.clientX,
        y: e.touches ? e.touches[0].clientY : e.clientY,
      };
    }

    getLockPixelOffsets() {
      let {lockOffset} = this.props;

      if (!Array.isArray(lockOffset)) {
        lockOffset = [lockOffset, lockOffset];
      }

<<<<<<< HEAD
      invariant(
        lockOffset.length === 2,
        'lockOffset prop of SortableContainer should be a single ' +
          'value or an array of exactly two values. Given %s',
        lockOffset
      );

      const [minLockOffset, maxLockOffset] = lockOffset;

      return [
        this.getLockPixelOffset(minLockOffset),
        this.getLockPixelOffset(maxLockOffset),
      ];
=======
      invariant(lockOffset.length === 2, 'lockOffset prop of SortableContainer should be a single value or an array of exactly two values. Given %s', lockOffset);

      const [minLockOffset, maxLockOffset] = lockOffset;

      return [this.getLockPixelOffset(minLockOffset), this.getLockPixelOffset(maxLockOffset)];
>>>>>>> Enforce consistent linting
    }

    getLockPixelOffset(lockOffset) {
      let offsetX = lockOffset;
      let offsetY = lockOffset;
      let unit = 'px';

      if (typeof lockOffset === 'string') {
        const match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);

<<<<<<< HEAD
        invariant(
          match !== null,
          'lockOffset value should be a number or a string of a ' +
            'number followed by "px" or "%". Given %s',
          lockOffset
        );
=======
        invariant(match !== null, 'lockOffset value should be a number or a string of a number followed by "px" or "%". Given %s', lockOffset);
>>>>>>> Enforce consistent linting

        offsetX = (offsetY = parseFloat(lockOffset));
        unit = match[1];
      }

<<<<<<< HEAD
      invariant(
        isFinite(offsetX) && isFinite(offsetY),
        'lockOffset value should be a finite. Given %s',
        lockOffset
      );
=======
      invariant(isFinite(offsetX) && isFinite(offsetY), 'lockOffset value should be a finite. Given %s', lockOffset);
>>>>>>> Enforce consistent linting

      if (unit === '%') {
        offsetX = offsetX * this.width / 100;
        offsetY = offsetY * this.height / 100;
      }

      return {
        x: offsetX,
        y: offsetY,
      };
    }

    updatePosition(e) {
      const {lockAxis, lockToContainerEdges} = this.props;
      const offset = this.getOffset(e);
<<<<<<< HEAD
      const translate = {
        x: offset.x - this.initialOffset.x,
        y: offset.y - this.initialOffset.y,
      };
      this.translate = translate;
=======
      const translate = this.translate = {
        x: offset.x - this.initialOffset.x,
        y: offset.y - this.initialOffset.y,
      };
>>>>>>> Enforce consistent linting

      if (lockToContainerEdges) {
        const [minLockOffset, maxLockOffset] = this.getLockPixelOffsets();
        const minOffset = {
          x: this.width / 2 - minLockOffset.x,
          y: this.height / 2 - minLockOffset.y,
        };
        const maxOffset = {
          x: this.width / 2 - maxLockOffset.x,
          y: this.height / 2 - maxLockOffset.y,
        };

<<<<<<< HEAD
        translate.x = limit(
          this.minTranslate.x + minOffset.x,
          this.maxTranslate.x - maxOffset.x,
          translate.x
        );
        translate.y = limit(
          this.minTranslate.y + minOffset.y,
          this.maxTranslate.y - maxOffset.y,
          translate.y
        );
=======
        translate.x = clamp(translate.x, this.minTranslate.x + minOffset.x, this.maxTranslate.x - maxOffset.x);
        translate.y = clamp(translate.y, this.minTranslate.y + minOffset.y, this.maxTranslate.y - maxOffset.y);
>>>>>>> Enforce consistent linting
      }

      if (lockAxis === 'x') {
        translate.y = 0;
      } else if (lockAxis === 'y') {
        translate.x = 0;
      }

<<<<<<< HEAD
      this.helper.style[
        `${vendorPrefix}Transform`
      ] = `translate3d(${translate.x}px,${translate.y}px, 0)`;
=======
      this.helper.style[`${vendorPrefix}Transform`] = `translate3d(${translate.x}px,${translate.y}px, 0)`;
>>>>>>> Enforce consistent linting
    }

    animateNodes() {
      const {transitionDuration, hideSortableGhost} = this.props;
      const nodes = this.manager.getOrderedRefs();
      const deltaScroll = {
        left: this.scrollContainer.scrollLeft - this.initialScroll.left,
        top: this.scrollContainer.scrollTop - this.initialScroll.top,
      };
      const sortingOffset = {
        left: this.offsetEdge.left + this.translate.x + deltaScroll.left,
        top: this.offsetEdge.top + this.translate.y + deltaScroll.top,
      };
      this.newIndex = null;

      for (let i = 0, len = nodes.length; i < len; i++) {
        const {node} = nodes[i];
        const index = node.sortableInfo.index;
        const width = node.offsetWidth;
        const height = node.offsetHeight;
        const offset = {
          width: this.width > width ? width / 2 : this.width / 2,
          height: this.height > height ? height / 2 : this.height / 2,
        };
        const translate = {
          x: 0,
          y: 0,
        };
        let {edgeOffset} = nodes[i];

        // If we haven't cached the node's offsetTop / offsetLeft value
        if (!edgeOffset) {
<<<<<<< HEAD
          nodes[i].edgeOffset = (edgeOffset = this.getEdgeOffset(node));
=======
          nodes[i].edgeOffset = edgeOffset = this.getEdgeOffset(node);
>>>>>>> Enforce consistent linting
        }

        // Get a reference to the next and previous node
        const nextNode = i < nodes.length - 1 && nodes[i + 1];
        const prevNode = i > 0 && nodes[i - 1];

        // Also cache the next node's edge offset if needed.
        // We need this for calculating the animation in a grid setup
        if (nextNode && !nextNode.edgeOffset) {
          nextNode.edgeOffset = this.getEdgeOffset(nextNode.node);
        }

        // If the node is the one we're currently animating, skip it
        if (index === this.index) {
          if (hideSortableGhost) {
            /*
<<<<<<< HEAD
=======
				if (e.target.tagName.toLowerCase() === 'a') {
					e.preventDefault();
				}

				if (!distance) {
					if (this.props.pressDelay === 0) {
						this.handlePress(e);
					} else {
						this.pressTimer = setTimeout(() => this.handlePress(e), this.props.pressDelay);
					}
				}
			}
		};

		nodeIsChild = node => {
			return node.sortableInfo.manager == this.manager;
		};

		handleMove = (e) => {
			const {distance} = this.props;

			if (!this.state.sorting && this._touched) {
				this._delta = {
					x: this._pos.x - e.clientX,
					y: this._pos.y - e.clientY
				};
				const delta = Math.abs(this._delta.x) + Math.abs(this._delta.y);

				if (!distance) {
					clearTimeout(this.cancelTimer);
					this.cancelTimer = setTimeout(this.cancel, 0);
				} else if (delta >= distance) {
					this.handlePress(e);
				}
			}
		};

		handleEnd = () => {
			const {distance} = this.props;

			this._touched = false;

			if (!distance) { this.cancel(); }
		};

		cancel = () => {
			if (!this.state.sorting) {
				clearTimeout(this.pressTimer);
				this.manager.active = null;
			}
		};

		handlePress = (e) => {
			const active = this.manager.getActive();

			if (active) {
				const {axis, getHelperDimensions, helperClass, hideSortableGhost, onSortStart, useWindowAsScrollContainer} = this.props;
				let {node, collection} = active;
				const {index} = node.sortableInfo;
				const margin = getElementMargin(node);

				const containerBoundingRect = this.container.getBoundingClientRect();
				const dimensions = getHelperDimensions({index, node, collection});

				this.node = node;
				this.margin = margin;
				this.width = dimensions.width;
				this.height = dimensions.height;
				this.marginOffset = {
					x: this.margin.left + this.margin.right,
					y: Math.max(this.margin.top, this.margin.bottom)
				};
				this.boundingClientRect = node.getBoundingClientRect();
				this.containerBoundingRect = containerBoundingRect;
				this.index = index;
				this.newIndex = index;

				this.axis = {
					x: axis.indexOf('x') >= 0,
					y: axis.indexOf('y') >= 0
				};
				this.offsetEdge = this.getEdgeOffset(node);
				this.initialOffset = this.getOffset(e);
				this.initialScroll = {
					top: this.scrollContainer.scrollTop,
					left: this.scrollContainer.scrollLeft
				};

				const fields = node.querySelectorAll('input, textarea, select');
				const clonedNode = node.cloneNode(true);
				const clonedFields = [...clonedNode.querySelectorAll('input, textarea, select')]; // Convert NodeList to Array

				clonedFields.forEach((field, index) => {
					return field.value = fields[index] && fields[index].value;
				});

				this.helper = this.document.body.appendChild(clonedNode);

				this.helper.style.position = 'fixed';
				this.helper.style.top = `${this.boundingClientRect.top - margin.top}px`;
				this.helper.style.left = `${this.boundingClientRect.left - margin.left}px`;
				this.helper.style.width = `${this.width}px`;
				this.helper.style.height = `${this.height}px`;
				this.helper.style.boxSizing = 'border-box';

				if (hideSortableGhost) {
					this.sortableGhost = node;
					node.style.visibility = 'hidden';
				}

				this.minTranslate = {};
				this.maxTranslate = {};
				if (this.axis.x) {
					this.minTranslate.x = ((useWindowAsScrollContainer) ? 0 : containerBoundingRect.left) - this.boundingClientRect.left - (this.width / 2);
					this.maxTranslate.x = ((useWindowAsScrollContainer) ? this.contentWindow.innerWidth : containerBoundingRect.left + containerBoundingRect.width) - this.boundingClientRect.left - (this.width / 2);
				}
				if (this.axis.y) {
					this.minTranslate.y = ((useWindowAsScrollContainer) ? 0 : containerBoundingRect.top) - this.boundingClientRect.top - (this.height / 2);
					this.maxTranslate.y = ((useWindowAsScrollContainer) ? this.contentWindow.innerHeight : containerBoundingRect.top + containerBoundingRect.height) - this.boundingClientRect.top - (this.height / 2);
				}

				if (helperClass) {
					this.helper.classList.add(...(helperClass.split(' ')));
				}

				this.listenerNode = (e.touches) ? node : this.contentWindow;
				events.move.forEach(eventName => this.listenerNode.addEventListener(eventName, this.handleSortMove, {passive: false}));
				events.end.forEach(eventName => this.listenerNode.addEventListener(eventName, this.handleSortEnd, {passive: false}));

				this.setState({
					sorting: true,
					sortingIndex: index
				});

				if (onSortStart) onSortStart({node, index, collection}, e);
			}
		}

		handleSortMove = (e) => {
			const {onSortMove} = this.props;
			e.preventDefault(); // Prevent scrolling on mobile

			this.updatePosition(e);
			this.animateNodes();
			this.autoscroll();

			if (onSortMove) onSortMove(e);
		}

		handleSortEnd = (e) => {
			const {hideSortableGhost, onSortEnd} = this.props;
			const {collection} = this.manager.active;

			// Remove the event listeners if the node is still in the DOM
			if (this.listenerNode) {
				events.move.forEach(eventName => this.listenerNode.removeEventListener(eventName, this.handleSortMove));
				events.end.forEach(eventName => this.listenerNode.removeEventListener(eventName, this.handleSortEnd));
			}

			// Remove the helper from the DOM
			this.helper.parentNode.removeChild(this.helper);

			if (hideSortableGhost && this.sortableGhost) {
				this.sortableGhost.style.visibility = '';
			}

			const nodes = this.manager.refs[collection];
			for (let i = 0, len = nodes.length; i < len; i++) {
				let node = nodes[i];
				let el = node.node;

				// Clear the cached offsetTop / offsetLeft value
				node.edgeOffset = null;

				// Remove the transforms / transitions
				el.style[`${vendorPrefix}Transform`] = '';
				el.style[`${vendorPrefix}TransitionDuration`] = '';
			}

			// Stop autoscroll
			clearInterval(this.autoscrollInterval);
			this.autoscrollInterval = null;

			// Update state
			this.manager.active = null;

			this.setState({
				sorting: false,
				sortingIndex: null
			});

			if (typeof onSortEnd === 'function') {
				onSortEnd({
					oldIndex: this.index,
					newIndex: this.newIndex,
					collection
				}, e);
			}

			this._touched = false;
		}

		getEdgeOffset(node, offset = { top: 0, left: 0 }) {
			// Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
			if (node) {
				const nodeOffset = {
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

		getOffset(e) {
			return {
				x: (e.touches) ? e.touches[0].clientX : e.clientX,
				y: (e.touches) ? e.touches[0].clientY : e.clientY
			};
		}

		getLockPixelOffsets() {
			let {lockOffset} = this.props;

			if (!Array.isArray(lockOffset)) {
				lockOffset = [lockOffset, lockOffset];
			}

			invariant(
				lockOffset.length === 2,
				'lockOffset prop of SortableContainer should be a single ' +
				'value or an array of exactly two values. Given %s',
				lockOffset
			);

			const [minLockOffset, maxLockOffset] = lockOffset;

			return [
				this.getLockPixelOffset(minLockOffset),
				this.getLockPixelOffset(maxLockOffset)
			];
		}

		getLockPixelOffset(lockOffset) {
			let offsetX = lockOffset;
			let offsetY = lockOffset;
			let unit = 'px';

			if (typeof lockOffset === 'string') {
				const match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);

				invariant(
					match !== null,
					'lockOffset value should be a number or a string of a ' +
					'number followed by "px" or "%". Given %s',
					lockOffset
				);

				offsetX = offsetY = parseFloat(lockOffset);
				unit = match[1];
			}

			invariant(
				isFinite(offsetX) && isFinite(offsetY),
				'lockOffset value should be a finite. Given %s',
				lockOffset
			);

			if (unit === '%') {
				offsetX = offsetX * this.width / 100;
				offsetY = offsetY * this.height / 100;
			}

			return {
				x: offsetX,
				y: offsetY
			};
		}

		updatePosition(e) {
			const {lockAxis, lockToContainerEdges} = this.props;
			const offset = this.getOffset(e);
			let translate = {
				x: offset.x - this.initialOffset.x,
				y: offset.y - this.initialOffset.y
			};
			this.translate = translate;

			if (lockToContainerEdges) {
				const [minLockOffset, maxLockOffset] = this.getLockPixelOffsets();
				const minOffset = {
					x: (this.width / 2) - minLockOffset.x,
					y: (this.height / 2) - minLockOffset.y
				};
				const maxOffset = {
					x: (this.width / 2) - maxLockOffset.x,
					y: (this.height / 2) - maxLockOffset.y
				};

				translate.x = clamp(
          translate.x,
					this.minTranslate.x + minOffset.x,
					this.maxTranslate.x - maxOffset.x,
				);
				translate.y = clamp(
          translate.y,
					this.minTranslate.y + minOffset.y,
					this.maxTranslate.y - maxOffset.y,
				);
			}

			switch (lockAxis) {
				case 'x':
					translate.y = 0;
					break;
				case 'y':
					translate.x = 0;
					break;
			}

			this.helper.style[`${vendorPrefix}Transform`] = `translate3d(${translate.x}px,${translate.y}px, 0)`;
		}

		animateNodes() {
			const {transitionDuration, hideSortableGhost} = this.props;
			let nodes = this.manager.getOrderedRefs();
			const deltaScroll = {
				left: this.scrollContainer.scrollLeft - this.initialScroll.left,
				top: this.scrollContainer.scrollTop - this.initialScroll.top
			};
			const sortingOffset = {
				left: this.offsetEdge.left + this.translate.x + deltaScroll.left,
				top: this.offsetEdge.top + this.translate.y + deltaScroll.top
			};
			this.newIndex = null;

			for (let i = 0, len = nodes.length; i < len; i++) {
				let {node, edgeOffset} = nodes[i];
				const index = node.sortableInfo.index;
				const width = node.offsetWidth;
				const height = node.offsetHeight;
				const offset = {
					width: (this.width > width) ? (width / 2) : (this.width / 2),
					height: (this.height > height) ? (height / 2) : (this.height / 2)
				};
				let translate = {
					x: 0,
					y: 0
				};

				// If we haven't cached the node's offsetTop / offsetLeft value
				if (!edgeOffset) {
					nodes[i].edgeOffset = edgeOffset = this.getEdgeOffset(node);
				}

				// Get a reference to the next and previous node
				const nextNode = i < nodes.length - 1 && nodes[i + 1];
				const prevNode = i > 0 && nodes[i - 1];

				// Also cache the next node's edge offset if needed.
				// We need this for calculating the animation in a grid setup
				if (nextNode && !nextNode.edgeOffset) {
					nextNode.edgeOffset = this.getEdgeOffset(nextNode.node)
				}

				// If the node is the one we're currently animating, skip it
				if (index === this.index) {
					if (hideSortableGhost) {
						/*
>>>>>>> Refactoring
=======
>>>>>>> Enforce consistent linting
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
<<<<<<< HEAD
          node.style[
            `${vendorPrefix}TransitionDuration`
          ] = `${transitionDuration}ms`;
=======
          node.style[`${vendorPrefix}TransitionDuration`] = `${transitionDuration}ms`;
>>>>>>> Enforce consistent linting
        }

        if (this.axis.x) {
          if (this.axis.y) {
            // Calculations for a grid setup
            if (
<<<<<<< HEAD
              index < this.index &&
              (
                (sortingOffset.left - offset.width <= edgeOffset.left &&
                sortingOffset.top <= edgeOffset.top + offset.height) ||
=======
              index < this.index && (
                (sortingOffset.left - offset.width <= edgeOffset.left && sortingOffset.top <= edgeOffset.top + offset.height) ||
>>>>>>> Enforce consistent linting
                sortingOffset.top + offset.height <= edgeOffset.top
              )
            ) {
              // If the current node is to the left on the same row, or above the node that's being dragged
              // then move it to the right
              translate.x = this.width + this.marginOffset.x;
<<<<<<< HEAD
              if (
                edgeOffset.left + translate.x >
                this.containerBoundingRect.width - offset.width
              ) {
=======

              if (edgeOffset.left + translate.x > this.containerBoundingRect.width - offset.width) {
>>>>>>> Enforce consistent linting
                // If it moves passed the right bounds, then animate it to the first position of the next row.
                // We just use the offset of the next node to calculate where to move, because that node's original position
                // is exactly where we want to go
                translate.x = nextNode.edgeOffset.left - edgeOffset.left;
                translate.y = nextNode.edgeOffset.top - edgeOffset.top;
              }
              if (this.newIndex === null) {
                this.newIndex = index;
              }
            } else if (
<<<<<<< HEAD
              index > this.index &&
              (
                (sortingOffset.left + offset.width >= edgeOffset.left &&
                sortingOffset.top + offset.height >= edgeOffset.top) ||
                sortingOffset.top + offset.height >= edgeOffset.top + height
=======
              index > this.index && (
                (sortingOffset.left + offset.width >= edgeOffset.left && sortingOffset.top + offset.height >= edgeOffset.top)
                || sortingOffset.top + offset.height >= edgeOffset.top + height
>>>>>>> Enforce consistent linting
              )
            ) {
              // If the current node is to the right on the same row, or below the node that's being dragged
              // then move it to the left
              translate.x = -(this.width + this.marginOffset.x);
<<<<<<< HEAD
              if (
                edgeOffset.left + translate.x <
                this.containerBoundingRect.left + offset.width
              ) {
=======

              if (edgeOffset.left + translate.x < this.containerBoundingRect.left + offset.width) {
>>>>>>> Enforce consistent linting
                // If it moves passed the left bounds, then animate it to the last position of the previous row.
                // We just use the offset of the previous node to calculate where to move, because that node's original position
                // is exactly where we want to go
                translate.x = prevNode.edgeOffset.left - edgeOffset.left;
                translate.y = prevNode.edgeOffset.top - edgeOffset.top;
              }
<<<<<<< HEAD
              this.newIndex = index;
            }
          } else {
            if (
              index > this.index &&
              sortingOffset.left + offset.width >= edgeOffset.left
            ) {
              translate.x = -(this.width + this.marginOffset.x);
              this.newIndex = index;
            } else if (
              index < this.index &&
              sortingOffset.left <= edgeOffset.left + offset.width
            ) {
              translate.x = this.width + this.marginOffset.x;
=======

              this.newIndex = index;
            }
          } else {
            if (index > this.index && sortingOffset.left + offset.width >= edgeOffset.left) {
              translate.x = -(this.width + this.marginOffset.x);
              this.newIndex = index;

            } else if (index < this.index && sortingOffset.left <= edgeOffset.left + offset.width) {
              translate.x = this.width + this.marginOffset.x;

>>>>>>> Enforce consistent linting
              if (this.newIndex == null) {
                this.newIndex = index;
              }
            }
          }
        } else if (this.axis.y) {
<<<<<<< HEAD
          if (
            index > this.index &&
            sortingOffset.top + offset.height >= edgeOffset.top
          ) {
            translate.y = -(this.height + this.marginOffset.y);
            this.newIndex = index;
          } else if (
            index < this.index &&
            sortingOffset.top <= edgeOffset.top + offset.height
          ) {
            translate.y = this.height + this.marginOffset.y;
=======
          if (index > this.index && sortingOffset.top + offset.height >= edgeOffset.top) {
            translate.y = -(this.height + this.marginOffset.y);
            this.newIndex = index;
          } else if (index < this.index && sortingOffset.top <= edgeOffset.top + offset.height) {
            translate.y = this.height + this.marginOffset.y;

>>>>>>> Enforce consistent linting
            if (this.newIndex == null) {
              this.newIndex = index;
            }
          }
        }
        node.style[`${vendorPrefix}Transform`] = `translate3d(${translate.x}px,${translate.y}px,0)`;
      }

      if (this.newIndex == null) {
        this.newIndex = this.index;
      }
    }

    autoscroll = () => {
      const translate = this.translate;
      const direction = {
        x: 0,
        y: 0,
      };
      const speed = {
        x: 1,
        y: 1,
      };
      const acceleration = {
        x: 10,
        y: 10,
      };

      if (translate.y >= this.maxTranslate.y - this.height / 2) {
        direction.y = 1; // Scroll Down
        speed.y = acceleration.y * Math.abs((this.maxTranslate.y - this.height / 2 - translate.y) / this.height);
      } else if (translate.x >= this.maxTranslate.x - this.width / 2) {
        direction.x = 1; // Scroll Right
        speed.x = acceleration.x * Math.abs((this.maxTranslate.x - this.width / 2 - translate.x) / this.width);
      } else if (translate.y <= this.minTranslate.y + this.height / 2) {
        direction.y = -1; // Scroll Up
        speed.y = acceleration.y * Math.abs((translate.y - this.height / 2 - this.minTranslate.y) / this.height);
      } else if (translate.x <= this.minTranslate.x + this.width / 2) {
        direction.x = -1; // Scroll Left
        speed.x = acceleration.x * Math.abs((translate.x - this.width / 2 - this.minTranslate.x) / this.width);
      }

      if (this.autoscrollInterval) {
        clearInterval(this.autoscrollInterval);
        this.autoscrollInterval = null;
        this.isAutoScrolling = false;
      }

      if (direction.x !== 0 || direction.y !== 0) {
        this.autoscrollInterval = setInterval(
          () => {
            this.isAutoScrolling = true;
            const offset = {
              left: 1 * speed.x * direction.x,
              top: 1 * speed.y * direction.y,
            };
            this.scrollContainer.scrollTop += offset.top;
            this.scrollContainer.scrollLeft += offset.left;
            this.translate.x += offset.left;
            this.translate.y += offset.top;
            this.animateNodes();
          },
          5
        );
      }
    };

    getWrappedInstance() {
      invariant(
        config.withRef,
        'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call'
      );
      return this.refs.wrappedInstance;
    }

    render() {
      const ref = config.withRef ? 'wrappedInstance' : null;

      return (
        <WrappedComponent
          ref={ref}
          {...omit(
            this.props,
            'contentWindow',
            'useWindowAsScrollContainer',
            'distance',
            'helperClass',
            'hideSortableGhost',
            'transitionDuration',
            'useDragHandle',
            'pressDelay',
<<<<<<< HEAD
            'pressThreshold',
=======
>>>>>>> Enforce consistent linting
            'shouldCancelStart',
            'onSortStart',
            'onSortMove',
            'onSortEnd',
            'axis',
            'lockAxis',
            'lockOffset',
            'lockToContainerEdges',
<<<<<<< HEAD
            'getContainer',
            'getHelperDimensions'
=======
            'getContainer'
>>>>>>> Enforce consistent linting
          )}
        />
      );
    }
  };
}
