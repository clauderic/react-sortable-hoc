import {
  events,
  vendorPrefix,
  getOffset,
  getElementMargin,
  clamp,
} from '../utils';
import {
  closestRect,
} from './utils';

export default class DragLayer {

  helper = null;
  lists = [];

  addRef(list) {
    this.lists.push(list);
  }

  removeRef(list) {
    let i = this.lists.indexOf(list);
    if(i != -1) {
      this.lists.splice(i, 1);
    }
  }

  startDrag(parent, list, e) {
    const offset = getOffset(e);
    const active = list.manager.getActive();

    if (active) {
      const {
        axis,
        getHelperDimensions,
        helperClass,
        hideSortableGhost,
        useWindowAsScrollContainer,
      } = list.props;
      const {node, collection} = active;
      const {index} = node.sortableInfo;
      const margin = getElementMargin(node);
      const containerBoundingRect = list.container.getBoundingClientRect();
      const dimensions = getHelperDimensions({index, node, collection});

      this.width = dimensions.width;
      this.height = dimensions.height;
      this.marginOffset = {
        x: margin.left + margin.right,
        y: Math.max(margin.top, margin.bottom),
      };
      this.boundingClientRect = node.getBoundingClientRect();
      this.containerBoundingRect = containerBoundingRect;
      this.currentList = list;

      this.axis = {
        x: axis.indexOf('x') >= 0,
        y: axis.indexOf('y') >= 0,
      };
      this.offsetEdge = list.getEdgeOffset(node);
      this.initialOffset = offset;

      const fields = node.querySelectorAll('input, textarea, select');
      const clonedNode = node.cloneNode(true);
      const clonedFields = [
        ...clonedNode.querySelectorAll('input, textarea, select'),
      ]; // Convert NodeList to Array

      clonedFields.forEach((field, index) => {
        return (field.value = fields[index] && fields[index].value);
      });

      this.helper = parent.appendChild(clonedNode);

      this.helper.style.position = 'fixed';
      this.helper.style.top = `${this.boundingClientRect.top - margin.top}px`;
      this.helper.style.left = `${this.boundingClientRect.left - margin.left}px`;
      this.helper.style.width = `${this.width}px`;
      this.helper.style.height = `${this.height}px`;
      this.helper.style.boxSizing = 'border-box';
      this.helper.style.pointerEvents = 'none';

      this.minTranslate = {};
      this.maxTranslate = {};
      if (this.axis.x) {
        this.minTranslate.x = (useWindowAsScrollContainer
          ? 0
          : containerBoundingRect.left) -
          this.boundingClientRect.left -
          this.width / 2;
        this.maxTranslate.x = (useWindowAsScrollContainer
          ? list.contentWindow.innerWidth
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
          ? list.contentWindow.innerHeight
          : containerBoundingRect.top + containerBoundingRect.height) -
          this.boundingClientRect.top -
          this.height / 2;
      }

      this.listenerNode = e.touches ? node : list.contentWindow;
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

      return active;
    }
    return false;
  }

  stopDrag() {
    this.handleSortEnd()
  }

  handleSortMove = (e) => {
    e.preventDefault(); // Prevent scrolling on mobile
    this.updatePosition(e);
    this.updateTargetContainer(e);
    if(this.currentList){
      this.currentList.handleSortMove(e);
    }
  }

  handleSortEnd = (e) => {
    if (this.listenerNode) {
      events.move.forEach(eventName =>
        this.listenerNode.removeEventListener(
          eventName,
          this.handleSortMove
        ));
      events.end.forEach(eventName =>
        this.listenerNode.removeEventListener(eventName, this.handleSortEnd));
    }

    if (typeof this.onDragEnd === 'function') {
      this.onDragEnd()
    }
    // Remove the helper from the DOM
    if (this.helper) {
      this.helper.parentNode.removeChild(this.helper);
      this.helper = null;
      this.currentList.handleSortEnd(e);
    }
  }

  updatePosition(e) {
    const {lockAxis, lockToContainerEdges} = this.currentList.props;
    const offset = getOffset(e);
    const translate = {
      x: offset.x - this.initialOffset.x,
      y: offset.y - this.initialOffset.y,
    };
    this.translate = translate;
    this.delta = offset;

    if (lockToContainerEdges) {
      const [minLockOffset, maxLockOffset] = this.currentList.getLockPixelOffsets();
      const minOffset = {
        x: this.width / 2 - minLockOffset.x,
        y: this.height / 2 - minLockOffset.y,
      };
      const maxOffset = {
        x: this.width / 2 - maxLockOffset.x,
        y: this.height / 2 - maxLockOffset.y,
      };

      translate.x = clamp(
        translate.x,
        this.minTranslate.x + minOffset.x,
        this.maxTranslate.x - maxOffset.x
      );
      translate.y = clamp(
        translate.y,
        this.minTranslate.y + minOffset.y,
        this.maxTranslate.y - maxOffset.y
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

  updateTargetContainer(e) {
    const {pageX, pageY} = this.delta;
    const closest = this.lists[closestRect(pageX, pageY, this.lists.map(l => l.container))];
    if(closest != this.currentList){
      this.currentList.handleSortEnd(e, closest);
      this.currentList = closest;
      this.currentList.manager.active = this.currentList.getClosestNode(e);
      this.currentList.handlePress(e);
      //console.log(this.currentList.active)
    }
  }
}
