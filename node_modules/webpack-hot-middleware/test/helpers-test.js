/* eslint-env mocha */
var assert = require('assert');

var helpers = require("../helpers");

describe("helpers", function() {
  describe("pathMatch", function() {
    var pathMatch = helpers.pathMatch;
    it("should match exact path", function() {
      assert.ok(pathMatch("/path", "/path"));
    });
    it("should match path with querystring", function() {
      assert.ok(pathMatch("/path?abc=123", "/path"));
    });
    it("should not match different path", function() {
      assert.equal(pathMatch("/another", "/path"), false);
    });
    it("should not match path with other stuff on the end", function() {
      assert.equal(pathMatch("/path-and", "/path"), false);
    });
  });
});
