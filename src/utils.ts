import * as React from 'react';
import { SortableNode } from './Manager';
import { SortableHandleNode } from './SortableHandle';

export function arrayMove(arr: any[], previousIndex: number, newIndex: number) {
  const array = arr.slice(0);
  if (newIndex >= array.length) {
    let k = newIndex - array.length;
    while (k-- + 1) {
      array.push(undefined);
    }
  }
  array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
  return array;
}

export function omit(obj: { [key: string]: any }, ...keysToOmit: string[]) {
  return Object.keys(obj).reduce((acc, key) => {
    if (keysToOmit.indexOf(key) === -1) acc[key] = obj[key];
    return acc;
  }, {} as { [key: string]: any });
}

export const events = {
  start: ['touchstart', 'mousedown'],
  move: ['touchmove', 'mousemove'],
  end: ['touchend', 'touchcancel', 'mouseup'],
};

export const vendorPrefix: string = (function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return ''; // server environment
  // fix for:
  //    https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  //    window.getComputedStyle() returns null inside an iframe with display: none
  // in this case return an array with a fake mozilla style in it.
  const styles = window.getComputedStyle(document.documentElement, '') || ['-moz-hidden-iframe'];
  const pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || ((styles as any).OLink === '' && ['', 'o']))[1];

  switch (pre) {
    case 'ms':
      return 'ms';
    default:
      return pre && pre.length ? pre[0].toUpperCase() + pre.substr(1) : '';
  }
})();

export function closest(el: HTMLElement | undefined | null, fn: (t: HTMLElement) => boolean) {
  while (el) {
    if (fn(el)) return el;
    el = el.parentElement;
  }
}

/**
 * A [user-defined type guard][0] for use within typescript
 * [0]: https://github.com/Microsoft/TypeScript-Handbook/blob/v2.1/pages/Advanced%20Types.md#user-defined-type-guards
 * @param node HTMLElement to check
 */
export function nodeIsSortable(node: any): node is SortableNode {
  return node && (node as SortableNode).sortableInfo !== undefined;
}

export function nodeIsSortableHandle(node: any): node is SortableHandleNode {
  return node && (node as SortableHandleNode).sortableHandle;
}

export function limit(min: number, max: number, value: number) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function getCSSPixelValue(stringValue: string | undefined | null) {
  if (stringValue && stringValue.substr(-2) === 'px') {
    return parseFloat(stringValue);
  }
  return 0;
}

export function getElementMargin(element: HTMLElement) {
  const style = window.getComputedStyle(element);

  return {
    top: getCSSPixelValue(style.marginTop),
    right: getCSSPixelValue(style.marginRight),
    bottom: getCSSPixelValue(style.marginBottom),
    left: getCSSPixelValue(style.marginLeft),
  };
}

export function provideDisplayName(prefix: string, Component: React.ComponentClass) {
  const componentName = Component.displayName || Component.name;

  return componentName ? `${prefix}(${componentName})` : prefix;
}
