/* eslint-env mocha, browser */

var sinon = require('sinon');

describe("client", function() {
  var s, client, clientOverlay, processUpdate;

  beforeEach(function() {
    s = sinon.sandbox.create();
  });
  afterEach(function() {
    s.restore();
  });

  context("with default options", function() {
    beforeEach(function setup() {
      global.__resourceQuery = ''; // eslint-disable-line no-underscore-dangle
      global.window = {
        EventSource: sinon.stub().returns({
          close: sinon.spy()
        })
      };
    });
    beforeEach(loadClient);
    it("should connect to __webpack_hmr", function() {
      sinon.assert.calledOnce(window.EventSource);
      sinon.assert.calledWithNew(window.EventSource);
      sinon.assert.calledWith(window.EventSource, '/__webpack_hmr');
    });
    it("should trigger webpack on successful builds", function() {
      var eventSource = window.EventSource.lastCall.returnValue;
      eventSource.onmessage(makeMessage({
        action: 'built',
        time: 100,
        hash: 'deadbeeffeddad',
        errors: [],
        warnings: [],
        modules: []
      }));
      sinon.assert.calledOnce(processUpdate);
    });
    it("should call subscribeAll handler on default messages", function() {
      var spy = sinon.spy();
      client.subscribeAll(spy);
      var message = {
        action: 'built',
        time: 100,
        hash: 'deadbeeffeddad',
        errors: [],
        warnings: [],
        modules: []
      };

      var eventSource = window.EventSource.lastCall.returnValue;
      eventSource.onmessage(makeMessage(message));

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, message);
    });
    it("should call subscribeAll handler on custom messages", function() {
      var spy = sinon.spy();
      client.subscribeAll(spy);

      var eventSource = window.EventSource.lastCall.returnValue;
      eventSource.onmessage(makeMessage({
        action: 'thingy'
      }));

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, { action: 'thingy' });
    });
    it("should call only custom handler on custom messages", function() {
      var spy = sinon.spy();
      client.subscribe(spy);

      var eventSource = window.EventSource.lastCall.returnValue;
      eventSource.onmessage(makeMessage({
        custom: 'thingy'
      }));
      eventSource.onmessage(makeMessage({
        action: 'built'
      }));

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, { custom: 'thingy' });
      sinon.assert.notCalled(processUpdate);
    });
    it("should test more of the client's functionality");
  });

  context("with no browser environment", function() {
    beforeEach(function setup() {
      global.__resourceQuery = ''; // eslint-disable-line no-underscore-dangle
      delete global.window;
    });
    beforeEach(loadClient);
    it("should not connect", function() {
      // doesn't error
    });
  });

  context("with no EventSource", function() {
    beforeEach(function setup() {
      global.__resourceQuery = ''; // eslint-disable-line no-underscore-dangle
      global.window = {};
      s.stub(console, 'warn');
    });
    beforeEach(loadClient);
    it("should emit warning and not connect", function() {
      sinon.assert.calledOnce(console.warn);
      sinon.assert.calledWithMatch(console.warn, /EventSource/);
    });
  });

  function makeMessage(obj) {
    return { data: typeof obj === 'string' ? obj : JSON.stringify(obj) };
  }

  function loadClient() {
    var path = require.resolve('../client');
    delete require.cache[path];
    client = require(path);
  }

  beforeEach(function() {
    clientOverlay = {
      exports: { showProblems: sinon.stub(), clear: sinon.stub() }
    };
    require.cache[require.resolve('../client-overlay')] = clientOverlay;

    processUpdate = sinon.stub();
    require.cache[require.resolve('../process-update')] = {
      exports: processUpdate
    };
  });
  afterEach(function() {
    delete require.cache[require.resolve('../client-overlay')];
    delete require.cache[require.resolve('../process-update')];
  });
});
