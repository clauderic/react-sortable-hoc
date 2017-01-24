var createBus = require('../');
var bus = createBus();

bus.on('hello', function (msg) {
    console.log('msg=', msg);
});

bus.emit('hello', Date.now());
