import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import invariant from 'invariant';

import Manager from '../Manager';
import {
  closest,
  events,
  vendorPrefix,
  limit,
  getEdgeOffset,
  getElementMargin,
  getLockPixelOffset,
  getPosition,
  provideDisplayName,
  omit,
} from '../utils';

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

      invariant(
        !(props.distance && props.pressDelay),
        'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.'
      );

      this.state = {};
    }

    static displayName = provideDisplayName('sortableList', WrappedComponent);

    static defaultProps = {
      axis: 'y',
      transitionDuration: 300,
      pressDelay: 0,
      pressThreshold: 5,
      distance: 0,
      useWindowAsScrollContainer: false,
      hideSortableGhost: true,
      shouldCancelStart: function(e) {
        // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
        const disabledElements = ['input', 'textarea', 'select', 'option', 'button'];

        if (disabledElements.indexOf(e.target.tagName.toLowerCase()) !== -1) {
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
      onSortOver: PropTypes.func,
      onSortEnd: PropTypes.func,
      shouldCancelStart: PropTypes.func,
      pressDelay: PropTypes.number,
      useDragHandle: PropTypes.bool,
      useWindowAsScrollContainer: PropTypes.bool,
      hideSortableGhost: PropTypes.bool,
      lockToContainerEdges: PropTypes.bool,
      lockOffset: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        ),
      ]),
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
        useWindowAsScrollContainer,
      } = this.props;

      /*
       *  Set our own default rather than using defaultProps because Jest
       *  snapshots will serialize window, causing a RangeError
       *  https://github.com/clauderic/react-sortable-hoc/issues/249
       */

      const container = this.getContainer();

      Promise.resolve(container).then((containerNode) => {
        this.container = containerNode;
        this.document = this.container.ownerDocument || document;

        const contentWindow = this.props.contentWindow || this.document.defaultView || window;

        this.contentWindow = typeof contentWindow === 'function'
          ? contentWindow()
          : contentWindow;
        this.scrollContainer = useWindowAsScrollContainer
          ? this.document.scrollingElement || this.document.documentElement
          : this.container;

        for (const key in this.events) {
          if (this.events.hasOwnProperty(key)) {
            events[key].forEach(eventName =>
              this.container.addEventListener(eventName, this.events[key], false)
            );
          }
        }
      });
    }

    componentWillUnmount() {
      if (this.container) {
        for (const key in this.events) {
          if (this.events.hasOwnProperty(key)) {
            events[key].forEach(eventName =>
              this.container.removeEventListener(eventName, this.events[key])
            );
          }
        }
      }
    }
    componentWillUpdate(nextProps, nextState) {
      if (this.cleanupTimeout) {
        clearTimeout(this.cleanupTimeout);
        this.cleanupTimeout = null;
        this.performCleanup();
      }
    }

    handleStart = event => {
      const {distance, shouldCancelStart} = this.props;

      if (event.button === 2 || shouldCancelStart(event)) {
        return false;
      }

      this._touched = true;
      this._pos = getPosition(event);

      const node = closest(event.target, el => el.sortableInfo != null);

      if (
        node &&
        node.sortableInfo &&
        this.nodeIsChild(node) &&
        !this.state.sorting
      ) {
        const {useDragHandle} = this.props;
        const {index, collection} = node.sortableInfo;

        if (
          useDragHandle && !closest(event.target, el => el.sortableHandle != null)
        )
          return;

        this.manager.active = {index, collection};

        /*
				 * Fixes a bug in Firefox where the :active state of anchor tags
				 * prevent subsequent 'mousemove' events from being fired
				 * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
				 */
        if (event.target.tagName.toLowerCase() === 'a') {
          event.preventDefault();
        }

        if (!distance) {
          if (this.props.pressDelay === 0) {
            this.handlePress(event);
          } else {
            this.pressTimer = setTimeout(
              () => this.handlePress(event),
              this.props.pressDelay
            );
          }
        }
      }
    };

    nodeIsChild = node => {
      return node.sortableInfo.manager === this.manager;
    };

    handleMove = event => {
      const {distance, pressThreshold} = this.props;

      if (!this.state.sorting && this._touched) {
        const position = getPosition(event);
        const delta = this._delta = {
          x: this._pos.x - position.x,
          y: this._pos.y - position.y,
        };
        const combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);

        if (!distance && (!pressThreshold || pressThreshold && combinedDelta >= pressThreshold)) {
          clearTimeout(this.cancelTimer);
          this.cancelTimer = setTimeout(this.cancel, 0);
        } else if (distance && combinedDelta >= distance && this.manager.isActive()) {
          this.handlePress(event);
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

    handlePress = event => {
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
        this.offsetEdge = getEdgeOffset(node, this.container);
        this.initialOffset = getPosition(event);
        this.initialScroll = {
          top: this.container.scrollTop,
          left: this.container.scrollLeft,
        };

        this.initialWindowScroll = {
          top: window.pageYOffset,
          left: window.pageXOffset,
        };

        const fields = node.querySelectorAll('input, textarea, select');
        const clonedNode = node.cloneNode(true);
        const clonedFields = [
          ...clonedNode.querySelectorAll('input, textarea, select'),
        ]; // Convert NodeList to Array

        clonedFields.forEach((field, index) => {
          if (field.type !== 'file' && fields[index]) {
            field.value = fields[index].value;
          }
        });

        this.helper = this.document.body.appendChild(clonedNode);

        this.helper.style.position = 'fixed';
        this.helper.style.top = `${this.boundingClientRect.top - margin.top}px`;
        this.helper.style.left = `${this.boundingClientRect.left - margin.left}px`;
        this.helper.style.width = `${this.width}px`;
        this.helper.style.height = `${this.height}px`;
        this.helper.style.boxSizing = 'border-box';
        this.helper.style.pointerEvents = 'none';

        this.sortableGhost = node;
        if (hideSortableGhost) {
          node.style.visibility = 'hidden';
          node.style.opacity = 0;
        }

        this.minTranslate = {};
        this.maxTranslate = {};
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
        }

        if (helperClass) {
          this.helper.classList.add(...helperClass.split(' '));
        }

        this.listenerNode = event.touches ? node : this.contentWindow;
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

        this.setState({
          sorting: true,
          sortingIndex: index,
        });

        if (onSortStart) {
          onSortStart({node, index, collection}, event);
        }
      }
    };

    handleSortMove = event => {
      const {onSortMove} = this.props;
      event.preventDefault(); // Prevent scrolling on mobile

      this.updatePosition(event);
      this.animateNodes();
      this.autoscroll();

      if (onSortMove) {
        onSortMove(event);
      }
    };

    handleSortEnd = event => {
      const {hideSortableGhost, transitionDuration, onSortEnd} = this.props;
      const {collection} = this.manager.active;

      // Remove the event listeners if the node is still in the DOM
      if (this.listenerNode) {
        events.move.forEach(eventName =>
          this.listenerNode.removeEventListener(
            eventName,
            this.handleSortMove
          ));
        events.end.forEach(eventName =>
          this.listenerNode.removeEventListener(eventName, this.handleSortEnd));
      }

      this.updatePosition(event); // Make sure we have the right position for the helper

      // This function might be pre-empted if the parent calls a re-render quickly.
      this.cleanupTimeout = setTimeout(this.performCleanup, transitionDuration);

      // Remove helper after a transition back to place from the DOM
      setTimeout((helper => {
        if (this.props.hideSortableGhost) {
          this.sortableGhost.style.visibility = '';
          this.sortableGhost.style.opacity = '';
        }
        helper.parentNode.removeChild(helper);
      }).bind(this, this.helper), transitionDuration*2);

      // For now, transition the helper to a position over the ghost.
      if (transitionDuration) {
        if (this.sortableGhost) {
          // remove transition off of the ghost BEFORE repositioning helper
          this.sortableGhost.style[`${vendorPrefix}TransitionDuration`] = '';
        }
        this.helper.style[`${vendorPrefix}TransitionDuration`] = `${transitionDuration}ms`;

        const helperStart = this.helper.getBoundingClientRect();
        const helperDestination = this.sortableGhost.getBoundingClientRect();
        this.helper.style[`${vendorPrefix}Transform`] = `translate3d(${
          helperDestination.left - (helperStart.left - this.translate.x)
        }px,${
          helperDestination.top - (helperStart.top - this.translate.y)
        }px,0)`;
      }

      // Stop autoscroll
      clearInterval(this.autoscrollInterval);
      this.autoscrollInterval = null;

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
          event
        );
      }

      if (this.sortableGhost) {
        // remove transform off of the ghost AFTER onSortEnd is called.
        this.sortableGhost.style[`${vendorPrefix}Transform`] = '';
      }


      this._touched = false;
    };
    performCleanup = () => {
      if (!this.manager.active) return;
      if (this.cleanupTimeout) this.cleanupTimeout = null;

      // Remove styles as part of this cleanup (will be called before rerendering)
      this.manager.refs[this.manager.active.collection].forEach((node) =>{
        node.edgeOffset = null;

        node.node.style.zIndex = '';
        if (node.node === this.sortableGhost) {
          console.log(node.node)
          return; // For the ghost node, we'll do it when we remove the helper
        }
        node.node.style[`${vendorPrefix}Transform`] = '';
        node.node.style[`${vendorPrefix}TransitionDuration`] = '';
      });

      // Update manager state
      this.manager.active = null;
    };

    getLockPixelOffsets() {
      const {width, height} = this;
      const {lockOffset} = this.props;
      const offsets = Array.isArray(lockOffset)
        ? lockOffset
        : [lockOffset, lockOffset];

      invariant(
        offsets.length === 2,
        'lockOffset prop of SortableContainer should be a single ' +
          'value or an array of exactly two values. Given %s',
        lockOffset
      );

      const [minLockOffset, maxLockOffset] = offsets;

      return [
        getLockPixelOffset({lockOffset: minLockOffset, width, height}),
        getLockPixelOffset({lockOffset: maxLockOffset, width, height}),
      ];
    }

    updatePosition(event) {
      const {lockAxis, lockToContainerEdges} = this.props;

      const offset = getPosition(event);
      const translate = {
        x: offset.x - this.initialOffset.x,
        y: offset.y - this.initialOffset.y,
      };

      // Adjust for window scroll
      translate.y -= (window.pageYOffset - this.initialWindowScroll.top);
      translate.x -= (window.pageXOffset - this.initialWindowScroll.left);

      this.translate = translate;

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
      }

      if (lockAxis === 'x') {
        translate.y = 0;
      } else if (lockAxis === 'y') {
        translate.x = 0;
      }

      this.helper.style[
        `${vendorPrefix}Transform`
      ] = `translate3d(${translate.x}px,${translate.y}px, 0)`;
    }

    animateNodes() {
      const {transitionDuration, hideSortableGhost, onSortOver} = this.props;
      const nodes = this.manager.getOrderedRefs();
      const containerScrollDelta = {
        left: this.container.scrollLeft - this.initialScroll.left,
        top: this.container.scrollTop - this.initialScroll.top,
      };
      const sortingOffset = {
        left: this.offsetEdge.left + this.translate.x + containerScrollDelta.left,
        top: this.offsetEdge.top + this.translate.y + containerScrollDelta.top,
      };
      const windowScrollDelta = {
        top: (window.pageYOffset - this.initialWindowScroll.top),
        left: (window.pageXOffset - this.initialWindowScroll.left),
      };

      const ghostOffset = nodes[this.index].edgeOffset ||
                (nodes[this.index].edgeOffset = getEdgeOffset(nodes[this.index].node));

      const ghostTranslate = {
        x: 0,
        y: 0,
      };

      const prevIndex = this.newIndex;

      this.newIndex = null;

      for (let i = 0, len = nodes.length; i < len; i++) {
        const {node} = nodes[i];
        const index = node.sortableInfo.index;
        const width = node.offsetWidth;
        const height = node.offsetHeight;
        const margin = getElementMargin(node);
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
          nodes[i].edgeOffset = (edgeOffset = getEdgeOffset(node, this.container));
        }

        // Get a reference to the next and previous node
        const nextNode = i < nodes.length - 1 && nodes[i + 1];
        const prevNode = i > 0 && nodes[i - 1];

        // Also cache the next node's edge offset if needed.
        // We need this for calculating the animation in a grid setup
        if (nextNode && !nextNode.edgeOffset) {
          nextNode.edgeOffset = getEdgeOffset(nextNode.node, this.container);
        }

        if (transitionDuration) {
          node.style[
            `${vendorPrefix}TransitionDuration`
          ] = `${transitionDuration}ms`;
        }

        node.style.zIndex = '1';
        // If the node is the one we're currently animating, skip it
        if (index === this.index) {
          node.style.zIndex = '0';
          if (hideSortableGhost) {
            /*
             * With windowing libraries such as `react-virtualized`, the sortableGhost
             * node may change while scrolling down and then back up (or vice-versa),
             * so we need to update the reference to the new node just to be safe.
             */
            this.sortableGhost = node;
            node.style.visibility = 'hidden';
            node.style.opacity = 0;
          }
          continue;
        }

        if (this.axis.x) {
          if (this.axis.y) {
            // Calculations for a grid setup
            if (
              index < this.index &&
              (
                ((sortingOffset.left + windowScrollDelta.left) - offset.width <= edgeOffset.left &&
                (sortingOffset.top + windowScrollDelta.top) <= edgeOffset.top + offset.height) ||
                (sortingOffset.top + windowScrollDelta.top) + offset.height <= edgeOffset.top
              )
            ) {
              // If the current node is to the left on the same row, or above the node that's being dragged
              // then move it to the right
              translate.x = this.width + this.marginOffset.x;
              if (
                edgeOffset.left + translate.x >
                this.containerBoundingRect.width - offset.width
              ) {
                // If it moves passed the right bounds, then animate it to the first position of the next row.
                // We just use the offset of the next node to calculate where to move, because that node's original position
                // is exactly where we want to go
                translate.x = nextNode.edgeOffset.left - edgeOffset.left;
                translate.y = nextNode.edgeOffset.top - edgeOffset.top;
              }
              if (this.newIndex === null) {
                this.newIndex = index;
                ghostTranslate.x = edgeOffset.left - ghostOffset.left + this.margin.left - margin.left;
                ghostTranslate.y = edgeOffset.top - ghostOffset.top + this.margin.left - margin.left;
              }
            } else if (
              index > this.index &&
              (
                ((sortingOffset.left + windowScrollDelta.left) + offset.width >= edgeOffset.left &&
                (sortingOffset.top + windowScrollDelta.top) + offset.height >= edgeOffset.top) ||
                (sortingOffset.top + windowScrollDelta.top) + offset.height >= edgeOffset.top + height
              )
            ) {
              // If the current node is to the right on the same row, or below the node that's being dragged
              // then move it to the left
              translate.x = -(this.width + this.marginOffset.x);
              if (
                edgeOffset.left + translate.x <
                this.containerBoundingRect.left + offset.width
              ) {
                // If it moves passed the left bounds, then animate it to the last position of the previous row.
                // We just use the offset of the previous node to calculate where to move, because that node's original position
                // is exactly where we want to go
                translate.x = prevNode.edgeOffset.left - edgeOffset.left;
                translate.y = prevNode.edgeOffset.top - edgeOffset.top;
              }
              this.newIndex = index;
              ghostTranslate.x = edgeOffset.left - ghostOffset.left;
              ghostTranslate.y = edgeOffset.top - ghostOffset.top;
            }
          } else {
            if (
              index > this.index &&
              (sortingOffset.left + windowScrollDelta.left) + offset.width >= edgeOffset.left
            ) {
              translate.x = -(this.width + this.marginOffset.x);
              this.newIndex = index;
              ghostTranslate.x = edgeOffset.left - ghostOffset.left + node.offsetWidth - this.width;
            } else if (
              index < this.index &&
              (sortingOffset.left + windowScrollDelta.left) <= edgeOffset.left + offset.width
            ) {
              translate.x = this.width + this.marginOffset.x;
              if (this.newIndex == null) {
                this.newIndex = index;
                ghostTranslate.x = edgeOffset.left - ghostOffset.left;
              }
            }
          }
        } else if (this.axis.y) {
          if (
            index > this.index &&
            (sortingOffset.top + windowScrollDelta.top) + offset.height >= edgeOffset.top
          ) {
            translate.y = -(this.height + this.marginOffset.y);
            this.newIndex = index;
            ghostTranslate.y = edgeOffset.top - ghostOffset.top + node.offsetHeight - this.height;
          } else if (
            index < this.index &&
            (sortingOffset.top + windowScrollDelta.top) <= edgeOffset.top + offset.height
          ) {
            translate.y = this.height + this.marginOffset.y;
            if (this.newIndex == null) {
              this.newIndex = index;
              ghostTranslate.y = edgeOffset.top - ghostOffset.top;
            }
          }
        }
        node.style[`${vendorPrefix}Transform`] = `translate3d(${translate.x}px,${translate.y}px,0)`;
      }

      if (this.newIndex == null) {
        this.newIndex = this.index;
      }

      if (this.sortableGhost) {
        this.sortableGhost.style[`${vendorPrefix}Transform`] =
                `translate3d(${ghostTranslate.x}px,${ghostTranslate.y}px,0)`;
      }
      if (onSortOver && this.newIndex !== prevIndex) {
        onSortOver({
          newIndex: this.newIndex,
          oldIndex: prevIndex,
          index: this.index,
          collection: this.manager.active.collection,
        });
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

    getContainer() {
      const {getContainer} = this.props;

      if (typeof getContainer !== 'function') {
        return findDOMNode(this);
      }

      return getContainer(config.withRef ? this.getWrappedInstance() : undefined);
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
            'pressThreshold',
            'shouldCancelStart',
            'onSortStart',
            'onSortMove',
            'onSortEnd',
            'axis',
            'lockAxis',
            'lockOffset',
            'lockToContainerEdges',
            'getContainer',
            'getHelperDimensions'
          )}
        />
      );
    }
  };
}
