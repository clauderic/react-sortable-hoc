
[![git-url-parse](http://i.imgur.com/HlfMsVf.png)](#)

# git-url-parse [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![Travis](https://img.shields.io/travis/IonicaBizau/git-url-parse.svg)](https://travis-ci.org/IonicaBizau/git-url-parse/) [![Version](https://img.shields.io/npm/v/git-url-parse.svg)](https://www.npmjs.com/package/git-url-parse) [![Downloads](https://img.shields.io/npm/dt/git-url-parse.svg)](https://www.npmjs.com/package/git-url-parse) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> A high level git url parser for common git providers.

## :cloud: Installation

```sh
$ npm i --save git-url-parse
```


## :clipboard: Example



```js
// Dependencies
const GitUrlParse = require("git-url-parse");

console.log(GitUrlParse("git@github.com:IonicaBizau/node-git-url-parse.git"));
// => {
//     protocols: []
//   , port: null
//   , resource: "github.com"
//   , user: "git"
//   , pathname: "/IonicaBizau/node-git-url-parse.git"
//   , hash: ""
//   , search: ""
//   , href: "git@github.com:IonicaBizau/node-git-url-parse.git"
//   , token: ""
//   , protocol: "ssh"
//   , toString: [Function]
//   , source: "github.com"
//   , name: "node-git-url-parse"
//   , owner: "IonicaBizau"
// }

console.log(GitUrlParse("https://github.com/IonicaBizau/node-git-url-parse.git"));
// => {
//     protocols: ["https"]
//   , port: null
//   , resource: "github.com"
//   , user: ""
//   , pathname: "/IonicaBizau/node-git-url-parse.git"
//   , hash: ""
//   , search: ""
//   , href: "https://github.com/IonicaBizau/node-git-url-parse.git"
//   , token: ""
//   , protocol: "https"
//   , toString: [Function]
//   , source: "github.com"
//   , name: "node-git-url-parse"
//   , owner: "IonicaBizau"
// }

console.log(GitUrlParse("https://github.com/IonicaBizau/node-git-url-parse.git").toString("ssh"));
// => "git@github.com:IonicaBizau/node-git-url-parse.git"

console.log(GitUrlParse("git@github.com:IonicaBizau/node-git-url-parse.git").toString("https"));
// => "https://github.com/IonicaBizau/node-git-url-parse.git"
```

## :memo: Documentation


### `gitUrlParse(url)`
Parses a Git url.

#### Params
- **String** `url`: The Git url to parse.

#### Return
- **GitUrl** The `GitUrl` object containing:
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
 - `source` (String): The Git provider (e.g. `"github.com"`).
 - `owner` (String): The repository owner.
 - `name` (String): The repository name.
 - `full_name` (String): The owner and name values in the `owner/name` format.
 - `toString` (Function): A function to stringify the parsed url into another url type.
 - `organization` (String): The organization the owner belongs to. This is CloudForge specific.

### `stringify(obj, type)`
Stringifies a `GitUrl` object.

#### Params
- **GitUrl** `obj`: The parsed Git url object.
- **String** `type`: The type of the stringified url (default `obj.protocol`).

#### Return
- **String** The stringified url.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`autorelease-setup`](https://github.com/tyler-johnson/autorelease-setup#readme) (by Tyler Johnson)—A CLI tool for setting up a repository with autorelease.
 - [`documentation`](https://github.com/documentationjs/documentation#readme) (by Tom MacWright)—a documentation generator
 - [`download-repo-cli`](https://github.com/egoist/download-repo-cli#readme) (by EGOIST)—CLI tool to download GitHub repo.
 - [`generator-nm-bti`](https://gitlab.com/beneaththeink/generator-nm-bti#README) (by Tyler Johnson)—Scaffold out a node module, Beneath the Ink style.
 - [`git-issues`](https://github.com/softwarescales/git-issues) (by Gabriel Petrovay)—Git issues extension to list issues of a Git project
 - [`git-source`](https://github.com/IonicaBizau/git-source#readme)—Parse and stringify git urls in a friendly way.
 - [`github-publish-npm`](https://github.com/ofersadgat/github-publish-npm) (by Ofer Sadgat)—This will upload publish npm assets to the GitHub Releases API.
 - [`gtni`](https://nmrony.github.io/gtni) (by Nur Mohammed Rony)—Install your all npm dependencies recursively with gtni while you are doing git clone, fetch or pull
 - [`nodeschool-admin`](https://github.com/nodeschool/admin#readme) (by Martin Heidegger)—CLI tool for setting up and maintaining a nodeschool chapters and other things.
 - [`ogh`](https://github.com/egoist/ogh#readme) (by EGOIST)—Open GitHub Page of your repo directly in Terminal.
 - [`pr-log`](https://github.com/lo1tuma/pr-log#readme) (by Mathias Schreck)—Changelog generator based on GitHub Pull Requests
 - [`smart-clone`](https://github.com/ethernetdan/smart-clone#readme)—Clone a directory into a Golang style directory structure
 - [`ssh-remote`](https://github.com/IonicaBizau/ssh-remote)—Automagically switch on the SSH remote url in a Git repository.
 - [`strapper`](https://npmjs.com/package/strapper) (by Sam Newman)—Coming Soon

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2015#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
