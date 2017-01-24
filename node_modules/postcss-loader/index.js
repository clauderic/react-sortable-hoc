var loaderUtils = require('loader-utils');
var postcss     = require('postcss');

module.exports = function (source, map) {
    if ( this.cacheable ) this.cacheable();

    var file   = this.resourcePath;
    var params = loaderUtils.parseQuery(this.query);

    var opts = {
        from: file,
        to:   file,
        map:  {
            inline:     false,
            annotation: false
        }
    };

    if ( typeof map === 'string' ) map = JSON.parse(map);
    if ( map && map.mappings ) opts.map.prev = map;

    var options = this.options.postcss;
    if ( typeof options === 'function' ) {
        options = options.call(this, this);
    }

    var plugins;
    if ( typeof options === 'undefined' ) {
        plugins = [];
    } else if ( Array.isArray(options) ) {
        plugins = options;
    } else {
        plugins = options.plugins || options.defaults;
        opts.stringifier = options.stringifier;
        opts.parser      = options.parser;
        opts.syntax      = options.syntax;
    }
    if ( params.pack ) {
        plugins = options[params.pack];
        if ( !plugins ) {
            throw new Error('PostCSS plugin pack is not defined in options');
        }
    }

    if ( params.syntax ) {
        opts.syntax = require(params.syntax);
    }
    if ( params.parser ) {
        opts.parser = require(params.parser);
    }
    if ( params.stringifier ) {
        opts.stringifier = require(params.stringifier);
    }

    var loader   = this;
    var callback = this.async();

    if ( params.parser === 'postcss-js' ) {
        source = this.exec(source, this.resource);
    }

    postcss(plugins).process(source, opts)
        .then(function (result) {
            result.warnings().forEach(function (msg) {
                loader.emitWarning(msg.toString());
            });
            callback(null, result.css, result.map ? result.map.toJSON() : null);
        })
        .catch(function (error) {
            if ( error.name === 'CssSyntaxError' ) {
                loader.emitError(error.message + error.showSourceCode());
                callback();
            } else {
                callback(error);
            }
        });
};
