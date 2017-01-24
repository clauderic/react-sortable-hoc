var protocols = require("../lib")
  , tester = require("tester")
  ;

tester.describe("check urls", test => {
    test.it("should support mutiple protocols", function (cb) {
        test.expect(protocols("git+ssh://git@some-host.com/and-the-path/name")).toEqual(["git", "ssh"]);
        cb();
    });

    test.it("should support one protocol", function (cb) {
        test.expect(protocols("ssh://git@some-host.com/and-the-path/name")).toEqual(["ssh"]);
        cb();
    });

    test.it("should support taking the first protocol", function (cb) {
        test.expect(protocols("git+ssh://git@some-host.com/and-the-path/name").toEqual(true), "git");
        cb();
    });

    test.it("should support taking the second protocol", function (cb) {
        test.expect(protocols("git+ssh://git@some-host.com/and-the-path/name").toEqual(1), "ssh");
        cb();
    });
});
