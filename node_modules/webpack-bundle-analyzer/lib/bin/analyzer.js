#! /usr/bin/env node
'use strict';

var _require = require('path'),
    resolve = _require.resolve,
    dirname = _require.dirname;

var _ = require('lodash');
var commander = require('commander');

var _require2 = require('chalk'),
    magenta = _require2.magenta;

var analyzer = require('../analyzer');
var viewer = require('../viewer');

var program = commander.version(require('../../package.json').version).usage('<bundleStatsFile> [bundleDir] [options]\n\n  Arguments:\n  \n    bundleStatsFile  Path to Webpack Stats JSON file.\n    bundleDir        Directory containing all generated bundles.\n                     You should provided it if you want analyzer to show you the real parsed module sizes.\n                     By default a directory of stats file is used.').option('-m, --mode <mode>', 'Analyzer mode. Should be `server` or `static`.' + br('In `server` mode analyzer will start HTTP server to show bundle report.') + br('In `static` mode single HTML file with bundle report will be generated.') + br('Default is `server`.'), 'server').option('-p, --port <n>', 'Port that will be used in `server` mode to start HTTP server.' + br('Default is 8888.'), Number, 8888).option('-r, --report <file>', 'Path to bundle report file that will be generated in `static` mode.' + br('Default is `report.html`.'), 'report.html').option('-O, --no-open', "Don't open report in default browser automatically.").parse(process.argv);

var mode = program.mode,
    port = program.port,
    reportFilename = program.report,
    openBrowser = program.open,
    _program$args = program.args,
    bundleStatsFile = _program$args[0],
    bundleDir = _program$args[1];


if (!bundleStatsFile) showHelp('Provide path to Webpack Stats file as first argument');
if (mode !== 'server' && mode !== 'static') showHelp('Invalid mode. Should be either `server` or `static`.');
if (mode === 'server' && isNaN(port)) showHelp('Invalid port number');

bundleStatsFile = resolve(bundleStatsFile);

if (!bundleDir) bundleDir = dirname(bundleStatsFile);

var bundleStats = void 0;
try {
  bundleStats = analyzer.readStatsFromFile(bundleStatsFile);
} catch (err) {
  console.error('Could\'t read webpack bundle stats from "' + bundleStatsFile + '":\n' + err);
  process.exit(1);
}

if (mode === 'server') {
  viewer.startServer(bundleStats, {
    openBrowser: openBrowser,
    port: port,
    bundleDir: bundleDir
  });
} else {
  viewer.generateReport(bundleStats, {
    openBrowser: openBrowser,
    reportFilename: resolve(reportFilename),
    bundleDir: bundleDir
  });
}

function showHelp(error) {
  if (error) console.log('\n  ' + magenta(error));
  program.outputHelp();
  process.exit(1);
}

function br(str) {
  return '\n' + _.repeat(' ', 21) + str;
}