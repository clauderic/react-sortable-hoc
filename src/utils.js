import invariant from 'invariant';

export function arrayMove(array, from, to) {
  // Will be deprecated soon. Consumers should install 'array-move' instead
  // https://www.npmjs.com/package/array-move

  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);

  return array;
}

export function omit(obj, ...keysToOmit) {
  return Object.keys(obj).reduce((acc, key) => {
    if (keysToOmit.indexOf(key) === -1) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

export const events = {
  start: ['touchstart', 'mousedown'],
  move: ['touchmove', 'mousemove'],
  end: ['touchend', 'touchcancel', 'mouseup'],
};

export const vendorPrefix = (function() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Server environment
    return '';
  }

  // fix for: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  // window.getComputedStyle() returns null inside an iframe with display: none
  // in this case return an array with a fake mozilla style in it.
  const styles = window.getComputedStyle(document.documentElement, '') || [
    '-moz-hidden-iframe',
  ];
  const pre = (Array.prototype.slice
    .call(styles)
    .join('')
    .match(/-(moz|webkit|ms)-/) ||
    (styles.OLink === '' && ['', 'o']))[1];

  switch (pre) {
    case 'ms':
      return 'ms';
    default:
      return pre && pre.length ? pre[0].toUpperCase() + pre.substr(1) : '';
  }
})();

export function closest(el, fn) {
  while (el) {
    if (fn(el)) {
      return el;
    }

    el = el.parentNode;
  }

  return null;
}

export function limit(min, max, value) {
  return Math.max(min, Math.min(value, max));
}

function getPixelValue(stringValue) {
  if (stringValue.substr(-2) === 'px') {
    return parseFloat(stringValue);
  }

  return 0;
}

export function getElementMargin(element) {
  const style = window.getComputedStyle(element);

  return {
    top: getPixelValue(style.marginTop),
    right: getPixelValue(style.marginRight),
    bottom: getPixelValue(style.marginBottom),
    left: getPixelValue(style.marginLeft),
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
    (event.touches && event.touches.length) ||
    (event.changedTouches && event.changedTouches.length)
  );
}

export function getEdgeOffset(node, parent, offset = {top: 0, left: 0}) {
  if (!node) {
    return undefined;
  }

  // Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
  const nodeOffset = {
    top: offset.top + node.offsetTop,
    left: offset.left + node.offsetLeft,
  };

  if (node.parentNode === parent) {
    return nodeOffset;
  }

  return getEdgeOffset(node.parentNode, parent, nodeOffset);
}

export function getContainerGridGap(element) {
  const style = window.getComputedStyle(element);

  if (style.display === 'grid') {
    return {
      x: getPixelValue(style.gridColumnGap),
      y: getPixelValue(style.gridRowGap),
    };
  }

  return { x: 0, y: 0 };
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
      lockOffset,
    );

    offsetX = parseFloat(lockOffset);
    offsetY = parseFloat(lockOffset);
    unit = match[1];
  }

  invariant(
    isFinite(offsetX) && isFinite(offsetY),
    'lockOffset value should be a finite. Given %s',
    lockOffset,
  );

  if (unit === '%') {
    offsetX = (offsetX * width) / 100;
    offsetY = (offsetY * height) / 100;
  }

  return {
    x: offsetX,
    y: offsetY,
  };
}
