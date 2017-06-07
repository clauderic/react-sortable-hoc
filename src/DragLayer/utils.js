import {
  clamp,
} from '../utils';

export function distanceRect(x, y, rect) {
  const dx = x - clamp(x, rect.left, rect.right);
  const dy = y - clamp(y, rect.top, rect.bottom);
  
  return Math.sqrt(dx * dx + dy * dy);
}

export function closestRect(x, y, containers) {
  const distances = containers.map(
    c => distanceRect(x, y, c.getBoundingClientRect())
  );
  return distances.indexOf(Math.min(...distances));
}