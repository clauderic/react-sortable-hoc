'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nomnomnomnom = require('nomnomnomnom');

var _nomnomnomnom2 = _interopRequireDefault(_nomnomnomnom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//

exports.default = ArgParser;

//

//

function ArgParser(commands) {
  var parser = (0, _nomnomnomnom2.default)();

  parser.command('cover').help("transparently adds coverage information to a node command. Saves coverage.json and reports at the end of execution").option('cmd', {
    required: true,
    position: 1,
    help: 'ES6 js files to cover (using babel)'
  }).option('config', {
    metavar: '<path-to-config>',
    help: 'the configuration file to use, defaults to .istanbul.yml'
  }).option('default-excludes', {
    flag: true,
    help: 'apply default excludes [ **/node_modules/**, **/test/**, **/tests/** ]'
  }).option('excludes', {
    abbr: 'x',
    default: [],
    help: 'one or more fileset patterns e.g. "**/vendor/**"',
    list: true,
    metavar: '<exclude-pattern>'
  }).option('report', {
    default: 'lcv',
    metavar: '<format>',
    list: true,
    help: 'report format'
  }).option('root', {
    metavar: '<path>',
    help: 'the root path to look for files to instrument'
  }).option('include', {
    default: ['**/*.js'],
    metavar: '<include-pattern>',
    list: true,
    abbr: 'i',
    help: 'one or more fileset patterns e.g. \'**/*.js\''
  }).option('verbose', {
    flag: true,
    abbr: 'v',
    help: 'verbose mode'
  }).option('include-all-sources', {
    flag: true,
    help: 'instrument all unused sources after running tests'
  }).callback(commands.cover);

  return parser;
}