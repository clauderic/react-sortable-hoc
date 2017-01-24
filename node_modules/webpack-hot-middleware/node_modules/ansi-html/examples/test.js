var ansiHTML   = require('../'),
    chalk = require('chalk');

var str = chalk.bold.red('foo') + ' bar';
console.log('[ANSI]', str)
console.log('[HTML]', ansiHTML(str));

str = chalk.bold.red('foo') + ' fin ' + chalk.bold.magenta('foo');
console.log('[ANSI]', str);
console.log('[HTML]', ansiHTML(str));

ansiHTML.setColors({
  'reset': ['555', '666'],
  black: 'aaa',
  red: 'bbb',
  green: 'ccc',
  yellow: 'ddd',
  blue: 'eee',
  magenta: 'fff',
  cyan: '999',
  lightgray: '888',
  darkgray: '777'
});
console.log('[HTML]', ansiHTML(str));