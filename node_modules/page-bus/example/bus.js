var createBus = require('../');
var bus = createBus();

var pre = document.querySelector('pre');
var form = document.querySelector('form');

bus.on('hello', function (msg) {
    pre.textContent += msg + '\n';
});

bus.emit('hello', Date.now());

form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    bus.emit('hello', form.elements.msg.value);
    form.elements.msg.value = '';
});
