/*
  A number of polyfills for native functions are consolidated
  here. We do this instead of using the libraries directly
  because Flow is designed to make its type refinements
  with these native functions.
 */

if (!Object.assign) {
  Object.assign = require('object-assign');
}

if (!Array.isArray) {
  Array.isArray = require('lodash.isarray');
}
