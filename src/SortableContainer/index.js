import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Manager from '../Manager';
import {closest, events, vendorPrefix, limit, getElementMargin} from '../utils';
import invariant from 'invariant';

// Export Higher Order Sortable Container Component
export default function SortableContainer(WrappedComponent, config = {withRef: false}) {
	return class extends Component {
		constructor(props) {
			super(props);
			this.manager = new Manager();
			this.events = {
				start: this.handleStart,
				move: this.handleMove,
				end: this.handleEnd
			};

			invariant(
				!(props.distance && props.pressDelay),
				'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.'
			);

			this.state = {};
		}

		static displayName = (WrappedComponent.displayName) ? `SortableList(${WrappedComponent.displayName})` : 'SortableList';

		static WrappedComponent = WrappedComponent;

		static defaultProps = {
			axis: 'y',
			transitionDuration: 300,
			pressDelay: 0,
			distance: 0,
			useWindowAsScrollContainer: false,
			hideSortableGhost: true,
			contentWindow: typeof window !== 'undefined' ? window : null,
			shouldCancelStart: function (e) {
				// Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
				if (['input', 'textarea', 'select', 'option'].indexOf(e.target.tagName.toLowerCase()) !== -1) {
					return true; // Return true to cancel sorting
				}
			},
			lockToContainerEdges: false,
			lockOffset: '50%',
			getHelperDimensions: ({node}) => ({
				width: node.offsetWidth,
				height: node.offsetHeight
			})
		};

		static propTypes = {
			axis: PropTypes.oneOf(['x', 'y']),
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
				PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
			]),
			getContainer: PropTypes.func,
			getHelperDimensions: PropTypes.func
		};

		static childContextTypes = {
			manager: PropTypes.object.isRequired
		};

		getChildContext() {
			return {
				manager: this.manager
			};
		}

		componentDidMount() {
			const {contentWindow, getContainer, useWindowAsScrollContainer} = this.props;

			this.container = (typeof getContainer === 'function') ? getContainer(this.getWrappedInstance()) : ReactDOM.findDOMNode(this);
			this.document = this.container.ownerDocument || document;
			this.scrollContainer = (useWindowAsScrollContainer) ? this.document.body : this.container;
			this.contentWindow = (typeof contentWindow === 'function') ? contentWindow() : contentWindow;

			for (let key in this.events) {
				events[key].forEach(eventName => this.container.addEventListener(eventName, this.events[key], false));
			}
		}

		componentWillUnmount() {
			for (let key in this.events) {
				events[key].forEach(eventName => this.container.removeEventListener(eventName, this.events[key]));
			}
		}

		handleStart = (e) => {
			const {distance, shouldCancelStart} = this.props;

			if (e.button === 2 || shouldCancelStart(e)) { return false; }

			this._touched = true;
			this._pos = {
				x: e.clientX,
				y: e.clientY
			};

			const node = closest(e.target, (el) => el.sortableInfo != null);

			if (node && node.sortableInfo && !this.state.sorting) {
				const {useDragHandle} = this.props;
				const {index, collection} = node.sortableInfo;

				if (useDragHandle && !closest(e.target, (el) => el.sortableHandle != null)) return;

				this.manager.active = {index, collection};

				if (!distance) {
					this.pressTimer = setTimeout(() => this.handlePress(e), this.props.pressDelay);
				}
			}
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
					this.cancel();
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
				const {axis, onSortStart, helperClass, hideSortableGhost, useWindowAsScrollContainer, getHelperDimensions} = this.props;
				let {node, collection} = active;
				const {index} = node.sortableInfo;
				const margin = getElementMargin(node);

				const containerBoundingRect = this.container.getBoundingClientRect();
				const dimensions = getHelperDimensions({index, node, collection})

				this.node = node;
				this.width = dimensions.width
				this.height = dimensions.height
				this.margin = margin;
				this.dimension = (axis === 'x') ? this.width : this.height;
				this.marginOffset = {
					x: this.margin.left + this.margin.right,
					y: Math.max(this.margin.top, this.margin.bottom)
				};
				this.boundingClientRect = node.getBoundingClientRect();
				this.index = index;
				this.newIndex = index;

				const edge = this.edge = (axis === 'x') ? 'Left' : 'Top';
				this.offsetEdge = this.getEdgeOffset(edge, node);
				this.initialOffset = this.getOffset(e);
				this.initialScroll = this.scrollContainer[`scroll${edge}`];

				this.helper = this.document.body.appendChild(node.cloneNode(true));
				this.helper.style.position = 'fixed';
				this.helper.style.top = `${this.boundingClientRect.top - margin.top}px`;
				this.helper.style.left = `${this.boundingClientRect.left - margin.left}px`;
				this.helper.style.width = `${this.width}px`;
				this.helper.style.boxSizing = 'border-box';

				if (hideSortableGhost) {
					this.sortableGhost = node;
					node.style.visibility = 'hidden';
				}

				if (axis === 'x') {
					this.minTranslate = ((useWindowAsScrollContainer) ? 0 : containerBoundingRect.left) - this.boundingClientRect.left - this.width/2;
					this.maxTranslate = ((useWindowAsScrollContainer) ? this.contentWindow.innerWidth : containerBoundingRect.left + containerBoundingRect.width) - this.boundingClientRect.left - this.width/2;
				} else {
					this.minTranslate = ((useWindowAsScrollContainer) ? 0 : containerBoundingRect.top) - this.boundingClientRect.top - this.height/2;
					this.maxTranslate = ((useWindowAsScrollContainer) ? this.contentWindow.innerHeight : containerBoundingRect.top + containerBoundingRect.height) - this.boundingClientRect.top - this.height/2;
				}

				if (helperClass) {
					this.helper.classList.add(...(helperClass.split(' ')));
				}

				this.listenerNode = (e.touches) ? node : this.contentWindow;
				events.move.forEach(eventName => this.listenerNode.addEventListener(eventName, this.handleSortMove, false));
				events.end.forEach(eventName => this.listenerNode.addEventListener(eventName, this.handleSortEnd, false));

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

			if (typeof onSortEnd === 'function') {
				onSortEnd({
					oldIndex: this.index,
					newIndex: this.newIndex,
					collection
				}, e);
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

			this._touched = false;
		}

		getEdgeOffset(edge, node, offset = 0) {
			// Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
			if (node) {
				if (node.parentNode !== this.container) {
					return this.getEdgeOffset(edge, node.parentNode, offset + node[`offset${edge}`]);
				} else {
					return node[`offset${edge}`] + offset;
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
			let offset = lockOffset;
			let unit = 'px';

			if (typeof lockOffset === 'string') {
				const match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);

				invariant(
					match !== null,
					'lockOffset value should be a number or a string of a ' +
					'number followed by "px" or "%". Given %s',
					lockOffset
				);

				offset = parseFloat(lockOffset);
				unit = match[1];
			}

			invariant(
				isFinite(offset),
				'lockOffset value should be a finite. Given %s',
				lockOffset
			);

			if (unit === '%') {
				offset = offset * this.dimension / 100;
			}

			return offset;
		}

		updatePosition(e) {
			const {axis, lockAxis, lockToContainerEdges} = this.props;
			const offset = this.getOffset(e);
			let translate = {
				x: offset.x - this.initialOffset.x,
				y: offset.y - this.initialOffset.y
			};

			this.translate = translate[axis];

			if (lockToContainerEdges) {
				const [minLockOffset, maxLockOffset] = this.getLockPixelOffsets();
				const minOffset = this.dimension / 2 - minLockOffset;
				const maxOffset = this.dimension / 2 - maxLockOffset;

				translate[axis] = limit(
					this.minTranslate + minOffset,
					this.maxTranslate - maxOffset,
					translate[axis]
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
			const {axis, transitionDuration, hideSortableGhost} = this.props;
			let nodes = this.manager.getOrderedRefs();
			const deltaScroll = this.scrollContainer[`scroll${this.edge}`] - this.initialScroll;
			const sortingOffset = this.offsetEdge + this.translate + deltaScroll;
			this.newIndex = null;

			for (let i = 0, len = nodes.length; i < len; i++) {
				let {node, edgeOffset} = nodes[i];
				const index = node.sortableInfo.index;
				const dimension = (axis === 'x') ? node.offsetWidth : node.offsetHeight;
				const offset = (this.dimension > dimension) ? dimension / 2 : this.dimension / 2;
				let translate = 0;
				let translateX = 0;
				let translateY = 0;

				// If we haven't cached the node's offsetTop / offsetLeft value
				if (edgeOffset == null) {
					nodes[i].edgeOffset = edgeOffset = this.getEdgeOffset(this.edge, node);
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
					node.style[`${vendorPrefix}TransitionDuration`] = `${transitionDuration}ms`;
				}

				if (index > this.index && (sortingOffset + offset >= edgeOffset)) {
					translate = -(this.dimension + this.marginOffset[axis]);
					this.newIndex = index;
				}
				else if (index < this.index && (sortingOffset <= edgeOffset + offset)) {
					translate = this.dimension + this.marginOffset[axis];

					if (this.newIndex == null) {
						this.newIndex = index;
					}
				}

				if (axis === 'x') {
					translateX = translate;
				} else {
					translateY = translate;
				}

				node.style[`${vendorPrefix}Transform`] = `translate3d(${translateX}px,${translateY}px,0)`;
			}

			if (this.newIndex == null) {
				this.newIndex = this.index;
			}
		}

		autoscroll = () => {
			const translate = this.translate;
			let direction = 0;
			let speed = 1;
			const acceleration = 10;

			if (translate >= this.maxTranslate - this.dimension/2) {
				direction = 1; // Scroll Down
				speed = acceleration * Math.abs((this.maxTranslate - this.dimension/2 - translate) / this.dimension);
			} else if (translate <= this.minTranslate + this.dimension/2) {
				direction = -1; // Scroll Up
				speed = acceleration * Math.abs((translate - this.dimension/2 - this.minTranslate) / this.dimension);
			}

			if (this.autoscrollInterval) {
				clearInterval(this.autoscrollInterval);
				this.autoscrollInterval = null;
				this.isAutoScrolling = false;
			}

			if (direction !== 0) {
				this.autoscrollInterval = setInterval(() => {
					this.isAutoScrolling = true;
					const offset = 1 * speed * direction;
					this.scrollContainer[`scroll${this.edge}`] += offset;
					this.translate += offset;
					this.animateNodes();
				}, 5);
			}
		};

		getWrappedInstance() {
			invariant(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call');
			return this.refs.wrappedInstance;
		}

		render() {
			const ref = (config.withRef) ? 'wrappedInstance' : null;

			return <WrappedComponent ref={ref} {...this.props} {...this.state} />;
		}
	};
}
