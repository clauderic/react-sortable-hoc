var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = PageBus;
inherits(PageBus, EventEmitter);

var emit = EventEmitter.prototype.emit;
var on = EventEmitter.prototype.on;

function PageBus (opts) {
    if (!(this instanceof PageBus)) return new PageBus(opts);
    if (!opts) opts = {};
    var self = this;
    EventEmitter.call(this);
    if (typeof opts === 'string') opts = { key: opts };
    this._key = opts.key || 'page-bus';
    window.addEventListener('storage', function (ev) {
        if (ev.key === self._key) {
            try { var value = JSON.parse(ev.newValue) }
            catch (err) { return }
            if (Array.isArray(value)) emit.apply(self, value);
        }
    });
}

PageBus.prototype.on = function (name, f) {
    on.apply(this, arguments);
};

PageBus.prototype.emit = function (name) {
    emit.apply(this, arguments);
    var args = [].slice.call(arguments);
    localStorage.setItem(this._key, JSON.stringify(args));
    return this;
};
