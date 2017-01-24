// Dependencies
const protocols = require("../lib");

console.log(protocols("git+ssh://git@some-host.com/and-the-path/name"));
// ["git", "ssh"]

console.log(protocols("http://ionicabizau.net", true));
// "http"
