/* global process */
import invariant from 'invariant';

export function arrayMove(array, from, to) {
  // Will be deprecated soon. Consumers should install 'array-move' instead
  // https://www.npmjs.com/package/array-move

  if (process.env.NODE_ENV !== 'production') {
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn(
        "Deprecation warning: arrayMove will no longer be exported by 'react-sortable-hoc' in the next major release. Please install the `array-move` package locally instead. https://www.npmjs.com/package/array-move",
      );
    }
  }

  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);

  return array;
}

export function omit(obj, keysToOmit) {
  return Object.keys(obj).reduce((acc, key) => {
    if (keysToOmit.indexOf(key) === -1) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

export const events = {
  end: ['touchend', 'touchcancel', 'mouseup'],
  move: ['touchmove', 'mousemove'],
  start: ['touchstart', 'mousedown'],
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

export function setInlineStyles(node, styles) {
  Object.keys(styles).forEach((key) => {
    node.style[key] = styles[key];
  });
}

export function setTranslate3d(node, translate) {
  node.style[`${vendorPrefix}Transform`] =
    translate == null ? '' : `translate3d(${translate.x}px,${translate.y}px,0)`;
}

export function setTransitionDuration(node, duration) {
  node.style[`${vendorPrefix}TransitionDuration`] =
    duration == null ? '' : `${duration}ms`;
}

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
    bottom: getPixelValue(style.marginBottom),
    left: getPixelValue(style.marginLeft),
    right: getPixelValue(style.marginRight),
    top: getPixelValue(style.marginTop),
  };
}

export function provideDisplayName(prefix, Component) {
  const componentName = Component.displayName || Component.name;

  return componentName ? `${prefix}(${componentName})` : prefix;
}

export function getScrollAdjustedBoundingClientRect(node, scrollDelta) {
  const boundingClientRect = node.getBoundingClientRect();

  return {
    top: boundingClientRect.top + scrollDelta.top,
    left: boundingClientRect.left + scrollDelta.left,
  };
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

export function getEdgeOffset(node, parent, offset = {left: 0, top: 0}) {
  if (!node) {
    return undefined;
  }

  // Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
  const nodeOffset = {
    left: offset.left + node.offsetLeft,
    top: offset.top + node.offsetTop,
  };

  if (node.parentNode === parent) {
    return nodeOffset;
  }

  return getEdgeOffset(node.parentNode, parent, nodeOffset);
}

export function getTargetIndex(newIndex, prevIndex, oldIndex) {
  if (newIndex < oldIndex && newIndex > prevIndex) {
    return newIndex - 1;
  } else if (newIndex > oldIndex && newIndex < prevIndex) {
    return newIndex + 1;
  } else {
    return newIndex;
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

export function getLockPixelOffsets({height, width, lockOffset}) {
  const offsets = Array.isArray(lockOffset)
    ? lockOffset
    : [lockOffset, lockOffset];

  invariant(
    offsets.length === 2,
    'lockOffset prop of SortableContainer should be a single ' +
      'value or an array of exactly two values. Given %s',
    lockOffset,
  );

  const [minLockOffset, maxLockOffset] = offsets;

  return [
    getLockPixelOffset({height, lockOffset: minLockOffset, width}),
    getLockPixelOffset({height, lockOffset: maxLockOffset, width}),
  ];
}

function isScrollable(el) {
  const computedStyle = window.getComputedStyle(el);
  const overflowRegex = /(auto|scroll)/;
  const properties = ['overflow', 'overflowX', 'overflowY'];

  return properties.find((property) =>
    overflowRegex.test(computedStyle[property]),
  );
}

export function getScrollingParent(el) {
  if (!(el instanceof HTMLElement)) {
    return null;
  } else if (isScrollable(el)) {
    return el;
  } else {
    return getScrollingParent(el.parentNode);
  }
}

export function getContainerGridGap(element) {
  const style = window.getComputedStyle(element);

  if (style.display === 'grid') {
    return {
      x: getPixelValue(style.gridColumnGap),
      y: getPixelValue(style.gridRowGap),
    };
  }

  return {x: 0, y: 0};
}

export const KEYCODE = {
  TAB: 9,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

export const NodeType = {
  Anchor: 'A',
  Button: 'BUTTON',
  Canvas: 'CANVAS',
  Input: 'INPUT',
  Option: 'OPTION',
  Textarea: 'TEXTAREA',
  Select: 'SELECT',
};

export function cloneNode(node) {
  const selector = 'input, textarea, select, canvas, [contenteditable]';
  const fields = node.querySelectorAll(selector);
  const clonedNode = node.cloneNode(true);
  const clonedFields = [...clonedNode.querySelectorAll(selector)];

  clonedFields.forEach((field, i) => {
    if (field.type !== 'file') {
      field.value = fields[i].value;
    }

    // Fixes an issue with original radio buttons losing their value once the
    // clone is inserted in the DOM, as radio button `name` attributes must be unique
    if (field.type === 'radio' && field.name) {
      field.name = `__sortableClone__${field.name}`;
    }

    if (
      field.tagName === NodeType.Canvas &&
      fields[i].width > 0 &&
      fields[i].height > 0
    ) {
      const destCtx = field.getContext('2d');
      destCtx.drawImage(fields[i], 0, 0);
    }
  });

  return clonedNode;
}
