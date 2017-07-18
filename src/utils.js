export function arrayMove(arr, previousIndex, newIndex) {
  const array = arr.slice(0);
  if(newIndex === -1){
    array.splice(previousIndex, 1);
  } else {
    if (newIndex >= array.length) {
      let k = newIndex - array.length;
      while (k-- + 1) {
        array.push(undefined);
      }
    }
    array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
  }
  return array;
}

export function arrayInsert(arr, index, item) {
  const array = arr.slice(0);
  array.splice(index, 0, item);
  return array;
}

export function omit(obj, ...keysToOmit) {
  return Object.keys(obj).reduce((acc, key) => {
    if (keysToOmit.indexOf(key) === -1) acc[key] = obj[key];
    return acc;
  }, {});
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
  
export function getOffset(e) {
  const event = e.touches ? e.touches[0] : e;
  return {
    x: event.clientX,
    y: event.clientY,
    pageX: event.pageX,
    pageY: event.pageY,
  };
}

export function closest(el, fn) {
  while (el) {
    if (fn(el)) return el;
    el = el.parentNode;
  }
}

export function clamp(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
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