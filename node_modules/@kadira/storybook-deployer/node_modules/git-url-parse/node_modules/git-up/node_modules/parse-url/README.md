
# parse-url [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![Travis](https://img.shields.io/travis/IonicaBizau/parse-url.svg)](https://travis-ci.org/IonicaBizau/parse-url/) [![Version](https://img.shields.io/npm/v/parse-url.svg)](https://www.npmjs.com/package/parse-url) [![Downloads](https://img.shields.io/npm/dt/parse-url.svg)](https://www.npmjs.com/package/parse-url) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> An advanced url parser supporting git urls too.

## :cloud: Installation

```sh
$ npm i --save parse-url
```


## :clipboard: Example



```js
// Dependencies
const parseUrl = require("parse-url");

console.log(parseUrl("http://ionicabizau.net/blog"));
// { protocols: [ 'http' ],
//   protocol: 'http',
//   port: null,
//   resource: 'ionicabizau.net',
//   user: '',
//   pathname: '/blog',
//   hash: '',
//   search: '',
//   href: 'http://ionicabizau.net/blog' }

console.log(parseUrl("http://domain.com/path/name?foo=bar&bar=42#some-hash"));
// { protocols: [ 'http' ],
//   protocol: 'http',
//   port: null,
//   resource: 'domain.com',
//   user: '',
//   pathname: '/path/name',
//   hash: 'some-hash',
//   search: 'foo=bar&bar=42',
//   href: 'http://domain.com/path/name?foo=bar&bar=42#some-hash' }

console.log(parseUrl("git+ssh://git@host.xz/path/name.git"));
// { protocols: [ 'git', 'ssh' ],
//   protocol: 'git',
//   port: null,
//   resource: 'host.xz',
//   user: 'git',
//   pathname: '/path/name.git',
//   hash: '',
//   search: '',
//   href: 'git+ssh://git@host.xz/path/name.git' }

console.log(parseUrl("git@github.com:IonicaBizau/git-stats.git"));
// { protocols: [],
//   protocol: 'ssh',
//   port: null,
//   resource: 'github.com',
//   user: 'git',
//   pathname: '/IonicaBizau/git-stats.git',
//   hash: '',
//   search: '',
//   href: 'git@github.com:IonicaBizau/git-stats.git' }
```

## :memo: Documentation


### `parseUrl(url)`
Parses the input url.

#### Params
- **String** `url`: The input url.

#### Return
- **Object** An object containing the following fields:
 - `protocols` (Array): An array with the url protocols (usually it has one element).
 - `protocol` (String): The first protocol, `"ssh"` (if the url is a ssh url) or `"file"`.
 - `port` (null|Number): The domain port.
 - `resource` (String): The url domain (including subdomains).
 - `user` (String): The authentication user (usually for ssh urls).
 - `pathname` (String): The url pathname.
 - `hash` (String): The url hash.
 - `search` (String): The url querystring value.
 - `href` (String): The input url.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`deploy-versioning`](https://npmjs.com/package/deploy-versioning)—Deploy your code keeping older versions.
 - [`git-up`](https://github.com/IonicaBizau/git-up)—A low level git url parser.
 - [`hubot-will-it-connect`](https://github.com/gambtho/hubot-will-it-connect#readme) (by gambtho)—Connects hubot with willitconnect, to validate CF's ability to connect to external resources
 - [`lien`](https://github.com/LienJS/Lien)—Another lightweight NodeJS framework. Lien is the link between request and response objects.
 - [`microbe.js`](https://github.com/Aweary/microbe.js) (by Brandon Dail)—A small Node.js framework for simple routing
 - [`tumblr-text`](https://npmjs.com/package/tumblr-text) (by cobaimelan)—[![Build Status](http://img.shields.io/travis/ayhankuru/tumblr-text.svg?style=flat-square)](https://travis-ci.org/ayhankuru/tumblr-text) [![Build Status](https://img.shields.io/david/ayhankuru/tumblr-text.svg?style=flat-square)](https://david-dm.org/ayhan
 - [`url-local`](https://github.com/IonicaBizau/url-local#readme)—Checks if a given url is a local url or not.

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2015#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
