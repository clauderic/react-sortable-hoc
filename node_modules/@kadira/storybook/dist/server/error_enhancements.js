'use strict';

var isChrome = function isChrome() {
  return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
};

// This only works with Chrome (AKA V8).
// So, using this on other browsers cause problems.
// But this provides a lot of value when debugging bundled code.
if (isChrome()) {
  require('stack-source-map/register');
}