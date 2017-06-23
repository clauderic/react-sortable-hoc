import {clamp} from '../utils';

export function distanceRect(x, y, rect) {
  const dx = x - clamp(x, rect.left, rect.right);
  const dy = y - clamp(y, rect.top, rect.bottom);

  return Math.sqrt(dx * dx + dy * dy);
}

export function closestRect(x, y, containers) {
  const distances = containers.map(c =>
    distanceRect(x, y, c.getBoundingClientRect()));
  return distances.indexOf(Math.min(...distances));
}

export function getDelta(rect1, rect2) {
  return {
    x: rect1.left - rect2.left,
    y: rect1.top - rect2.top,
  };
}

export function updateDistanceBetweenContainers(
  distance,
  container1,
  container2,
) {
  const {x, y} = distance;
  const d = getDelta(
    ...[container1, container2].map(c => c.container.getBoundingClientRect()),
  );

  return {
    x: x + d.x,
    y: y + d.y,
  };
}
