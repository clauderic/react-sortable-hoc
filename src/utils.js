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


const _doc = document;
const _docElement = _doc.documentElement || {};
const unwrapElement = function(value) {
	if (!value) {
		return value;
	}
	if (value.length && value !== window && value[0] && value[0].style && !value.nodeType) {
		value = value[0];
	}
	return (value === window || (value.nodeType && value.style)) ? value : null;
};
const getDocScrollTop = function() {
	return (window.pageYOffset != null) ? window.pageYOffset : (_doc.scrollTop != null) ? _doc.scrollTop : _docElement.scrollTop || _doc.body.scrollTop || 0;
};

const getDocScrollLeft = function() {
	return (window.pageXOffset != null) ? window.pageXOffset : (_doc.scrollLeft != null) ? _doc.scrollLeft : _docElement.scrollLeft || _doc.body.scrollLeft || 0;
};
const _tempRect = {}; // reuse to reduce garbage collection tasks

function parseRect(e, undefined) {
    //accepts a DOM element, a mouse event, or a rectangle object and returns the corresponding rectangle with left, right, width, height, top, and bottom properties
    if (e === window) {
        _tempRect.left = _tempRect.top = 0;
        _tempRect.width = _tempRect.right = _docElement.clientWidth || e.innerWidth || _doc.body.clientWidth || 0;
        _tempRect.height = _tempRect.bottom = ((e.innerHeight || 0) - 20 < _docElement.clientHeight) ? _docElement.clientHeight : e.innerHeight || _doc.body.clientHeight || 0;
        return _tempRect;
    }
    var r = (e.pageX !== undefined) ? {left:e.pageX - getDocScrollLeft(), top:e.pageY - getDocScrollTop(), right:e.pageX - getDocScrollLeft() + 1, bottom:e.pageY - getDocScrollTop() + 1} : (!e.nodeType && e.left !== undefined && e.top !== undefined) ? e : unwrapElement(e).getBoundingClientRect();
    if (r.right === undefined && r.width !== undefined) {
        r.right = r.left + r.width;
        r.bottom = r.top + r.height;
    } else if (r.width === undefined) { //some browsers don't include width and height properties. We can't just set them directly on r because some browsers throw errors, so create a new generic object.
        r = {width: r.right - r.left, height: r.bottom - r.top, right: r.right, left: r.left, bottom: r.bottom, top: r.top};
    }
    return r;
}

export function hitTest(obj1, obj2, {threshold, axis}) {
    if (obj1 === obj2) {
        return false;
    }
    const r1 = parseRect(obj1);
    const r2 = parseRect(obj2);
    const isOutside = (axis.x && (r2.left > r1.right || r2.right < r1.left) || axis.y && (r2.top > r1.bottom || r2.bottom < r1.top));
    let overlap, area, isRatio;

    if (isOutside || !threshold) {
        return !isOutside;
    }
    isRatio = ((threshold + "").indexOf("%") !== -1);
    threshold = parseFloat(threshold) || 0;
    overlap = {left:Math.max(r1.left, r2.left), top:Math.max(r1.top, r2.top)};
    overlap.width = Math.min(r1.right, r2.right) - overlap.left;
    overlap.height = Math.min(r1.bottom, r2.bottom) - overlap.top;

    if (axis.x && overlap.width < 0 || axis.y && overlap.height < 0) {
        return false;
    }

    if (isRatio) {
        threshold *= 0.01;

        return (axis.x && overlap.width >= r2.width * threshold || axis.y && overlap.height >= r2.height * threshold);
    }

    return (overlap.width > threshold && overlap.height > threshold);
}
