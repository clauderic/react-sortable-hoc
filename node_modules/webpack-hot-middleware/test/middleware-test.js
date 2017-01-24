/* eslint-env mocha */
var events = require('events');
var assert = require('assert');

var sinon = require('sinon');
var supertest = require('supertest');

var express = require('express');
var webpackHotMiddleware = require('../middleware');

describe("middleware", function() {
  var s, compiler, app, middleware;

  context("with default options", function() {
    beforeEach(setupServer({log: function(){}}));

    it("should create eventStream on /__webpack_hmr", function(done) {
      request('/__webpack_hmr')
        .expect('Content-Type', /^text\/event-stream\b/)
        .end(done);
    });
    it("should heartbeat every 10 seconds", function(done) {
      request('/__webpack_hmr')
        .end(function(err, res) {
          if (err) return done(err);

          // Tick 3 times, then verify
          var i = 0;
          tick(10, 'seconds');
          res.on('data', function() {
            if (++i < 3) {
              tick(10, 'seconds');
            } else {
              verify();
            }
          });

          function verify() {
            assert.equal(res.events.length, 3);
            res.events.every(function(chunk) {
              assert(/^data: /.test(chunk));
            });
            done();
          }
        });
    });
    it("should notify clients when bundle rebuild begins", function(done) {
      request('/__webpack_hmr')
        .end(function(err, res) {
          if (err) return done(err);

          res.on('data', verify);

          compiler.emit("compile");

          function verify() {
            assert.equal(res.events.length, 1);
            var event = JSON.parse(res.events[0].substring(5));
            assert.equal(event.action, "building");
            done();
          }
        });
    });
    it("should notify clients when bundle is complete", function(done) {
      request('/__webpack_hmr')
        .end(function(err, res) {
          if (err) return done(err);

          res.on('data', verify);

          compiler.emit("done", stats({
            time: 100,
            hash: "deadbeeffeddad",
            warnings: false,
            errors: false,
            modules: []
          }));

          function verify() {
            assert.equal(res.events.length, 1);
            var event = JSON.parse(res.events[0].substring(5));
            assert.equal(event.action, "built");
            done();
          }
        });
    });
    it("should notify clients when bundle is complete (multicompiler)", function(done) {
      request('/__webpack_hmr')
        .end(function(err, res) {
          if (err) return done(err);

          res.on('data', verify);

          compiler.emit("done", stats({
            children: [
              {
                time: 100,
                hash: "deadbeeffeddad",
                warnings: false,
                errors: false,
                modules: []
              },
              {
                time: 150,
                hash: "gwegawefawefawef",
                warnings: false,
                errors: false,
                modules: []
              }
            ]
          }));

          function verify() {
            assert.equal(res.events.length, 1);
            var event = JSON.parse(res.events[0].substring(5));
            assert.equal(event.action, "built");
            done();
          }
        });
    });
    it("should have tests on the payload of bundle complete");
    it("should notify all clients", function(done) {
      request('/__webpack_hmr')
        .end(function(err, res) {
          if (err) return done(err);
          res.on('data', verify);
          when();
        });
      request('/__webpack_hmr')
        .end(function(err, res) {
          if (err) return done(err);
          res.on('data', verify);
          when();
        });

      // Emit compile when both requests are connected
      when.n = 0;
      function when() {
        if (++when.n < 2) return;

        compiler.emit("compile");
      }

      // Finish test when both requests report data
      verify.n = 0;
      function verify() {
        if (++verify.n < 2) return;

        done();
      }
    });
    it("should allow custom events to be published", function(done) {
      request('/__webpack_hmr')
        .end(function(err, res) {
          if (err) return done(err);
          res.on('data', verify);

          middleware.publish({ obj: 'with stuff' });

          function verify() {
            assert.equal(res.events.length, 1);
            var event = JSON.parse(res.events[0].substring(5));
            assert.deepEqual(event, { obj: 'with stuff' });
            done();
          }
        });
    });
  });

  beforeEach(function() {
    s = sinon.sandbox.create();
    s.useFakeTimers();
    compiler = new (events.EventEmitter)();
    compiler.plugin = compiler.on;
  });
  afterEach(function() {
    s.restore();
  });
  function tick(time, unit) {
    if (unit == 'seconds') time *= 1000;
    s.clock.tick(time + 10); // +10ms for some leeway
  }
  function setupServer(opts) {
    return function() {
      app = express();
      middleware = webpackHotMiddleware(compiler, opts);
      app.use(middleware);
    };
  }
  function request(path) {
    // Wrap some stuff up so supertest works with streaming responses
    var req = supertest(app).get(path).buffer(false);
    var end = req.end;
    req.end = function(callback) {
      req
        .on('error', callback)
        .on('response', function(res) {
          Object.defineProperty(res, 'events', {get: function() {
            return res.text.trim().split("\n\n");
          }});
          res.on('data', function(chunk) {
            res.text = (res.text || '') + chunk;
          });
          process.nextTick(function() {
            req.assert(null, res, function(err) {
              callback(err, res);
            });
          });
        });

      end.call(req, function(){});
    };
    return req;
  }
  function stats(data) {
    return {
      toJson: function() {
        return data;
      }
    };
  }
});
