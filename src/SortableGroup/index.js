import { debounce, each } from 'lodash';
import { closestChild } from '../utils';

export default class SortableGroup {
    constructor(onMove, getRefs) {
        this.debounceCheckList = debounce(this.checkList, 250, { 'maxWait': 500 });
        this.dragInfo = {
            pageX: 0,
            pageY: 0,
            delta: {x:0, y:0},
            current: null,
            target: null
        };
        this.onMove = onMove;
        this.getRefs = getRefs;
    }
    
    onSortStart = (item, e, listName) => {
        let target = item.node.getBoundingClientRect();
        this.dragInfo.target = target;
        this.dragInfo.current = listName;
        this.dragInfo.delta = {
            x: target.left - e.clientX,
            y: target.top - e.clientY
        };
    }
    
    onSortMove = (e) => {
        this.dragInfo.pageX = e.pageX;
        this.dragInfo.pageY = e.pageY;
        this.dragInfo.target = e.target.getBoundingClientRect();
        
        // limit the amount of times checkList() can be called
        this.debounceCheckList();
    }
    
    onSortEnd = ({oldIndex, newIndex}) => {
        let lists = this.getRefs();
        let {target, current} = this.dragInfo;
        let t = this.center(target);
        let closest = this.closestList(t.x, t.y, lists);
        
        // Moved within current list
        if(current == closest && oldIndex != newIndex){
            this.onMove(oldIndex, current, newIndex, closest);
            
            this.dragInfo.current = closest;
        }
        // Moved different list
        else if (current != closest) {
            
            // Find the closest index in new list
            newIndex = this.closestNodeIndex(t.x, t.y,
                    lists[closest].container.childNodes);
            
            this.onMove(oldIndex, current, newIndex, closest);
            this.dragInfo.current = closest;
        }
        
        // Stop the debounce if it hasn't fired yet
        this.debounceCheckList.cancel();
    }
    
    checkList = () => {
        let lists = this.getRefs();
        let {target, current, delta, pageX, pageY} = this.dragInfo;
        let t = this.center(target);
        let closest = this.closestList(t.x, t.y, lists);
        
        // closest list is not the current list
        if(current != closest){
            
            // overlap closest
            let list = lists[closest].container.getBoundingClientRect();
            if(this.overlap(target, list)){
                t = this.center(target);
                let newIndex = this.closestNodeIndex(t.x, t.y,
                    lists[closest].container.childNodes);
                
                // stop dragging from the prev list (calls onSortEnd)
                lists[current].handleSortEnd({});
                
                // start dragging from the closest list
                this.startDragging(closest, newIndex, delta, pageX, pageY);
                
                this.dragInfo.current = closest;
            }
        }
    }
    
    startDragging = (listName, index, delta, pageX, pageY) => {
        let lists = this.getRefs();
        let list = lists[listName];
        let newIndex = this.clamp(index, 0, list.container.childNodes.length - 1);
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
        list.helper.dispatchEvent(this.mouseMove(pageX, pageY));
    }
    
    mouseMove(x, y) {
        return new MouseEvent('mousemove', {
            clientX: x,
            clientY: y,
            bubbles: true,
            cancelable: true,
            view: window
        });
    }
    
    closestList(x, y, lists) {
        let d = 0;
        let sd = 999999999;
        let listName;
        
        each(lists, (c, key) => {
            d = this.distanceRect(x, y, c.container.getBoundingClientRect());
            if(d < sd){
                sd = d;
                listName = key;
            }
        });
        return listName;
    }

    closestNodeIndex(x, y, nodes) {
        if(nodes.length > 0){
            let si, sd, d, r, i;
          
            // above last item in list
            r = nodes[nodes.length - 1].getBoundingClientRect();
            sd = r.bottom;
            
            if(y < sd){
                sd = 999999999;
                // closest node
                for(i= 0; i < nodes.length; i++){
                    r = this.center(nodes[i].getBoundingClientRect());
                    d = this.distance(x, y, r.x, r.y);
                    if(d < sd){
                        sd = d;
                        si = i;
                    }
                }
                return si;
            }
        }
        // default last node
        return nodes.length;
    }
    
    center(rect) {
        return {
            x: rect.left + ((rect.right - rect.left) * 0.5),
            y: rect.top + ((rect.bottom - rect.top) * 0.5)
        };
    }
    
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    distanceRect(x, y, rect) {
        let dx = x - this.clamp(x, rect.left, rect.right);
        let dy = y - this.clamp(y, rect.top, rect.bottom);
        return Math.sqrt((dx * dx) + (dy * dy));
    }
    
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
    }
    
    overlap(a, b) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    }
}
