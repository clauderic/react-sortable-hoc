// import React, { Component } from 'react';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import * as invariant from 'invariant';

import Manager, {Collection, SortableNode} from './Manager';
import {
  closest,
  events,
  vendorPrefix,
  limit,
  getElementMargin,
  provideDisplayName,
  omit,
  nodeIsSortable,
  nodeIsSortableHandle,
} from './utils';

type Axis = 'x' | 'y' | 'z';

// TODO
export interface SortStartHandler {
  (
    args: {node: SortableNode; index?: number; collection?: Collection},
    e: MouseEvent | TouchEvent
  ): void;
}
export interface SortMoveHandler {
  (e: MouseEvent | TouchEvent): void;
}

export interface SortEndHandler {
  (
    args: {oldIndex: number; newIndex: number; collection?: Collection},
    e: MouseEvent | TouchEvent
  ): void;
}

export interface SortableContainerProps {
  axis?: Axis;
  distance?: number;
  lockAxis?: Axis;
  helperClass?: string;
  transitionDuration?: number;
  contentWindow?: Window;
  onSortStart?: SortStartHandler;
  onSortMove?: SortMoveHandler;
  onSortEnd?: SortEndHandler;
  shouldCancelStart?: any; // TODO
  pressDelay?: number;
  pressThreshold?: number;
  useDragHandle?: boolean;
  useWindowAsScrollContainer?: boolean;
  hideSortableGhost?: boolean;
  lockToContainerEdges?: boolean;
  lockOffset?: number | string | number[] | string[]; // TODO
  getContainer?: any; // TODO
  getHelperDimensions?: any; //TODO
  ref?: string | undefined;
}

interface SortableContainerState {
  sorting: boolean;
  sortingIndex: number | undefined;
}

/**
 * Grabs the x and y position using `pageX` and `pageY` for both mouse and touch events.
 */
function getPosition(e: MouseEvent | TouchEvent) {
  if (e instanceof MouseEvent) {
    return {x: e.pageX, y: e.pageY};
  }
  return {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY};
}

type HTMLEditableElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

type WrappedComponent<T> =
  | React.ComponentClass<T>
  | React.StatelessComponent<T>;

