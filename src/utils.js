import invariant from 'invariant';

export function arrayMove(arr, previousIndex, newIndex) {
  const array = [...arr];
  if (newIndex >= array.length) {
    let k = newIndex - array.length;
    while (k-- + 1) {
      array.push(undefined);
    }
  }
  [array[previousIndex], array[newIndex]] = [array[newIndex], array[previousIndex]];  // swap
  return array;
}

export const events = {
  start: ['touchstart', 'mousedown'],
  move: ['touchmove', 'mousemove'],
  end: ['touchend', 'touchcancel', 'mouseup'],
};

export const vendorPrefix = (function() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return ''; // server environment
  // fix for:
  //    https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  //    window.getComputedStyle() returns null inside an iframe with display: none
  // in this case return an array with a fake mozilla style in it.
  const styles = window.getComputedStyle(document.documentElement, '') || ['-moz-hidden-iframe'];
  const pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];

  switch (pre) {
    case 'ms':
      return 'ms';
    default:
      return pre && pre.length ? pre[0].toUpperCase() + pre.substr(1) : '';
  }
})();

export function closest(el, fn) {
  while (el) {
    if (fn(el)) return el;
    el = el.parentNode;
  }
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
export function limit(min, max, value) {
  return Math.min(Math.max(value, min), max);
}

function getCSSPixelValue(stringValue) {
  if (stringValue.substr(-2) === 'px') {
    return parseFloat(stringValue);
  }
  return 0;
}

export function getElementMargin(element) {
  const style = window.getComputedStyle(element);

  return {
    top: getCSSPixelValue(style.marginTop),
    right: getCSSPixelValue(style.marginRight),
    bottom: getCSSPixelValue(style.marginBottom),
    left: getCSSPixelValue(style.marginLeft),
  };
}

export function provideDisplayName(prefix, Component) {
  const componentName = Component.displayName || Component.name;

  return componentName ? `${prefix}(${componentName})` : prefix;
}

export function getPosition(event) {
  if (event.touches && event.touches.length) {
    return {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    };
  } else if (event.changedTouches && event.changedTouches.length) {
    return {
      x: event.changedTouches[0].pageX,
      y: event.changedTouches[0].pageY,
    };
  } else {
    return {
      x: event.pageX,
      y: event.pageY,
    };
  }
}

export function isTouchEvent(event) {
  return (
    event.touches && event.touches.length ||
    event.changedTouches && event.changedTouches.length
  );
}

export function getEdgeOffset(node, parent, offset = {top: 0, left: 0}) {
  // Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
  if (node) {
    const nodeOffset = {
      top: offset.top + node.offsetTop,
      left: offset.left + node.offsetLeft,
    };

    if (node.parentNode !== parent) {
      return getEdgeOffset(node.parentNode, parent, nodeOffset);
    } else {
      return nodeOffset;
    }
  }
}


export function getLockPixelOffset({lockOffset, width, height}) {
  let offsetX = lockOffset;
  let offsetY = lockOffset;
  let unit = 'px';

  if (typeof lockOffset === 'string') {
    const match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);

    invariant(
      match !== null,
      'lockOffset value should be a number or a string of a ' +
        'number followed by "px" or "%". Given %s',
      lockOffset
    );

    offsetX = (offsetY = parseFloat(lockOffset));
    unit = match[1];
  }

  invariant(
    isFinite(offsetX) && isFinite(offsetY),
    'lockOffset value should be a finite. Given %s',
    lockOffset
  );

  if (unit === '%') {
    offsetX = offsetX * width / 100;
    offsetY = offsetY * height / 100;
  }

  return {
    x: offsetX,
    y: offsetY,
  };
}
