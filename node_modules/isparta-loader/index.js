'use strict';

var isparta = require('isparta');

module.exports = function(source) {
    var config = this.options.isparta || {
        embedSource: true,
        noAutoWrap: true,
        babel: this.options.babel
    };

    var instrumenter = new isparta.Instrumenter(config);

    if (this.cacheable) {
        this.cacheable();
    }

    return instrumenter.instrumentSync(source, this.resourcePath);
};
