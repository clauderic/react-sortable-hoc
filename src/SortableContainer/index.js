import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import invariant from 'invariant';
import findIndex from 'lodash/findIndex';
import DragLayer from '../DragLayer';
import Manager from '../Manager';
import {
  closest,
  events,
  getOffset,
  vendorPrefix,
  provideDisplayName,
  omit,
} from '../utils';
import {closestRect} from '../DragLayer/utils';

// Export Higher Order Sortable Container Component
export default function sortableContainer(
  WrappedComponent,
  config = {withRef: false},
) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.dragLayer = props.dragLayer || new DragLayer();
      this.dragLayer.addRef(this);
      this.dragLayer.onDragEnd = props.onDragEnd;
      this.manager = new Manager();
      this.events = {
        start: this.handleStart,
        move: this.handleMove,
        end: this.handleEnd,
      };

      invariant(
        !(props.distance && props.pressDelay),
        'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.',
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
      contentWindow: typeof window !== 'undefined' ? window : null,
      shouldCancelStart: function(e) {
        // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
        const disabledElements = [
          'input',
          'textarea',
          'select',
          'option',
          'button',
        ];

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
      dragLayer: PropTypes.object,
      lockAxis: PropTypes.string,
      helperClass: PropTypes.string,
      transitionDuration: PropTypes.number,
      contentWindow: PropTypes.any,
      onSortStart: PropTypes.func,
      onSortMove: PropTypes.func,
      onSortEnd: PropTypes.func,
      onDragEnd: PropTypes.func,
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
          PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
        contentWindow,
        getContainer,
        useWindowAsScrollContainer,
      } = this.props;

      this.container = typeof getContainer === 'function'
        ? getContainer(this.getWrappedInstance())
        : findDOMNode(this);
      this.document = this.container.ownerDocument || document;
      this.scrollContainer = useWindowAsScrollContainer
        ? this.document.body
        : this.container;
      this.initialScroll = {
        top: this.scrollContainer.scrollTop,
        left: this.scrollContainer.scrollLeft,
      };
      this.contentWindow = typeof contentWindow === 'function'
        ? contentWindow()
        : contentWindow;

      for (const key in this.events) {
        if (this.events.hasOwnProperty(key)) {
          events[key].forEach(eventName =>
            this.container.addEventListener(
              eventName,
              this.events[key],
              false,
            ));
        }
      }
    }

    componentWillUnmount() {
      this.dragLayer.removeRef(this);
      for (const key in this.events) {
        if (this.events.hasOwnProperty(key)) {
          events[key].forEach(eventName =>
            this.container.removeEventListener(eventName, this.events[key]));
        }
      }
    }

    componentWillReceiveProps(nextProps) {
      const {active} = this.manager;
      if (!active) return;
      this.checkActiveIndex(nextProps);
    }

    checkActiveIndex = nextProps => {
      const {items} = nextProps || this.props;
      const {item} = this.manager.active;
      const newIndex = findIndex(items, item);
      if (newIndex === -1) {
        this.dragLayer.stopDrag();
        return;
      }
      this.manager.active.index = newIndex;
      this.index = newIndex;
    };

    handleStart = e => {
      const p = getOffset(e);
      const {distance, shouldCancelStart, items} = this.props;

      if (e.button === 2 || shouldCancelStart(e)) {
        return false;
      }

      this._touched = true;
      this._pos = p;

      const node = closest(e.target, el => el.sortableInfo != null);

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

        this.manager.active = {index, collection, item: items[index]};

        /*
				 * Fixes a bug in Firefox where the :active state of anchor tags
				 * prevent subsequent 'mousemove' events from being fired
				 * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
				 */
        if (e.target.tagName.toLowerCase() === 'a') {
          e.preventDefault();
        }

        if (!distance) {
          if (this.props.pressDelay === 0) {
            this.handlePress(e);
          } else {
            this.pressTimer = setTimeout(
              () => this.handlePress(e),
              this.props.pressDelay,
            );
          }
        }
      }
    };

    nodeIsChild = node => {
      return node.sortableInfo.manager === this.manager;
    };

    handleMove = e => {
      const {distance, pressThreshold} = this.props;
      const p = getOffset(e);
      if (!this.state.sorting && this._touched) {
        this._delta = {
          x: this._pos.x - p.x,
          y: this._pos.y - p.y,
        };
        const delta = Math.abs(this._delta.x) + Math.abs(this._delta.y);

        if (
          !distance &&
          (!pressThreshold || pressThreshold && delta >= pressThreshold)
        ) {
          clearTimeout(this.cancelTimer);
          this.cancelTimer = setTimeout(this.cancel, 0);
        } else if (distance && delta >= distance && this.manager.isActive()) {
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
      let activeNode = null;
      if (this.dragLayer.helper) {
        if (this.manager.active) {
          this.checkActiveIndex();
          activeNode = this.manager.getActive();
        }
      } else {
        activeNode = this.dragLayer.startDrag(this.document.body, this, e);
      }

      if (activeNode) {
        const {
          axis,
          helperClass,
          hideSortableGhost,
          onSortStart,
        } = this.props;
        const {node, collection} = activeNode;
        const {index} = node.sortableInfo;

        this.index = index;
        this.newIndex = index;
        this.axis = {
          x: axis.indexOf('x') >= 0,
          y: axis.indexOf('y') >= 0,
        };

        this.initialScroll = {
          top: this.scrollContainer.scrollTop,
          left: this.scrollContainer.scrollLeft,
        };

        this.initialWindowScroll = {
          top: window.scrollY,
          left: window.scrollX,
        };

        if (hideSortableGhost) {
          this.sortableGhost = node;
          node.style.visibility = 'hidden';
          node.style.opacity = 0;
        }

        if (helperClass) {
          this.dragLayer.helper.classList.add(...helperClass.split(' '));
        }

        this.setState({
          sorting: true,
          sortingIndex: index,
        });

        if (onSortStart) onSortStart({node, index, collection}, e);
      }
    };

    handleSortMove = e => {
      const {onSortMove} = this.props;

      // animate nodes if required
      if (this.checkActive(e)) {
        this.animateNodes();
        this.autoscroll();
      }

      if (onSortMove) onSortMove(e);
    };

    handleSortEnd = (e, newList = null) => {
      const {hideSortableGhost, onSortEnd} = this.props;
      if (!this.manager.active) {
        console.warn('there is no active node', e);
        return;
      }
      const {collection} = this.manager.active;

      if (hideSortableGhost && this.sortableGhost) {
        this.sortableGhost.style.visibility = '';
        this.sortableGhost.style.opacity = '';
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
        // get the index in the new list
        if (newList) {
          this.newIndex = newList.getClosestNode(e).index;
        }

        onSortEnd(
          {
            oldIndex: this.index,
            newIndex: this.newIndex,
            newList,
            collection,
          },
          e,
        );
      }

      this._touched = false;
    };

    handleSortSwap = (index, item) => {
      const {onSortSwap} = this.props;
      if (typeof onSortSwap === 'function') {
        onSortSwap({
          index,
          item,
        });
      }
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
        x: e.touches ? e.touches[0].pageX : e.pageX,
        y: e.touches ? e.touches[0].pageY : e.pageY,
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
        lockOffset,
      );

      const [minLockOffset, maxLockOffset] = lockOffset;

      return [
        this.getLockPixelOffset(minLockOffset),
        this.getLockPixelOffset(maxLockOffset),
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
          lockOffset,
        );

        offsetX = offsetY = parseFloat(lockOffset);
        unit = match[1];
      }

      invariant(
        isFinite(offsetX) && isFinite(offsetY),
        'lockOffset value should be a finite. Given %s',
        lockOffset,
      );

      if (unit === '%') {
        offsetX = offsetX * this.dragLayer.width / 100;
        offsetY = offsetY * this.dragLayer.height / 100;
      }

      return {
        x: offsetX,
        y: offsetY,
      };
    }

    getClosestNode = e => {
      const p = getOffset(e);
      // eslint-disable-next-line
      let closestNodes = [];
      // eslint-disable-next-line
      let closestCollections = [];
      //TODO: keys is converting number to string!!! check origin value type as number???
      Object.keys(this.manager.refs).forEach(collection => {
        const nodes = this.manager.refs[collection].map(n => n.node);
        if (nodes && nodes.length > 0) {
          closestNodes.push(nodes[closestRect(p.x, p.y, nodes)]);
          closestCollections.push(collection);
        }
      });
      const index = closestRect(p.x, p.y, closestNodes);
      const collection = closestCollections[index];
      if (collection === undefined) {
        return {
          collection,
          index: 0,
        };
      }
      const finalNodes = this.manager.refs[collection].map(n => n.node);
      const finalIndex = finalNodes.indexOf(closestNodes[index]);
      const node = closestNodes[index];
      //TODO: add better support for grid
      const rect = node.getBoundingClientRect();
      return {
        collection,
        index: finalIndex + (p.y > rect.bottom ? 1 : 0),
      };
    };

    checkActive = e => {
      const active = this.manager.active;
      if (!active) {
        // find closest collection
        const node = closest(e.target, el => el.sortableInfo != null);
        if (node && node.sortableInfo) {
          const p = getOffset(e);
          const {collection} = node.sortableInfo;
          const nodes = this.manager.refs[collection].map(n => n.node);
          // find closest index in collection
          if (nodes) {
            const index = closestRect(p.x, p.y, nodes);
            this.manager.active = {
              index,
              collection,
              item: this.props.items[index],
            };
            this.handlePress(e);
          }
        }
        return false;
      }
      return true;
    };

    animateNodes() {
      if (!this.axis) return;
      const {transitionDuration, hideSortableGhost} = this.props;
      const nodes = this.manager.getOrderedRefs();
      const deltaScroll = {
        left: this.scrollContainer.scrollLeft - this.initialScroll.left,
        top: this.scrollContainer.scrollTop - this.initialScroll.top,
      };

      const sortingOffset = {
        left: this.dragLayer.offsetEdge.left -
          this.dragLayer.distanceBetweenContainers.x +
          this.dragLayer.translate.x +
          deltaScroll.left,
        top: this.dragLayer.offsetEdge.top -
          this.dragLayer.distanceBetweenContainers.y +
          this.dragLayer.translate.y +
          deltaScroll.top,
      };

      const scrollDifference = {
        top: (window.scrollY - this.initialWindowScroll.top),
        left: (window.scrollX - this.initialWindowScroll.left),
      };

      this.newIndex = null;
      for (let i = 0, len = nodes.length; i < len; i++) {
        const {node} = nodes[i];
        const index = node.sortableInfo.index;
        const width = node.offsetWidth;
        const height = node.offsetHeight;
        const offset = {
          width: this.dragLayer.width > width
            ? width / 2
            : this.dragLayer.width / 2,
          height: this.dragLayer.height > height
            ? height / 2
            : this.dragLayer.height / 2,
        };

        const translate = {
          x: 0,
          y: 0,
        };
        let {edgeOffset} = nodes[i];

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
            node.style.opacity = 0;
          }
          continue;
        }

        if (transitionDuration) {
          node.style[
            `${vendorPrefix}TransitionDuration`
          ] = `${transitionDuration}ms`;
        }
        if (this.axis.x) {
          if (this.axis.y) {
            // Calculations for a grid setup

            if (
              index < this.index &&
              (
                ((sortingOffset.left + scrollDifference.left) - offset.width <= edgeOffset.left &&
                (sortingOffset.top + scrollDifference.top) <= edgeOffset.top + offset.height) ||
                (sortingOffset.top + scrollDifference.top) + offset.height <= edgeOffset.top
              )
            ) {
              // If the current node is to the left on the same row, or above the node that's being dragged
              // then move it to the right
              translate.x = this.dragLayer.width +
                this.dragLayer.marginOffset.x;
              if (
                edgeOffset.left + translate.x >
                this.dragLayer.containerBoundingRect.width - offset.width
              ) {
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
              index > this.index &&
              (
                ((sortingOffset.left + scrollDifference.left) + offset.width >= edgeOffset.left &&
                (sortingOffset.top + scrollDifference.top) + offset.height >= edgeOffset.top) ||
                (sortingOffset.top + scrollDifference.top) + offset.height >= edgeOffset.top + height
              )
            ) {
              // If the current node is to the right on the same row, or below the node that's being dragged
              // then move it to the left
              translate.x = -(this.dragLayer.width +
                this.dragLayer.marginOffset.x);
              if (
                edgeOffset.left + translate.x <
                this.dragLayer.containerBoundingRect.left + offset.width
              ) {
                // If it moves passed the left bounds, then animate it to the last position of the previous row.
                // We just use the offset of the previous node to calculate where to move, because that node's original position
                // is exactly where we want to go
                translate.x = prevNode.edgeOffset.left - edgeOffset.left;
                translate.y = prevNode.edgeOffset.top - edgeOffset.top;
              }
              this.newIndex = index;
            }
          } else {
            if (
              index > this.index &&
              (sortingOffset.left + scrollDifference.left) + offset.width >= edgeOffset.left
            ) {
              translate.x = -(this.dragLayer.width +
                this.dragLayer.marginOffset.x);
              this.newIndex = index;
            } else if (
              index < this.index &&
              (sortingOffset.left + scrollDifference.left) <= edgeOffset.left + offset.width
            ) {
              translate.x = this.dragLayer.width +
                this.dragLayer.marginOffset.x;

              if (this.newIndex == null) {
                this.newIndex = index;
              }
            }
          }
        } else if (this.axis.y) {
          if (
            index > this.index &&
            (sortingOffset.top + scrollDifference.top) + offset.height >= edgeOffset.top
          ) {
            translate.y = -(this.dragLayer.height +
              this.dragLayer.marginOffset.y);
            this.newIndex = index;
          } else if (
            index < this.index &&
            (sortingOffset.top + scrollDifference.top) <= edgeOffset.top + offset.height
          ) {
            translate.y = this.dragLayer.height + this.dragLayer.marginOffset.y;
            if (this.newIndex == null) {
              this.newIndex = index;
            }
          }
        }
        node.style[
          `${vendorPrefix}Transform`
        ] = `translate3d(${translate.x}px,${translate.y}px,0)`;
      }

      if (this.newIndex == null) {
        this.newIndex = this.index;
      }
    }

    autoscroll = () => {
      const translate = this.dragLayer.translate;
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

      if (
        translate.y >= this.dragLayer.maxTranslate.y - this.dragLayer.height / 2
      ) {
        direction.y = 1; // Scroll Down
        speed.y = acceleration.y *
          Math.abs(
            (this.dragLayer.maxTranslate.y -
              this.dragLayer.height / 2 -
              translate.y) /
              this.dragLayer.height,
          );
      } else if (
        translate.x >= this.dragLayer.maxTranslate.x - this.dragLayer.width / 2
      ) {
        direction.x = 1; // Scroll Right
        speed.x = acceleration.x *
          Math.abs(
            (this.dragLayer.maxTranslate.x -
              this.dragLayer.width / 2 -
              translate.x) /
              this.dragLayer.width,
          );
      } else if (
        translate.y <= this.dragLayer.minTranslate.y + this.dragLayer.height / 2
      ) {
        direction.y = -1; // Scroll Up
        speed.y = acceleration.y *
          Math.abs(
            (translate.y -
              this.dragLayer.height / 2 -
              this.dragLayer.minTranslate.y) /
              this.dragLayer.height,
          );
      } else if (
        translate.x <= this.dragLayer.minTranslate.x + this.dragLayer.width / 2
      ) {
        direction.x = -1; // Scroll Left
        speed.x = acceleration.x *
          Math.abs(
            (translate.x -
              this.dragLayer.width / 2 -
              this.dragLayer.minTranslate.x) /
              this.dragLayer.width,
          );
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
            // this.dragLayer.translate.x += offset.left;
            // this.dragLayer.translate.y += offset.top;
            this.animateNodes();
          },
          5,
        );
      }
    };

    getWrappedInstance() {
      invariant(
        config.withRef,
        'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call',
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
            'pressThreshold',
            'shouldCancelStart',
            'onSortStart',
            'onSortSwap',
            'onSortMove',
            'onSortEnd',
            'axis',
            'lockAxis',
            'lockOffset',
            'lockToContainerEdges',
            'getContainer',
            'getHelperDimensions',
          )}
        />
      );
    }
  };
}