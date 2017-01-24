
# git-up [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![Version](https://img.shields.io/npm/v/git-up.svg)](https://www.npmjs.com/package/git-up) [![Downloads](https://img.shields.io/npm/dt/git-up.svg)](https://www.npmjs.com/package/git-up) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> A low level git url parser.

## :cloud: Installation

```sh
$ npm i --save git-up
```


## :clipboard: Example



```js
// Dependencies
var gitUp = require("git-up");

console.log(gitUp("git@github.com:IonicaBizau/node-parse-url.git"));
// => {
//     protocols: []
//   , port: null
//   , resource: "github.com"
//   , user: "git"
//   , pathname: "/IonicaBizau/node-parse-url.git"
//   , hash: ""
//   , search: ""
//   , href: "git@github.com:IonicaBizau/node-parse-url.git"
//   , protocol: "ssh"
// }

console.log(gitUp("https://github.com/IonicaBizau/node-parse-url.git"));
// => {
//     protocols: [ "https" ]
//   , port: null
//   , resource: "github.com"
//   , user: ""
//   , pathname: "/IonicaBizau/node-parse-url.git"
//   , hash: ""
//   , search: ""
//   , href: "https://github.com/IonicaBizau/node-parse-url.git"
//   , protocol: "https"
// }
```

## :memo: Documentation


### `gitUp(input)`
Parses the input url.

#### Params
- **String** `input`: The input url.

#### Return
- **Object** An object containing the following fields:
 - `protocols` (Array): An array with the url protocols (usually it has one element).
 - `port` (null|Number): The domain port.
 - `resource` (String): The url domain (including subdomains).
 - `user` (String): The authentication user (usually for ssh urls).
 - `pathname` (String): The url pathname.
 - `hash` (String): The url hash.
 - `search` (String): The url querystring value.
 - `href` (String): The input url.
 - `protocol` (String): The git url protocol.
 - `token` (String): The oauth token (could appear in the https urls).



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`git-url-parse`](https://github.com/IonicaBizau/git-url-parse)—A high level git url parser for common git providers.

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2015#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
