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
  if (nodes.length > 0) {
    let closestIndex, closestDistance, d, rect, i;

    // above last item in list
    rect = nodes[nodes.length - 1].getBoundingClientRect();
    closestDistance = rect.bottom;

    if (y < closestDistance) {
      closestDistance = 999999999;
      // closest node
      for (i = 0; i < nodes.length; i++) {
        rect = center(nodes[i].getBoundingClientRect());
        d = distance(x, y, rect.x, rect.y);
        if (d < closestDistance) {
          closestDistance = d;
          closestIndex = i;
        }
      }
      return closestIndex;
    }
  }
  // default last node
  return nodes.length;
}

export function center(rect) {
  return {
    x: rect.left + (rect.right - rect.left) * 0.5,
    y: rect.top + (rect.bottom - rect.top) * 0.5,
  };
}

export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
}

export function distanceRect(x, y, rect) {
  const dx = x - clamp(x, rect.left, rect.right);
  const dy = y - clamp(y, rect.top, rect.bottom);
  
  return Math.sqrt(dx * dx + dy * dy);
}

export function overlap(a, b) {
  return a.left <= b.right &&
    b.left <= a.right &&
    a.top <= b.bottom &&
    b.top <= a.bottom;
}

export function translateRect(translateX, translateY, rect) {
  const {width, height} = rect;

  return {
    left: translateX,
    top: translateY,
    right: width + translateX,
    bottom: height + translateY,
    width: width,
    height: height,
  };
}
