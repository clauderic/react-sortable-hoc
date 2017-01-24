var relative = require( 'require-relative' );

var baseLocation = require.resolve( 'babel-preset-es2015' );
var plugins = require( baseLocation ).plugins.slice();

var commonjsPlugin = relative( 'babel-plugin-transform-es2015-modules-commonjs', baseLocation );
plugins.splice( plugins.indexOf( commonjsPlugin ), 1 );

plugins.push( require( 'babel-plugin-external-helpers' ) );

module.exports = { plugins: plugins };
