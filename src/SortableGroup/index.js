import { debounce, each } from 'lodash';

export default class SortableGroup {
    constructor(onMove, getRefs) {
        this.debounceCheckList = debounce(this.checkList, 250, { 'maxWait': 500 });
        this.dragInfo = {
            pageX: 0,
            pageY: 0,
            delta: 0,
            current: null,
            target: null
        };
        this.onMove = onMove;
        this.getRefs = getRefs;
    }
    
    onSortStart = (item, e, container) => {
        let target = item.node.getBoundingClientRect();
        this.dragInfo.target = target;
        this.dragInfo.current = container;
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
        let containers = this.getRefs();
        let t = this.center(this.dragInfo.target);
        let closest = this.closestContainer(t.x, t.y, containers);
        
        // Moved within current container
        if(this.dragInfo.current == closest && oldIndex != newIndex){
            this.onMove(oldIndex, this.dragInfo.current, newIndex, closest);
            
            this.dragInfo.current = closest;
        }
        // Moved different container
        else if (this.dragInfo.current != closest) {
            
            // Find the closest index in new container
            newIndex = this.closestNodeIndex(t.x, t.y,
                    containers[closest].container.childNodes);
            
            this.onMove(oldIndex, this.dragInfo.current, newIndex, closest);
            this.dragInfo.current = closest;
        }
        
        // Stop the debounce if it hasn't fired yet
        this.debounceCheckList.cancel();
    }
    
    checkList = () => {
        let containers = this.getRefs();
        let {target, current} = this.dragInfo;
        let t = this.center(target);
        let closest = this.closestContainer(t.x, t.y, containers);
        
        // closest container is not the current container
        if(current != closest){
            
            // overlap closest
            let containerB = containers[closest].container.getBoundingClientRect();
            if(this.overlap(target, containerB)){
                let t = this.center(target);
                let newIndex = this.closestNodeIndex(t.x, t.y,
                    containers[closest].container.childNodes);
                
                // stop dragging from the prev container (calls onSortEnd)
                containers[current].handleSortEnd({});
                
                // start dragging from the closest container
                this.startDragging(closest, newIndex, this.dragInfo.delta);
                
                this.dragInfo.current = closest;
            }
        }
    }
    
    startDragging = (listName, index, delta) => {
        let containers = this.getRefs();
        let containerA = containers[listName];
        let newIndex = this.clamp(index, 0, containerA.container.childNodes.length - 1);
        let target = containerA.container.childNodes[newIndex];
        let rect = target.getBoundingClientRect();
        
        // start dragging item
        containerA.handleStart({
          target: target,
          clientX: rect.left - delta.x,
          clientY: rect.top - delta.y,
          preventDefault: function (){}
        });
        
        // force update item position
        containerA.helper.dispatchEvent(this.mouseMove(this.dragInfo.pageX, this.dragInfo.pageY));
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
    
    closestContainer(x, y, containers) {
        let containerB;
        let d = 0;
        let sd = 999999999;
        let newList;
        
        each(containers, (c, key) => {
            containerB = this.center(c.container.getBoundingClientRect());
            d = this.distance(x, y, containerB.x, containerB.y);
            if(d < sd){
                sd = d;
                newList = key;
            }
        });
        return newList;
    }

    closestNodeIndex(x, y, nodes) {
        if(nodes.length > 0){
            let si, sd, d, r, i;
          
            // above last item in list
            r = nodes[nodes.length - 1].getBoundingClientRect();
            sd = r.bottom;
            //console.log('mouse y vs last node y', y, sd, r.top, r.bottom);
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
    
    closer(target, containerA, containerB) {
        target = this.center(target);
        containerA = this.center(containerA);
        containerB = this.center(containerB);
        return this.distance(target.x, target.y, containerA.x, containerA.y) <
            this.distance(target.x, target.y, containerB.x, containerB.y);
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
