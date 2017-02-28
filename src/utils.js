export function arrayMove (arr, previousIndex, newIndex) {
    const array = arr.slice(0);
    if (newIndex >= array.length) {
        let k = newIndex - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
    return array;
}

export function omit (obj, ...keysToOmit) {
    return Object.keys(obj).reduce((acc, key) => {
        if (keysToOmit.indexOf(key) === -1) acc[key] = obj[key];
        return acc;
    }, {});
}

export const events = {
  start: ['touchstart', 'mousedown'],
  move: ['touchmove', 'mousemove'],
  end: ['touchend', 'touchcancel', 'mouseup']
};

export const vendorPrefix = (function () {
    if (typeof window === 'undefined' || typeof document === 'undefined') return ''; // server environment
    // fix for:
    //    https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    //    window.getComputedStyle() returns null inside an iframe with display: none
    // in this case return an array with a fake mozilla style in it.
    let styles = window.getComputedStyle(document.documentElement, '') || ['-moz-hidden-iframe'];
    const pre = (Array.prototype.slice
        .call(styles)
        .join('')
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];

    switch (pre) {
        case 'ms':
            return 'ms';
        default:
            return (pre && pre.length) ? pre[0].toUpperCase() + pre.substr(1) : '';
    }
})();

export function closest(el, fn) {
    while (el) {
        if (fn(el)) return el;
        el = el.parentNode;
    }
}

export function limit(min, max, value) {
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
        left: getCSSPixelValue(style.marginLeft)
    };
}

export function provideDisplayName(prefix, Component) {
    const componentName = Component.displayName || Component.name

    return componentName ? `${prefix}(${componentName})` : prefix;
}

/**
 * Gets the first absolute or relative positioned parent node for given node if it's inside the container.
 * If there is no positioned parent node between the node and the container the container gets returned
 * 
 * @export
 * @param {HTMLElement} node
 * @param {HTMLElement} container
 * @returns {HTMLElement}
 */
export function getOffsetParent(node, container) {
    if(node === container) {
        return node
    }
    if (node && node.parentNode) {
        if (node.parentNode.style &&
            node.parentNode.style.position && (
            node.parentNode.style.position === 'absolute' ||
            node.parentNode.style.position === 'relative')) {
            return node.parentNode;
        }
        else {
            return getOffsetParent(node.parentNode);
        }
    }
    return node;
}
