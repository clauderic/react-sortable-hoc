# is-ssh [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![Version](https://img.shields.io/npm/v/is-ssh.svg)](https://www.npmjs.com/package/is-ssh) [![Downloads](https://img.shields.io/npm/dt/is-ssh.svg)](https://www.npmjs.com/package/is-ssh) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> Check if an input value is a ssh url or not.

## Installation

```sh
$ npm i --save is-ssh
```

## Example

```js
// Dependencies
const isSsh = require("is-ssh");

// Secure Shell Transport Protocol (SSH)
console.log(isSsh("ssh://user@host.xz:port/path/to/repo.git/"));
// true

console.log(isSsh("ssh://user@host.xz/path/to/repo.git/"));
// true

console.log(isSsh("ssh://host.xz:port/path/to/repo.git/"));
// true

console.log(isSsh("ssh://host.xz/path/to/repo.git/"));
// true

console.log(isSsh("ssh://user@host.xz/path/to/repo.git/"));
// true

console.log(isSsh("ssh://host.xz/path/to/repo.git/"));
// true

console.log(isSsh("ssh://user@host.xz/~user/path/to/repo.git/"));
// true

console.log(isSsh("ssh://host.xz/~user/path/to/repo.git/"));
// true

console.log(isSsh("ssh://user@host.xz/~/path/to/repo.git"));
// true

console.log(isSsh("ssh://host.xz/~/path/to/repo.git"));
// true

console.log(isSsh("user@host.xz:/path/to/repo.git/"));
// true

console.log(isSsh("user@host.xz:~user/path/to/repo.git/"));
// true

console.log(isSsh("user@host.xz:path/to/repo.git"));
// true

console.log(isSsh("host.xz:/path/to/repo.git/"));
// true

console.log(isSsh("host.xz:path/to/repo.git"));
// true

console.log(isSsh("host.xz:~user/path/to/repo.git/"));
// true

console.log(isSsh("rsync://host.xz/path/to/repo.git/"));
// true

// Git Transport Protocol
console.log(isSsh("git://host.xz/path/to/repo.git/"));
// false

console.log(isSsh("git://host.xz/~user/path/to/repo.git/"));
// false

// HTTP/S Transport Protocol
console.log(isSsh("http://host.xz/path/to/repo.git/"));
// false

console.log(isSsh("https://host.xz/path/to/repo.git/"));
// false

// Local (Filesystem) Transport Protocol
console.log(isSsh("/path/to/repo.git/"));
// false

console.log(isSsh("path/to/repo.git/"));
// false

console.log(isSsh("~/path/to/repo.git"));
// false

console.log(isSsh("file:///path/to/repo.git/"));
// false

console.log(isSsh("file://~/path/to/repo.git/"));
// false
```

## Documentation

### `isSsh(input)`
Checks if an input value is a ssh url or not.

#### Params
- **String|Array** `input`: The input url or an array of protocols.

#### Return
- **Boolean** `true` if the input is a ssh url, `false` otherwise.

## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:

 - [`git-up`](https://github.com/IonicaBizau/node-git-up)

## License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2015#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md