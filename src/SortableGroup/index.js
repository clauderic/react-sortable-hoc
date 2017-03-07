import {Component, PropTypes} from 'react';
import debounce from 'lodash/debounce';
import {closestNodeIndex, center, distanceRect, overlap, touch, translateRect} from './utils';
import {closestChild, clamp} from '../utils';

/*
 * Usage:
 *   <SortableGroup
 *    items={{letters: ['A', 'B', 'C'], numbers: [1, 2, 3]}}
 *    handleMove={movedItems => this.setState({
 *      items: moveGroupItems(this.state.items, movedItems)
 *    })}
 *   >
 *    {connectGroupTarget =>
 *      <div>
 *        <SortableList {...connectGroupTarget('letters')} />
 *        <SortableList {...connectGroupTarget('numbers')} />
 *      </div>
 *    }
 *   </SortableGroup>
 */
export default class SortableGroup extends Component {
    static propTypes = {
        children: PropTypes.func,
        items: PropTypes.array,
        onMove: PropTypes.func
    }
    dragInfo = {
        pageX: 0,
        pageY: 0,
        delta: {
          x: 0,
          y: 0
        },
        currentKey: null,
        target: null,
        rect: null
    };

    lists = {};

    registerRef(key, instance) {
      this.lists[key] = instance;
    }

    onSortStart = key => (item, e) => {
        const target = item.node.getBoundingClientRect();
        const loc = touch(e);
        
        this.dragInfo.target = target;
        this.dragInfo.currentKey = key;
        this.dragInfo.delta = {
            x: target.left - loc.clientX,
            y: target.top - loc.clientY
        };
    }

    onSortMove = (e) => {
        const loc = touch(e);
        
        this.dragInfo.pageX = loc.pageX;
        this.dragInfo.pageY = loc.pageY;

        // limit the amount of times checkList() can be called
        this.findTargetContainer();
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        let {currentKey, delta, pageX, pageY, target} = this.dragInfo;
        let targetRect = translateRect(pageX + delta.x, pageY + delta.y, target);
        let t = center(targetRect);
        let closestKey = this.closestContainer(t.x, t.y);

        // Moved within current list
        if (currentKey === closestKey && oldIndex != newIndex){
            this.props.onMove({oldIndex, oldKey: currentKey, newIndex, newKey: closestKey});

            this.dragInfo.currentKey = closestKey;
        }
        // Moved different list
        else if (currentKey !== closestKey) {

            // Find the closest index in new list
            newIndex = closestNodeIndex(t.x, t.y, this.lists[closestKey].container.childNodes);

            this.props.onMove({oldIndex, oldKey: currentKey, newIndex, newKey: closestKey});
            this.dragInfo.currentKey = closestKey;
        }

        // Stop the debounce if it hasn't fired yet
        this.findTargetContainer.cancel();
    }

    findTargetContainer = debounce(() => {
        const {currentKey, delta, pageX, pageY, target} = this.dragInfo;
        let targetRect = translateRect(pageX + delta.x, pageY + delta.y, target);
        let t = center(targetRect);

        const closestKey = this.closestContainer(t.x, t.y);
        const closest = this.lists[closestKey];

        // closest list is not the current list
        if (currentKey !== closestKey){
            // overlap closest
            let list = closest.container.getBoundingClientRect();

            if (overlap(targetRect, list)){
                t = center(targetRect);
                let newIndex = closestNodeIndex(t.x, t.y, closest.container.childNodes);

                // stop dragging from the prev list (calls onSortEnd)
                this.lists[currentKey].handleSortEnd();

                // start dragging from the closest list
                this.startDragging(closest, newIndex, delta, pageX, pageY);

                this.dragInfo.currentKey = closestKey;
            }
        }
    }, 50, {maxWait: 200})

    startDragging = (list, index, delta, pageX, pageY) => {
        let newIndex = clamp(index, 0, list.container.childNodes.length - 1);
        let target = list.container.childNodes[newIndex];
        let rect = target.getBoundingClientRect();
        let handle = closestChild(target, (el) => el.sortableHandle);

        // start dragging item
        list.handleStart({
          target: handle || target,
          clientX: rect.left - delta.x,
          clientY: rect.top - delta.y,
          preventDefault: function (){}
        });

        // force update item position
        list.handleSortMove({
            target: list.helper,
            clientX: pageX,
            clientY: pageY,
            pageX: pageX,
            pageY: pageY,
            preventDefault: function (){}
        });
    }

    closestContainer(x, y) {
        const keys = Object.keys(this.lists);
        const distances = keys.map(key => {
            const list = this.lists[key];
            return distanceRect(x, y, list.container.getBoundingClientRect());
        });

        return keys[distances.indexOf(Math.min(...distances))];
    }

    connectGroupTarget = (key) => {
      const {items} = this.props;

      return {
        ref: (instance) => this.registerRef(key, instance),
        onSortStart: this.onSortStart(key),
				onSortMove: this.onSortMove,
				onSortEnd: this.onSortEnd,
        items: items[key]
      };
    }

    render() {
        const {children} = this.props;

        return children(this.connectGroupTarget);
    }
}