// Export Higher Order Sortable Container Component
export default function sortableContainer<T>(
  WrappedComponent: WrappedComponent<T>,
  config = {withRef: false}
) {
  type Props = T & SortableContainerProps;

  return class extends React.Component<Props, SortableContainerState> {
    manager: Manager;

    events: {
      start: (e: MouseEvent | TouchEvent) => void;
      move: (e: MouseEvent | TouchEvent) => void;
      end: (e: MouseEvent | TouchEvent) => void;
    };

    container: HTMLElement;

    document: Document;

    scrollContainer: HTMLElement;

    contentWindow: Window;
    pressTimer: number;
    cancelTimer: number;

    node: SortableNode;

    margin: {top: number; right: number; bottom: number; left: number};
    width: number;
    height: number;
    marginOffset: {x: number; y: number};

    boundingClientRect: ClientRect;
    containerBoundingRect: ClientRect;

    index: number | undefined;
    newIndex: number | undefined;

    axis: {x: boolean; y: boolean};
    offsetEdge: {top: number; left: number};
    initialOffset: {x: number; y: number};
    initialScroll: {top: number; left: number};
    initialWindowScroll: {top: number; left: number};

    helper: HTMLEditableElement;

    sortableGhost: SortableNode;

    minTranslate: {x?: number; y?: number};
    maxTranslate: {x?: number; y?: number};

    listenerNode: HTMLElement;

    autoscrollInterval: number | undefined;

    isAutoScrolling: boolean;

    translate: {x: number; y: number};

    protected _touched: boolean;
    protected _pos: {x: number; y: number};
    protected _delta: {x: number; y: number};

    constructor(props: Props) {
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

      this.state = {
        sorting: false,
        sortingIndex: undefined,
      };
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
      contentWindow: typeof window !== 'undefined' ? window : undefined,
      shouldCancelStart: function(e: React.UIEvent<any>) {
        // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
        const disabledElements = [
          'input',
          'textarea',
          'select',
          'option',
          'button',
        ];

        if (
          disabledElements.indexOf(e.currentTarget.tagName.toLowerCase()) !== -1
        ) {
          // Return true to cancel sorting
          return true;
        }
      },
      lockToContainerEdges: false,
      lockOffset: '50%',
      getHelperDimensions: ({node}: {node: SortableNode}) => ({
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
        contentWindow,
        getContainer,
        useWindowAsScrollContainer,
      } = this.props;

      this.container =
        typeof getContainer === 'function'
          ? getContainer(this.getWrappedInstance())
          : findDOMNode(this);
      this.document = this.container.ownerDocument || document;
      this.scrollContainer = useWindowAsScrollContainer
        ? this.document.body
        : this.container;

      this.contentWindow = typeof contentWindow === 'function'
        ? contentWindow()
        : contentWindow;

      for (const key in this.events) {
        if (this.events.hasOwnProperty(key)) {
          // explictly check for `start`, `move`, or `end` for
          // typescript's typeguards
          if (key === 'start' || key === 'move' || key === 'end') {
            events[key].forEach(eventName =>
              this.container.addEventListener(
                eventName,
                this.events[key],
                false
              )
            );
          }
        }
      }
    }

    componentWillUnmount() {
      for (const key in this.events) {
        if (this.events.hasOwnProperty(key)) {
          // explictly check for `start`, `move`, or `end` for
          // typescript's typeguards
          if (key === 'start' || key === 'move' || key === 'end') {
            events[key].forEach(eventName =>
              this.container.removeEventListener(eventName, this.events[key])
            );
          }
        }
      }
    }

    handleStart = (e: MouseEvent | TouchEvent) => {
      const {distance, shouldCancelStart} = this.props;

      const target = e.target as HTMLElement;

      if ((e instanceof MouseEvent && e.button === 2) || shouldCancelStart(e)) {
        return false;
      }

      this._touched = true;
      this._pos = getPosition(e);

      const node = closest(target, el => nodeIsSortable(el));

      if (
        node &&
        nodeIsSortable(node) &&
        this.nodeIsChild(node) &&
        !this.state.sorting
      ) {
        const {useDragHandle} = this.props;
        const {index, collection} = node.sortableInfo;

        if (useDragHandle && !closest(target, el => nodeIsSortableHandle(el))) {
          return;
        }

        if (index === undefined || collection === undefined) {
          return;
        }

        this.manager.active = {index, collection};

        /*
				 * Fixes a bug in Firefox where the :active state of anchor tags
				 * prevent subsequent 'mousemove' events from being fired
				 * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
				 */
        if (target.tagName.toLowerCase() === 'a') {
          e.preventDefault();
        }

        if (!distance) {
          if (this.props.pressDelay === 0) {
            this.handlePress(e);
          } else {
            this.pressTimer = setTimeout(
              () => this.handlePress(e),
              this.props.pressDelay
            );
          }
        }
      }
    };

    nodeIsChild = (node: SortableNode) => {
      return node.sortableInfo.manager === this.manager;
    };

    handleMove = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;

      const {distance, pressThreshold} = this.props;

      if (!this.state.sorting && this._touched) {
        const position = getPosition(e);

        this._delta = {
          x: this._pos.x - position.x,
          y: this._pos.y - position.y,
        };
        const delta = Math.abs(this._delta.x) + Math.abs(this._delta.y);

        if (
          !distance &&
          (!pressThreshold || (pressThreshold && delta >= pressThreshold))
        ) {
          clearTimeout(this.cancelTimer);
          this.cancelTimer = window.setTimeout(this.cancel, 0);
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
        this.manager.active = undefined;
      }
    };

    handlePress = (event: MouseEvent | TouchEvent) => {
      const active = this.manager.getActive();

      if (active) {
        const {
          axis = 'y',
          getHelperDimensions,
          helperClass,
          hideSortableGhost,
          onSortStart,
          useWindowAsScrollContainer,
        } = this.props;

        if (this.manager.active === undefined) {
          return; // should never happen; for typescript to ensure `this.manager.active` is defined
        }
        const {node, collection} = active; // interface doesn't agree here
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

        const edgeOffset = this.getEdgeOffset(node);

        if (!edgeOffset) {
          // removes the "or undefined" type from `edgeOffset`
          return;
        }

        this.offsetEdge = edgeOffset;
        this.initialOffset = getPosition(e);
        this.initialScroll = {
          top: this.scrollContainer.scrollTop,
          left: this.scrollContainer.scrollLeft,
        };

        this.initialWindowScroll = {
          top: window.scrollY,
          left: window.scrollX,
        };

        const fields = node.querySelectorAll(
          'input, textarea, select'
        ) as NodeListOf<HTMLEditableElement>;
        const clonedNode = node.cloneNode(true) as HTMLEditableElement;
        const clonedFields = [
          ...Array.from(clonedNode.querySelectorAll('input, textarea, select')),
        ] as HTMLEditableElement[]; // Convert NodeList to Array

        clonedFields.forEach((field, index) => {
          if (field.type !== 'file' && fields[index]) {
            field.value = fields[index].value;
          }
        });

        this.helper = this.document.body.appendChild(clonedNode);

        this.helper.style.position = 'fixed';
        this.helper.style.top = `${this.boundingClientRect.top - margin.top}px`;
        this.helper.style.left = `${this.boundingClientRect.left -
          margin.left}px`;
        this.helper.style.width = `${this.width}px`;
        this.helper.style.height = `${this.height}px`;
        this.helper.style.boxSizing = 'border-box';
        this.helper.style.pointerEvents = 'none';

        if (hideSortableGhost) {
          this.sortableGhost = node;
          node.style.visibility = 'hidden';
          node.style.opacity = '0';
        }

        this.minTranslate = {};
        this.maxTranslate = {};
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

        if (helperClass) {
          this.helper.classList.add(...helperClass.split(' '));
        }

        this.listenerNode =
          event instanceof TouchEvent
            ? node
            : this.contentWindow.document.documentElement;

        events.move.forEach(eventName =>
          this.listenerNode.addEventListener(
            eventName,
            this.handleSortMove,
            false
          )
        );

        events.end.forEach(eventName =>
          this.listenerNode.addEventListener(
            eventName,
            this.handleSortEnd,
            false
          )
        );

        this.setState({
          sorting: true,
          sortingIndex: index,
        });

        if (onSortStart) onSortStart({node, index, collection}, e);
      }
    };

    handleSortMove = (event: MouseEvent | TouchEvent) => {
      const {onSortMove} = this.props;

       // Prevent scrolling on mobile
      e.preventDefault();

      this.updatePosition(event);
      this.animatventNodes();
      this.autoscroll();

      if (onSortMove) onSortMove(event);
    };

    handleSortEnd = (event: MouseEvent | TouchEvent) => {
      const {hideSortableGhost, onSortEnd} = this.props;
      if (!this.manager.active) {
        return;
      }
      const {collection} = this.manager.active;

      // Remove the event listeners if the node is still in the DOM
      if (this.listenerNode) {
        events.move.forEach(eventName =>
          this.listenerNode.removeEventListener(eventName, this.handleSortMove)
        );
        events.end.forEach(eventName =>
          this.listenerNode.removeEventListener(eventName, this.handleSortEnd)
        );
      }

      // Remove the helper from the DOM
      this.helper.parentElement &&
        this.helper.parentElement.removeChild(this.helper);

      if (hideSortableGhost && this.sortableGhost) {
        this.sortableGhost.style.visibility = '';
        this.sortableGhost.style.opacity = '';
      }

      const nodes = this.manager.refs[collection];
      for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        const el = node.node;

        // Clear the cached offsetTop / offsetLeft value
        node.edgeOffset = undefined;

        // Remove the transforms / transitions
        el.style[`${vendorPrefix}Transform` as 'transform'] = '';
        el.style[`${vendorPrefix}TransitionDuration` as 'transform'] = '';
      }

      // Stop autoscroll
      if (this.autoscrollInterval) {
        clearInterval(this.autoscrollInterval);
      }
      this.autoscrollInterval = undefined;

      // Update state
      this.manager.active = undefined;

      this.setState({
        sorting: false,
        sortingIndex: undefined,
      });

      if (
        typeof onSortEnd === 'function' &&
        this.newIndex !== undefined &&
        this.index !== undefined
      ) {
        onSortEnd(
          {
            oldIndex: this.index,
            newIndex: this.newIndex,
            collection,
          },
          event
        );
      }

      this._touched = false;
    };

    getEdgeOffset(
      node: HTMLElement | undefined | null,
      offset = {top: 0, left: 0}
    ): {top: number; left: number} | undefined {
      // Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
      if (node) {
        const nodeOffset = {
          top: offset.top + node.offsetTop,
          left: offset.left + node.offsetLeft,
        };
        if (node.parentNode !== this.container) {
          return this.getEdgeOffset(node.parentElement, nodeOffset);
        } else {
          return nodeOffset;
        }
      }
    }

    getLockPixelOffsets() {
      const {lockOffset} = this.props;
      let offset: any = lockOffset;

      if (!Array.isArray(lockOffset)) {
        offset = [lockOffset, lockOffset];
      }

      invariant(
        offset.length === 2,
        'lockOffset prop of SortableContainer should be a single ' +
          'value or an array of exactly two values. Given %s',
        lockOffset
      );

      const [minLockOffset, maxLockOffset] = offset;

      return [
        this.getLockPixelOffset(minLockOffset),
        this.getLockPixelOffset(maxLockOffset),
      ];
    }

    getLockPixelOffset(lockOffset: string | number) {
      let offsetX = parseFloat(lockOffset + '');
      let offsetY = parseFloat(lockOffset + '');
      let unit = 'px';

      if (typeof lockOffset === 'string') {
        const match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);

        invariant(
          match !== undefined,
          'lockOffset value should be a number or a string of a ' +
            'number followed by "px" or "%". Given %s',
          lockOffset
        );

        if (!match) {
          // for the typescript complier
          throw '';
        }

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
        y: offsetY,
      };
    }

    updatePosition(e: MouseEvent | TouchEvent) {
      const {lockAxis, lockToContainerEdges} = this.props;

      const offset = getPosition(e);
      const translate = {
        x: offset.x - this.initialOffset.x,
        y: offset.y - this.initialOffset.y,
      };

      // Adjust for window scroll
      translate.y -= window.scrollY - this.initialWindowScroll.top;
      translate.x -= window.scrollX - this.initialWindowScroll.left;

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

        // sanity check
        if (
          this.minTranslate.x === undefined ||
          this.minTranslate.y === undefined ||
          this.maxTranslate.x === undefined ||
          this.maxTranslate.y === undefined
        ) {
          return;
        }

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
        `${vendorPrefix}Transform` as 'transform'
      ] = `translate3d(${translate.x}px,${translate.y}px, 0)`;
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
      const scrollDifference = {
        top: window.scrollY - this.initialWindowScroll.top,
        left: window.scrollX - this.initialWindowScroll.left,
      };
      this.newIndex = undefined;

      if (!nodes) {
        return;
      }

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
          nodes[i].edgeOffset = edgeOffset = this.getEdgeOffset(node);
        }
        nodes[i].edgeOffset = edgeOffset;

        if (!edgeOffset) {
          // TODO: Find a way to remove this check required by typescript
          return;
        }

        // Get a reference to the next and previous node
        const nextNode = i < nodes.length - 1 && nodes[i + 1];
        const prevNode = i > 0 && nodes[i - 1];

        // Also cache the next node's edge offset if needed.
        // We need this for calculating the animation in a grid setup
        if (nextNode && !nextNode.edgeOffset) {
          nextNode.edgeOffset = this.getEdgeOffset(nextNode.node);
        }

        if (typeof index === 'undefined' || typeof this.index === 'undefined') {
          return;
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
            node.style.opacity = '0';
          }
          continue;
        }

        if (transitionDuration) {
          node.style[
            `${vendorPrefix}TransitionDuration` as 'transitionDuration'
          ] = `${transitionDuration}ms`;
        }

        if (this.axis.x) {
          if (this.axis.y) {
            // Calculations for a grid setup
            if (
              index < this.index &&
              ((sortingOffset.left + scrollDifference.left - offset.width <=
                edgeOffset.left &&
                sortingOffset.top + scrollDifference.top <=
                  edgeOffset.top + offset.height) ||
                sortingOffset.top + scrollDifference.top + offset.height <=
                  edgeOffset.top)
            ) {
              // If the current node is to the left on the same row, or above the node that's being dragged
              // then move it to the right
              translate.x = this.width + this.marginOffset.x;
              if (
                nextNode &&
                nextNode.edgeOffset &&
                edgeOffset.left + translate.x >
                  this.containerBoundingRect.width - offset.width
              ) {
                // If it moves passed the right bounds, then animate it to the first position of the next row.
                // We just use the offset of the next node to calculate where to move, because that node's original position
                // is exactly where we want to go
                translate.x = nextNode.edgeOffset.left - edgeOffset.left;
                translate.y = nextNode.edgeOffset.top - edgeOffset.top;
              }
              if (this.newIndex === undefined) {
                this.newIndex = index;
              }
            } else if (
              index > this.index &&
              ((sortingOffset.left + scrollDifference.left + offset.width >=
                edgeOffset.left &&
                sortingOffset.top + scrollDifference.top + offset.height >=
                  edgeOffset.top) ||
                sortingOffset.top + scrollDifference.top + offset.height >=
                  edgeOffset.top + height)
            ) {
              // If the current node is to the right on the same row, or below the node that's being dragged
              // then move it to the left
              translate.x = -(this.width + this.marginOffset.x);
              if (
                prevNode &&
                prevNode.edgeOffset &&
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
            }
          } else {
            if (
              index > this.index &&
              sortingOffset.left + scrollDifference.left + offset.width >=
                edgeOffset.left
            ) {
              translate.x = -(this.width + this.marginOffset.x);
              this.newIndex = index;
            } else if (
              index < this.index &&
              sortingOffset.left + scrollDifference.left <=
                edgeOffset.left + offset.width
            ) {
              translate.x = this.width + this.marginOffset.x;
              if (this.newIndex == undefined) {
                this.newIndex = index;
              }
            }
          }
        } else if (this.axis.y) {
          if (
            index > this.index &&
            sortingOffset.top + scrollDifference.top + offset.height >=
              edgeOffset.top
          ) {
            translate.y = -(this.height + this.marginOffset.y);
            this.newIndex = index;
          } else if (
            index < this.index &&
            sortingOffset.top + scrollDifference.top <=
              edgeOffset.top + offset.height
          ) {
            translate.y = this.height + this.marginOffset.y;
            if (this.newIndex == undefined) {
              this.newIndex = index;
            }
          }
        }
        node.style[
          `${vendorPrefix}Transform` as 'transform'
        ] = `translate3d(${translate.x}px,${translate.y}px,0)`;
      }

      if (this.newIndex == undefined) {
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

      // sanity check

      if (
        this.maxTranslate.y != null &&
        translate.y >= this.maxTranslate.y - this.height / 2
      ) {
        direction.y = 1; // Scroll Down
        speed.y =
          acceleration.y *
          Math.abs(
            (this.maxTranslate.y - this.height / 2 - translate.y) / this.height
          );
      } else if (
        this.maxTranslate.x != null &&
        translate.x >= this.maxTranslate.x - this.width / 2
      ) {
        direction.x = 1; // Scroll Right
        speed.x =
          acceleration.x *
          Math.abs(
            (this.maxTranslate.x - this.width / 2 - translate.x) / this.width
          );
      } else if (
        this.minTranslate.y != null &&
        translate.y <= this.minTranslate.y + this.height / 2
      ) {
        direction.y = -1; // Scroll Up
        speed.y =
          acceleration.y *
          Math.abs(
            (translate.y - this.height / 2 - this.minTranslate.y) / this.height
          );
      } else if (
        this.minTranslate.x != null &&
        translate.x <= this.minTranslate.x + this.width / 2
      ) {
        direction.x = -1; // Scroll Left
        speed.x =
          acceleration.x *
          Math.abs(
            (translate.x - this.width / 2 - this.minTranslate.x) / this.width
          );
      }

      if (this.autoscrollInterval) {
        clearInterval(this.autoscrollInterval);
        this.autoscrollInterval = undefined;
        this.isAutoScrolling = false;
      }

      if (direction.x !== 0 || direction.y !== 0) {
        this.autoscrollInterval = setInterval(() => {
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
        }, 5);
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
      const ref = config.withRef ? 'wrappedInstance' : undefined;
      const props: any = omit(
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
      );

      return <WrappedComponent ref={ref} {...props} />;
    }
  };
}
