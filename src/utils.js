export function arrayMove (array, previousIndex, newIndex) {
    if (newIndex >= array.length) {
        var k = newIndex - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
    return array;
}

export const touchSupport = Boolean(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);

export const events = {
	start: (touchSupport) ? 'touchstart' : 'mousedown',
	move: (touchSupport) ? 'touchmove' : 'mousemove',
	end: (touchSupport) ? 'touchend' : 'mouseup'
};

function isIE(version) {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? (parseInt(myNav.split('msie')[1], 10) == version) : false;
}

export const vendorPrefix = (function () {
    let styles = window.getComputedStyle(document.documentElement, '');
    let pre = (Array.prototype.slice
        .call(styles)
        .join('')
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];

    switch (pre) {
        case 'ms':
            return (isIE(9)) ? 'ms' : '';
        case 'webkit':
            return 'Webkit';
        default:
            return '';
    }
})();

export function closest(el, fn) {
    while (el) {
        if (fn(el)) return el;
        el = el.parentNode;
    }
}
