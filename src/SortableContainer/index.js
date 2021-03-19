import * as React from 'react';
import {findDOMNode} from 'react-dom';
import invariant from 'invariant';

import Manager from '../Manager';
import {isSortableHandle} from '../SortableHandle';

import {
  cloneNode,
  closest,
  events,
  getScrollingParent,
  getContainerGridGap,
  getEdgeOffset,
  getElementMargin,
  getLockPixelOffsets,
  getPosition,
  isTouchEvent,
  limit,
  NodeType,
  omit,
  provideDisplayName,
  setInlineStyles,
  setTransitionDuration,
  setTranslate3d,
  getTargetIndex,
  getScrollAdjustedBoundingClientRect,
} from '../utils';

import AutoScroller from '../AutoScroller';
import {
  defaultProps,
  omittedProps,
  propTypes,
  validateProps,
  defaultKeyCodes,
} from './props';

export const SortableContext = React.createContext({
  manager: {},
});

export default function sortableContainer(
  WrappedComponent,
  config = {withRef: false},
) {
  return class WithSortableContainer extends React.Component {
    constructor(props) {
      super(props);
      const manager = new Manager();

      validateProps(props);

      this.manager = manager;
      this.wrappedInstance = React.createRef();
      this.sortableContextValue = {manager};
      this.events = {
        end: this.handleEnd,
        move: this.handleMove,
        start: this.handleStart,
      };
    }

    state = {};

    static displayName = provideDisplayName('sortableList', WrappedComponent);
    static defaultProps = defaultProps;
    static propTypes = propTypes;

    componentDidMount() {
      const {useWindowAsScrollContainer} = this.props;
      const container = this.getContainer();

      Promise.resolve(container).then((containerNode) => {
        this.container = containerNode;
        this.document = this.container.ownerDocument || document;

        /*
         *  Set our own default rather than using defaultProps because Jest
         *  snapshots will serialize window, causing a RangeError
         *  https://github.com/clauderic/react-sortable-hoc/issues/249
         */
        const contentWindow =
          this.props.contentWindow || this.document.defaultView || window;

        this.contentWindow =
          typeof contentWindow === 'function' ? contentWindow() : contentWindow;

        this.scrollContainer = useWindowAsScrollContainer
          ? this.document.scrollingElement || this.document.documentElement
          : getScrollingParent(this.container) || this.container;

        this.autoScroller = new AutoScroller(
          this.scrollContainer,
          this.onAutoScroll,
        );

        Object.keys(this.events).forEach((key) =>
          events[key].forEach((eventName) =>
            this.container.addEventListener(eventName, this.events[key], false),
          ),
        );

        this.container.addEventListener('keydown', this.handleKeyDown);
      });
    }

    componentWillUnmount() {
      if (this.helper && this.helper.parentNode) {
        this.helper.parentNode.removeChild(this.helper);
      }
      if (!this.container) {
        return;
      }

      Object.keys(this.events).forEach((key) =>
        events[key].forEach((eventName) =>
          this.container.removeEventListener(eventName, this.events[key]),
        ),
      );
      this.container.removeEventListener('keydown', this.handleKeyDown);
    }

    handleStart = (event) => {
      const {distance, shouldCancelStart} = this.props;

      if (event.button === 2 || shouldCancelStart(event)) {
        return;
      }

      this.touched = true;
      this.position = getPosition(event);

      const node = closest(event.target, (el) => el.sortableInfo != null);

      if (
        node &&
        node.sortableInfo &&
        this.nodeIsChild(node) &&
        !this.state.sorting
      ) {
        const {useDragHandle} = this.props;
        const {index, collection, disabled} = node.sortableInfo;

        if (disabled) {
          return;
        }

        if (useDragHandle && !closest(event.target, isSortableHandle)) {
          return;
        }

        this.manager.active = {collection, index};

        /*
         * Fixes a bug in Firefox where the :active state of anchor tags
         * prevent subsequent 'mousemove' events from being fired
         * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
         */
        if (!isTouchEvent(event) && event.target.tagName === NodeType.Anchor) {
          event.preventDefault();
        }

        if (!distance) {
          if (this.props.pressDelay === 0) {
            this.handlePress(event);
          } else {
            this.pressTimer = setTimeout(
              () => this.handlePress(event),
              this.props.pressDelay,
            );
          }
        }
      }
    };

    nodeIsChild = (node) => {
      return node.sortableInfo.manager === this.manager;
    };

    handleMove = (event) => {
      const {distance, pressThreshold} = this.props;

      if (
        !this.state.sorting &&
        this.touched &&
        !this._awaitingUpdateBeforeSortStart
      ) {
        const position = getPosition(event);
        const delta = {
          x: this.position.x - position.x,
          y: this.position.y - position.y,
        };
        const combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);

        this.delta = delta;

        if (!distance && (!pressThreshold || combinedDelta >= pressThreshold)) {
          clearTimeout(this.cancelTimer);
          this.cancelTimer = setTimeout(this.cancel, 0);
        } else if (
          distance &&
          combinedDelta >= distance &&
          this.manager.isActive()
        ) {
          this.handlePress(event);
        }
      }
    };

    handleEnd = () => {
      this.touched = false;
      this.cancel();
    };

    cancel = () => {
      const {distance} = this.props;
      const {sorting} = this.state;

      if (!sorting) {
        if (!distance) {
          clearTimeout(this.pressTimer);
        }
        this.manager.active = null;
      }
    };

    handlePress = async (event) => {
      const active = this.manager.getActive();

      if (active) {
        const {
          axis,
          getHelperDimensions,
          helperClass,
          hideSortableGhost,
          updateBeforeSortStart,
          onSortStart,
          useWindowAsScrollContainer,
        } = this.props;
        const {node, collection} = active;
        const {isKeySorting} = this.manager;

        if (typeof updateBeforeSortStart === 'function') {
          this._awaitingUpdateBeforeSortStart = true;

          try {
            const {index} = node.sortableInfo;
            await updateBeforeSortStart(
              {collection, index, node, isKeySorting},
              event,
            );
          } finally {
            this._awaitingUpdateBeforeSortStart = false;
          }
        }

        // Need to get the latest value for `index` in case it changes during `updateBeforeSortStart`
        const {index} = node.sortableInfo;
        const margin = getElementMargin(node);
        const gridGap = getContainerGridGap(this.container);
        const containerBoundingRect = this.scrollContainer.getBoundingClientRect();
        const dimensions = getHelperDimensions({index, node, collection});

        this.node = node;
        this.margin = margin;
        this.gridGap = gridGap;
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.marginOffset = {
          x: this.margin.left + this.margin.right + this.gridGap.x,
          y: Math.max(this.margin.top, this.margin.bottom, this.gridGap.y),
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

        if (isKeySorting) {
          this.initialOffset = getPosition({
            ...event,
            pageX: this.boundingClientRect.left,
            pageY: this.boundingClientRect.top,
          });
        } else {
          this.initialOffset = getPosition(event);
        }

        this.initialScroll = {
          left: this.scrollContainer.scrollLeft,
          top: this.scrollContainer.scrollTop,
        };

        this.initialWindowScroll = {
          left: window.pageXOffset,
          top: window.pageYOffset,
        };

        this.helper = this.helperContainer.appendChild(cloneNode(node));

        setInlineStyles(this.helper, {
          boxSizing: 'border-box',
          height: `${this.height}px`,
          left: `${this.boundingClientRect.left - margin.left}px`,
          pointerEvents: 'none',
          position: 'fixed',
          top: `${this.boundingClientRect.top - margin.top}px`,
          width: `${this.width}px`,
        });

        if (isKeySorting) {
          this.helper.focus();
        }

        if (hideSortableGhost) {
          this.sortableGhost = node;

          setInlineStyles(node, {
            opacity: 0,
            visibility: 'hidden',
          });
        }

        this.minTranslate = {};
        this.maxTranslate = {};

        if (isKeySorting) {
          const {
            top: containerTop,
            left: containerLeft,
            width: containerWidth,
            height: containerHeight,
          } = useWindowAsScrollContainer
            ? {
                top: 0,
                left: 0,
                width: this.contentWindow.innerWidth,
                height: this.contentWindow.innerHeight,
              }
            : this.containerBoundingRect;
          const containerBottom = containerTop + containerHeight;
          const containerRight = containerLeft + containerWidth;

          if (this.axis.x) {
            this.minTranslate.x = containerLeft - this.boundingClientRect.left;
            this.maxTranslate.x =
              containerRight - (this.boundingClientRect.left + this.width);
          }

          if (this.axis.y) {
            this.minTranslate.y = containerTop - this.boundingClientRect.top;
            this.maxTranslate.y =
              containerBottom - (this.boundingClientRect.top + this.height);
          }
        } else {
          if (this.axis.x) {
            this.minTranslate.x =
              (useWindowAsScrollContainer ? 0 : containerBoundingRect.left) -
              this.boundingClientRect.left -
              this.width / 2;
            this.maxTranslate.x =
              (useWindowAsScrollContainer
                ? this.contentWindow.innerWidth
                : containerBoundingRect.left + containerBoundingRect.width) -
              this.boundingClientRect.left -
              this.width / 2;
          }

          if (this.axis.y) {
            this.minTranslate.y =
              (useWindowAsScrollContainer ? 0 : containerBoundingRect.top) -
              this.boundingClientRect.top -
              this.height / 2;
            this.maxTranslate.y =
              (useWindowAsScrollContainer
                ? this.contentWindow.innerHeight
                : containerBoundingRect.top + containerBoundingRect.height) -
              this.boundingClientRect.top -
              this.height / 2;
          }
        }

        if (helperClass) {
          helperClass
            .split(' ')
            .forEach((className) => this.helper.classList.add(className));
        }

        this.listenerNode = event.touches ? event.target : this.contentWindow;

        if (isKeySorting) {
          this.listenerNode.addEventListener('wheel', this.handleKeyEnd, true);
          this.listenerNode.addEventListener(
            'mousedown',
            this.handleKeyEnd,
            true,
          );
          this.listenerNode.addEventListener('keydown', this.handleKeyDown);
        } else {
          events.move.forEach((eventName) =>
            this.listenerNode.addEventListener(
              eventName,
              this.handleSortMove,
              false,
            ),
          );
          events.end.forEach((eventName) =>
            this.listenerNode.addEventListener(
              eventName,
              this.handleSortEnd,
              false,
            ),
          );
        }

        this.setState({
          sorting: true,
          sortingIndex: index,
        });

        if (onSortStart) {
          onSortStart(
            {
              node,
              index,
              collection,
              isKeySorting,
              nodes: this.manager.getOrderedRefs(),
              helper: this.helper,
            },
            event,
          );
        }

        if (isKeySorting) {
          // Readjust positioning in case re-rendering occurs onSortStart
          this.keyMove(0);
        }
      }
    };

    handleSortMove = (event) => {
      const {onSortMove} = this.props;

      // Prevent scrolling on mobile
      if (typeof event.preventDefault === 'function' && event.cancelable) {
        event.preventDefault();
      }

      this.updateHelperPosition(event);
      this.animateNodes();
      this.autoscroll();

      if (onSortMove) {
        onSortMove(event);
      }
    };

    handleSortEnd = (event) => {
      const {hideSortableGhost, onSortEnd} = this.props;
      const {
        active: {collection},
        isKeySorting,
      } = this.manager;
      const nodes = this.manager.getOrderedRefs();

      // Remove the event listeners if the node is still in the DOM
      if (this.listenerNode) {
        if (isKeySorting) {
          this.listenerNode.removeEventListener(
            'wheel',
            this.handleKeyEnd,
            true,
          );
          this.listenerNode.removeEventListener(
            'mousedown',
            this.handleKeyEnd,
            true,
          );
          this.listenerNode.removeEventListener('keydown', this.handleKeyDown);
        } else {
          events.move.forEach((eventName) =>
            this.listenerNode.removeEventListener(
              eventName,
              this.handleSortMove,
            ),
          );
          events.end.forEach((eventName) =>
            this.listenerNode.removeEventListener(
              eventName,
              this.handleSortEnd,
            ),
          );
        }
      }

      // Remove the helper from the DOM
      this.helper.parentNode.removeChild(this.helper);

      if (hideSortableGhost && this.sortableGhost) {
        setInlineStyles(this.sortableGhost, {
          opacity: '',
          visibility: '',
        });
      }

      for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        const el = node.node;

        // Clear the cached offset/boundingClientRect
        node.edgeOffset = null;
        node.boundingClientRect = null;

        // Remove the transforms / transitions
        setTranslate3d(el, null);
        setTransitionDuration(el, null);
        node.translate = null;
      }

      // Stop autoscroll
      this.autoScroller.clear();

      // Update manager state
      this.manager.active = null;
      this.manager.isKeySorting = false;

      this.setState({
        sorting: false,
        sortingIndex: null,
      });

      if (typeof onSortEnd === 'function') {
        onSortEnd(
          {
            collection,
            newIndex: this.newIndex,
            oldIndex: this.index,
            isKeySorting,
            nodes,
          },
          event,
        );
      }

      this.touched = false;
    };

    updateHelperPosition(event) {
      const {
        lockAxis,
        lockOffset,
        lockToContainerEdges,
        transitionDuration,
        keyboardSortingTransitionDuration = transitionDuration,
      } = this.props;
      const {isKeySorting} = this.manager;
      const {ignoreTransition} = event;

      const offset = getPosition(event);
      const translate = {
        x: offset.x - this.initialOffset.x,
        y: offset.y - this.initialOffset.y,
      };

      // Adjust for window scroll
      translate.y -= window.pageYOffset - this.initialWindowScroll.top;
      translate.x -= window.pageXOffset - this.initialWindowScroll.left;

      this.translate = translate;

      if (lockToContainerEdges) {
        const [minLockOffset, maxLockOffset] = getLockPixelOffsets({
          height: this.height,
          lockOffset,
          width: this.width,
        });
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
          translate.x,
        );
        translate.y = limit(
          this.minTranslate.y + minOffset.y,
          this.maxTranslate.y - maxOffset.y,
          translate.y,
        );
      }

      if (lockAxis === 'x') {
        translate.y = 0;
      } else if (lockAxis === 'y') {
        translate.x = 0;
      }

      if (
        isKeySorting &&
        keyboardSortingTransitionDuration &&
        !ignoreTransition
      ) {
        setTransitionDuration(this.helper, keyboardSortingTransitionDuration);
      }

      setTranslate3d(this.helper, translate);
    }

    animateNodes() {
      const {transitionDuration, hideSortableGhost, onSortOver} = this.props;
      const {containerScrollDelta, windowScrollDelta} = this;
      const nodes = this.manager.getOrderedRefs();
      const sortingOffset = {
        left:
          this.offsetEdge.left + this.translate.x + containerScrollDelta.left,
        top: this.offsetEdge.top + this.translate.y + containerScrollDelta.top,
      };
      const {isKeySorting} = this.manager;

      const prevIndex = this.newIndex;
      this.newIndex = null;

      for (let i = 0, len = nodes.length; i < len; i++) {
        const {node} = nodes[i];
        const {index} = node.sortableInfo;
        const width = node.offsetWidth;
        const height = node.offsetHeight;
        const offset = {
          height: this.height > height ? height / 2 : this.height / 2,
          width: this.width > width ? width / 2 : this.width / 2,
        };

        // For keyboard sorting, we want user input to dictate the position of the nodes
        const mustShiftBackward =
          isKeySorting && (index > this.index && index <= prevIndex);
        const mustShiftForward =
          isKeySorting && (index < this.index && index >= prevIndex);

        const translate = {
          x: 0,
          y: 0,
        };
        let {edgeOffset} = nodes[i];

        // If we haven't cached the node's offsetTop / offsetLeft value
        if (!edgeOffset) {
          edgeOffset = getEdgeOffset(node, this.container);
          nodes[i].edgeOffset = edgeOffset;
          // While we're at it, cache the boundingClientRect, used during keyboard sorting
          if (isKeySorting) {
            nodes[i].boundingClientRect = getScrollAdjustedBoundingClientRect(
              node,
              containerScrollDelta,
            );
          }
        }

        // Get a reference to the next and previous node
        const nextNode = i < nodes.length - 1 && nodes[i + 1];
        const prevNode = i > 0 && nodes[i - 1];

        // Also cache the next node's edge offset if needed.
        // We need this for calculating the animation in a grid setup
        if (nextNode && !nextNode.edgeOffset) {
          nextNode.edgeOffset = getEdgeOffset(nextNode.node, this.container);
          if (isKeySorting) {
            nextNode.boundingClientRect = getScrollAdjustedBoundingClientRect(
              nextNode.node,
              containerScrollDelta,
            );
          }
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

            setInlineStyles(node, {
              opacity: 0,
              visibility: 'hidden',
            });
          }
          continue;
        }

        if (transitionDuration) {
          setTransitionDuration(node, transitionDuration);
        }

        if (this.axis.x) {
          if (this.axis.y) {
            // Calculations for a grid setup
            if (
              mustShiftForward ||
              (index < this.index &&
                ((sortingOffset.left + windowScrollDelta.left - offset.width <=
                  edgeOffset.left &&
                  sortingOffset.top + windowScrollDelta.top <=
                    edgeOffset.top + offset.height) ||
                  sortingOffset.top + windowScrollDelta.top + offset.height <=
                    edgeOffset.top))
            ) {
              // If the current node is to the left on the same row, or above the node that's being dragged
              // then move it to the right
              translate.x = this.width + this.marginOffset.x;
              if (
                edgeOffset.left + translate.x >
                this.containerBoundingRect.width - offset.width * 2
              ) {
                // If it moves passed the right bounds, then animate it to the first position of the next row.
                // We just use the offset of the next node to calculate where to move, because that node's original position
                // is exactly where we want to go
                if (nextNode) {
                  translate.x = nextNode.edgeOffset.left - edgeOffset.left;
                  translate.y = nextNode.edgeOffset.top - edgeOffset.top;
                }
              }
              if (this.newIndex === null) {
                this.newIndex = index;
              }
            } else if (
              mustShiftBackward ||
              (index > this.index &&
                ((sortingOffset.left + windowScrollDelta.left + offset.width >=
                  edgeOffset.left &&
                  sortingOffset.top + windowScrollDelta.top + offset.height >=
                    edgeOffset.top) ||
                  sortingOffset.top + windowScrollDelta.top + offset.height >=
                    edgeOffset.top + height))
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
                if (prevNode) {
                  translate.x = prevNode.edgeOffset.left - edgeOffset.left;
                  translate.y = prevNode.edgeOffset.top - edgeOffset.top;
                }
              }
              this.newIndex = index;
            }
          } else {
            if (
              mustShiftBackward ||
              (index > this.index &&
                sortingOffset.left + windowScrollDelta.left + offset.width >=
                  edgeOffset.left)
            ) {
              translate.x = -(this.width + this.marginOffset.x);
              this.newIndex = index;
            } else if (
              mustShiftForward ||
              (index < this.index &&
                sortingOffset.left + windowScrollDelta.left <=
                  edgeOffset.left + offset.width)
            ) {
              translate.x = this.width + this.marginOffset.x;

              if (this.newIndex == null) {
                this.newIndex = index;
              }
            }
          }
        } else if (this.axis.y) {
          if (
            mustShiftBackward ||
            (index > this.index &&
              sortingOffset.top + windowScrollDelta.top + offset.height >=
                edgeOffset.top)
          ) {
            translate.y = -(this.height + this.marginOffset.y);
            this.newIndex = index;
          } else if (
            mustShiftForward ||
            (index < this.index &&
              sortingOffset.top + windowScrollDelta.top <=
                edgeOffset.top + offset.height)
          ) {
            translate.y = this.height + this.marginOffset.y;
            if (this.newIndex == null) {
              this.newIndex = index;
            }
          }
        }

        setTranslate3d(node, translate);
        nodes[i].translate = translate;
      }

      if (this.newIndex == null) {
        this.newIndex = this.index;
      }

      if (isKeySorting) {
        // If keyboard sorting, we want the user input to dictate index, not location of the helper
        this.newIndex = prevIndex;
      }

      const oldIndex = isKeySorting ? this.prevIndex : prevIndex;
      if (onSortOver && this.newIndex !== oldIndex) {
        onSortOver({
          collection: this.manager.active.collection,
          index: this.index,
          newIndex: this.newIndex,
          oldIndex,
          isKeySorting,
          nodes,
          helper: this.helper,
        });
      }
    }

    autoscroll = () => {
      const {disableAutoscroll} = this.props;
      const {isKeySorting} = this.manager;

      if (disableAutoscroll) {
        this.autoScroller.clear();
        return;
      }

      if (isKeySorting) {
        const translate = {...this.translate};
        let scrollX = 0;
        let scrollY = 0;

        if (this.axis.x) {
          translate.x = Math.min(
            this.maxTranslate.x,
            Math.max(this.minTranslate.x, this.translate.x),
          );
          scrollX = this.translate.x - translate.x;
        }

        if (this.axis.y) {
          translate.y = Math.min(
            this.maxTranslate.y,
            Math.max(this.minTranslate.y, this.translate.y),
          );
          scrollY = this.translate.y - translate.y;
        }

        this.translate = translate;
        setTranslate3d(this.helper, this.translate);
        this.scrollContainer.scrollLeft += scrollX;
        this.scrollContainer.scrollTop += scrollY;

        return;
      }

      this.autoScroller.update({
        height: this.height,
        maxTranslate: this.maxTranslate,
        minTranslate: this.minTranslate,
        translate: this.translate,
        width: this.width,
      });
    };

    onAutoScroll = (offset) => {
      this.translate.x += offset.left;
      this.translate.y += offset.top;

      this.animateNodes();
    };

    getWrappedInstance() {
      invariant(
        config.withRef,
        'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call',
      );

      return this.wrappedInstance.current;
    }

    getContainer() {
      const {getContainer} = this.props;

      if (typeof getContainer !== 'function') {
        return findDOMNode(this);
      }

      return getContainer(
        config.withRef ? this.getWrappedInstance() : undefined,
      );
    }

    handleKeyDown = (event) => {
      const {keyCode} = event;
      const {shouldCancelStart, keyCodes: customKeyCodes = {}} = this.props;

      const keyCodes = {
        ...defaultKeyCodes,
        ...customKeyCodes,
      };

      if (
        (this.manager.active && !this.manager.isKeySorting) ||
        (!this.manager.active &&
          (!keyCodes.lift.includes(keyCode) ||
            shouldCancelStart(event) ||
            !this.isValidSortingTarget(event)))
      ) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (keyCodes.lift.includes(keyCode) && !this.manager.active) {
        this.keyLift(event);
      } else if (keyCodes.drop.includes(keyCode) && this.manager.active) {
        this.keyDrop(event);
      } else if (keyCodes.cancel.includes(keyCode)) {
        this.newIndex = this.manager.active.index;
        this.keyDrop(event);
      } else if (keyCodes.up.includes(keyCode)) {
        this.keyMove(-1);
      } else if (keyCodes.down.includes(keyCode)) {
        this.keyMove(1);
      }
    };

    keyLift = (event) => {
      const {target} = event;
      const node = closest(target, (el) => el.sortableInfo != null);
      const {index, collection} = node.sortableInfo;

      this.initialFocusedNode = target;

      this.manager.isKeySorting = true;
      this.manager.active = {
        index,
        collection,
      };

      this.handlePress(event);
    };

    keyMove = (shift) => {
      const nodes = this.manager.getOrderedRefs();
      const {index: lastIndex} = nodes[nodes.length - 1].node.sortableInfo;
      const newIndex = this.newIndex + shift;
      const prevIndex = this.newIndex;

      if (newIndex < 0 || newIndex > lastIndex) {
        return;
      }

      this.prevIndex = prevIndex;
      this.newIndex = newIndex;

      const targetIndex = getTargetIndex(
        this.newIndex,
        this.prevIndex,
        this.index,
      );
      const target = nodes.find(
        ({node}) => node.sortableInfo.index === targetIndex,
      );
      const {node: targetNode} = target;

      const scrollDelta = this.containerScrollDelta;
      const targetBoundingClientRect =
        target.boundingClientRect ||
        getScrollAdjustedBoundingClientRect(targetNode, scrollDelta);
      const targetTranslate = target.translate || {x: 0, y: 0};

      const targetPosition = {
        top: targetBoundingClientRect.top + targetTranslate.y - scrollDelta.top,
        left:
          targetBoundingClientRect.left + targetTranslate.x - scrollDelta.left,
      };

      const shouldAdjustForSize = prevIndex < newIndex;
      const sizeAdjustment = {
        x:
          shouldAdjustForSize && this.axis.x
            ? targetNode.offsetWidth - this.width
            : 0,
        y:
          shouldAdjustForSize && this.axis.y
            ? targetNode.offsetHeight - this.height
            : 0,
      };

      this.handleSortMove({
        pageX: targetPosition.left + sizeAdjustment.x,
        pageY: targetPosition.top + sizeAdjustment.y,
        ignoreTransition: shift === 0,
      });
    };

    keyDrop = (event) => {
      this.handleSortEnd(event);

      if (this.initialFocusedNode) {
        this.initialFocusedNode.focus();
      }
    };

    handleKeyEnd = (event) => {
      if (this.manager.active) {
        this.keyDrop(event);
      }
    };

    isValidSortingTarget = (event) => {
      const {useDragHandle} = this.props;
      const {target} = event;
      const node = closest(target, (el) => el.sortableInfo != null);

      return (
        node &&
        node.sortableInfo &&
        !node.sortableInfo.disabled &&
        (useDragHandle ? isSortableHandle(target) : target.sortableInfo)
      );
    };

    render() {
      const ref = config.withRef ? this.wrappedInstance : null;

      return (
        <SortableContext.Provider value={this.sortableContextValue}>
          <WrappedComponent ref={ref} {...omit(this.props, omittedProps)} />
        </SortableContext.Provider>
      );
    }

    get helperContainer() {
      const {helperContainer} = this.props;

      if (typeof helperContainer === 'function') {
        return helperContainer();
      }

      return this.props.helperContainer || this.document.body;
    }

    get containerScrollDelta() {
      const {useWindowAsScrollContainer} = this.props;

      if (useWindowAsScrollContainer) {
        return {left: 0, top: 0};
      }

      return {
        left: this.scrollContainer.scrollLeft - this.initialScroll.left,
        top: this.scrollContainer.scrollTop - this.initialScroll.top,
      };
    }

    get windowScrollDelta() {
      return {
        left: this.contentWindow.pageXOffset - this.initialWindowScroll.left,
        top: this.contentWindow.pageYOffset - this.initialWindowScroll.top,
      };
    }
  };
}
