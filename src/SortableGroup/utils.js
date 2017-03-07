import {clamp} from '../utils';

// TODO: Implement using slice instead of splice to avoid side-effects
export function moveGroupItems(items, {oldIndex, oldKey, newIndex, newKey}) {
  const oldItems = items[oldKey];
  const newItems = items[newKey];
  const switchItem = oldItems[oldIndex];

  // item found
  if (switchItem) {
    // remove from old list
    oldItems.splice(oldIndex, 1);

    // add to new list
    newItems.splice(newIndex, 0, switchItem);
  }

  return items;
}

export function closestNodeIndex(x, y, nodes) {
    if(nodes.length > 0){
        let si, sd, d, r, i;

        // above last item in list
        r = nodes[nodes.length - 1].getBoundingClientRect();
        sd = r.bottom;

        if(y < sd){
            sd = 999999999;
            // closest node
            for (i= 0; i < nodes.length; i++){
                r = center(nodes[i].getBoundingClientRect());
                d = distance(x, y, r.x, r.y);
                if (d < sd){
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

export function center(rect) {
    return {
        x: rect.left + ((rect.right - rect.left) * 0.5),
        y: rect.top + ((rect.bottom - rect.top) * 0.5)
    };
}

export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
}

export function distanceRect(x, y, rect) {
    let dx = x - clamp(x, rect.left, rect.right);
    let dy = y - clamp(y, rect.top, rect.bottom);
    return Math.sqrt((dx * dx) + (dy * dy));
}

export function overlap(a, b) {
    return (a.left <= b.right &&
        b.left <= a.right &&
        a.top <= b.bottom &&
        b.top <= a.bottom);
}

export function mouseMove(x, y) {
    return new MouseEvent('mousemove', {
        clientX: x,
        clientY: y,
        bubbles: true,
        cancelable: true,
        view: window
    });
}
