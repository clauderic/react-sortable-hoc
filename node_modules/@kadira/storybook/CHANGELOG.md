## Changelog

### v1.41.0

* Fix nodejs require errors [#337](https://github.com/kadirahq/react-storybook/pull/337).
* Add getStorybook method to client API [#332](https://github.com/kadirahq/react-storybook/pull/332).

### v1.40.0

* Fix duplicate decorator bug [#335](https://github.com/kadirahq/react-storybook/pull/335).

### v1.39.1

* Update babel packages [#325](https://github.com/kadirahq/react-storybook/pull/325).
* Hide HMR info logs [#331](https://github.com/kadirahq/react-storybook/pull/331).

### v1.39.0

* Update @kadira/storybook-ui to get featues from [v2.5.0](https://github.com/kadirahq/storybook-ui/blob/master/CHANGELOG.md#v250) and [v2.6.0](https://github.com/kadirahq/storybook-ui/blob/master/CHANGELOG.md#v260).

### v1.38.3

* Add names for action and linkTo functions [#321](https://github.com/kadirahq/react-storybook/pull/321).

### v1.38.2

* Fix error in prepublish script [#319](https://github.com/kadirahq/react-storybook/pull/319).

### v1.38.1

* Improve Windows support by writing prepublish script using shelljs [#308](https://github.com/kadirahq/react-storybook/pull/308).

### v1.38.0

* v1.37.0 was a nightmare since it contains the npm-shrinkwrap.json. Fixed by removing it. See: [#306](https://github.com/kadirahq/react-storybook/issues/306) and [#305](https://github.com/kadirahq/react-storybook/pull/305).

### v1.37.0

* Update @kadira/storybook-ui to 2.4.0

### v1.36.0

* Support watchOptions configuration. See: [PR287](https://github.com/kadirahq/react-storybook/pull/287)

### v1.35.2

* Add missing font-face to the ErrorDisplay's heading.

### v1.35.1

* Fix issue related to bad error handling. See issue [#275](https://github.com/kadirahq/react-storybook/issues/275):

### v1.35.0

* Add fuzzy search powered search box and Redux DevTools support via [@kadira/storybook-ui@2.3.0](https://github.com/kadirahq/storybook-ui/blob/master/CHANGELOG.md#v230).

### v1.34.1

* Don't always override NODE_ENV in build-storybook. [PR272](https://github.com/kadirahq/react-storybook/pull/272)

### v1.34.0

* Use storybook-ui v2.2.0 which puts shortcut state into the URL.

### v1.33.0

* Introduce an [extension API](https://github.com/kadirahq/react-storybook/blob/master/docs/extensions.md) for React Storybook. See: [PR258](https://github.com/kadirahq/react-storybook/pull/258)

### v1.32.1

* Extend @kadira/storybook-ui provider from it's base Provider.

### v1.32.0

* Use @kadira/storybook-ui as the manager UI with the implemented provider for React. See `client/manager` for more info.

### v1.31.0

* Pass a `context` argument to stories [PR250](https://github.com/kadirahq/react-storybook/pull/250)

### v1.30.0

* Fuzzy search kinds [PR247](https://github.com/kadirahq/react-storybook/pull/247)

### v1.29.5

* Update dependency version to fix filter crash [PR246](https://github.com/kadirahq/react-storybook/pull/246)

### v1.29.4

* Protect index.html/iframe.html from being overwritten [PR243](https://github.com/kadirahq/react-storybook/pull/243)

### v1.29.3

* Update @kadira/storybook-core version [PR241](https://github.com/kadirahq/react-storybook/pull/241)
* Add es6-shim by default [PR238](https://github.com/kadirahq/react-storybook/pull/238)

### v1.29.2

* Use url.resolve instead of path.join [PR240](https://github.com/kadirahq/react-storybook/pull/240)

### v1.29.1

* Copy missed manager.js.map file on static build [PR236](https://github.com/kadirahq/react-storybook/pull/236)

### v1.29.0

* Multiple static dirs (comma separated) [PR229](https://github.com/kadirahq/react-storybook/pull/229)

### v1.28.5

* Support ECMAScript stage-0 [PR228](https://github.com/kadirahq/react-storybook/pull/228) to fix [Issue #227](https://github.com/kadirahq/react-storybook/issues/227)

### v1.28.4

* Support custom webpack public path for dev-server and static build started by [PR226](https://github.com/kadirahq/react-storybook/pull/226)

### v1.28.3

* Revert [PR226](https://github.com/kadirahq/react-storybook/pull/226)

### v1.28.2

* Support custom webpack publicPath [PR226](https://github.com/kadirahq/react-storybook/pull/226)

### v1.28.1

* Add charset meta tags to HTML heads [PR216](https://github.com/kadirahq/react-storybook/pull/216)

### v1.28.0

* Moved storybook serving code into a middleware to support more advanced use cases.
* Refactored dev server to use storybook middleware [PR211](https://github.com/kadirahq/react-storybook/pull/211)

### v1.27.0

* Move modules to storybook-core repo. [PR196](https://github.com/kadirahq/react-storybook/pull/196)
* Add stack-source-map again only for Chrome to get better error stacks.
* Add ability to control the hostname. See [PR195](https://github.com/kadirahq/react-storybook/pull/195) and [PR198](https://github.com/kadirahq/react-storybook/pull/198)

### v1.26.0
12-May-2016

* Ensure asset directory exists in the static-builder.

### v1.25.0
11-May-2016

* Fix several publishing related issues. See: [#188](https://github.com/kadirahq/react-storybook/pull/188).
* Fix babel extends issue. See: [PR185](https://github.com/kadirahq/react-storybook/pull/185).
* Fix issue with removing a preset from users babelrc.
  * Fixes: [#183](https://github.com/kadirahq/react-storybook/issues/183).
  * [PR184](https://github.com/kadirahq/react-storybook/pull/184)
* Make left panel scrollable with keeping the filterbox always. See: [PR182](https://github.com/kadirahq/react-storybook/pull/182).
* Add `qs` as a direct dependency as it's used in preview.

### v1.24.0
10-May-2016

* Add a potential fix for the double scrollbar issue. See: [179](https://github.com/kadirahq/react-storybook/issues/179).
* Add scrolling support to the left panel. Fixes [#177](https://github.com/kadirahq/react-storybook/issues/177).
* Remove NODE_ENV=production flag. Fixes [#158](https://github.com/kadirahq/react-storybook/issues/158)

### v1.23.0
09-May-2016

* Add shortcuts to jump to previous and next stories. See [PR176](https://github.com/kadirahq/react-storybook/pull/176)
* Fix loader concatentation bug specially when custom config doesn't have a loaders section. [PR173](https://github.com/kadirahq/react-storybook/pull/173)

### v1.22.1
06-May-2016

* Add a potential fix for [#167](https://github.com/kadirahq/react-storybook/issues/167)
  * basically, this moved back babel-packages required by webpack.

### v1.22.0
06-May-2016

* Improve the static builder time.

### v1.21.0
06-May-2016

* Add configType argument to custom config function. See: [PR169](https://github.com/kadirahq/react-storybook/pull/169)
* Add the unicode version of the Keyboard Shortcut Icon. See: [PR170](https://github.com/kadirahq/react-storybook/pull/170)

### v1.20.0
05-May-2016

* Allow to configure webpack as the user wants. See [PR160](https://github.com/kadirahq/react-storybook/pull/160)
* Add typescript typings support for the core API. See [PR157](https://github.com/kadirahq/react-storybook/pull/157)
* Implement Mantra architecture and some new features including permalinks, full screen support. See: [PR165](https://github.com/kadirahq/react-storybook/pull/165)
* Remove some typo in docs. See: [PR154](https://github.com/kadirahq/react-storybook/pull/154)
* Move UI testing libraries to devDependencies. See: [PR153](https://github.com/kadirahq/react-storybook/pull/153)

### v1.19.0
27-April-2016

* Add airbnb-js-shims to client-side JS. See: [PR147](https://github.com/kadirahq/react-storybook/pull/147)
* Remove self-closing div tag, which is invalid HTML. See: [PR148](https://github.com/kadirahq/react-storybook/pull/148)
* Search for a .babelrc in the storybook config directory first, then the project root. See: [PR149](https://github.com/kadirahq/react-storybook/pull/149)

### v1.18.0
26-April-2016

* Link React Storybook menu to the repo. See: [PR137](https://github.com/kadirahq/react-storybook/pull/137)
* Implement keyboard shortcuts and fuzzy search. See: [PR141](https://github.com/kadirahq/react-storybook/pull/141)

### v1.17.2
25-April-2016

* Fix an error which only occurs on Firefox. See: [PR144](https://github.com/kadirahq/react-storybook/pull/144)

### v1.17.1
21-April-2016

* Fix a regression introduce by `v1.17.0`. See: [PR133](https://github.com/kadirahq/react-storybook/pull/133)

### v1.17.0
21-April-2016

* Check all the arguments passed to action for events. See: [PR132](https://github.com/kadirahq/react-storybook/pull/132)

### v1.16.1
21-April-2016

* Fix action logs highlighting issue, which comes as a regression of [PR126](https://github.com/kadirahq/react-storybook/pull/126).

### v1.16.0
20-April-2016

* Prevent re-rendering the preview iframe when there is an action.
  * Related issue: [#116](https://github.com/kadirahq/react-storybook/issues/116)
  * Related PR: [PR126](https://github.com/kadirahq/react-storybook/pull/126)

### v1.15.0
20-April-2016

* Improve action logger UI and increase max log count to 10. See [PR123](https://github.com/kadirahq/react-storybook/pull/123)

### v1.14.0
19-April-2016

* Add syntax highlights to the logger. See: [PR118](https://github.com/kadirahq/react-storybook/pull/118)

### v1.13.0

* Add some UI test cases. See [PR103](https://github.com/kadirahq/react-storybook/pull/103)
* Implement `.addDecorator()` API. See [PR115](https://github.com/kadirahq/react-storybook/pull/115)
* Add code folding support. See [PR111](https://github.com/kadirahq/react-storybook/pull/111)

### v1.12.0
14-April-2016

* Add support for webpack module preLoaders. See: [PR107](https://github.com/kadirahq/react-storybook/pull/107)

### v1.11.0
13-April-2016

* Add support for React DevTools. See: [PR104](https://github.com/kadirahq/react-storybook/pull/104)

### v1.10.2
12-April-2016

Fix various issues related to static bundling.

* Add custom head generation to static build as well.
* Use relative urls so, static sites can be host with paths (GH Pages)
* Identify SyntheticEvent using feature detection. UglifyJS mangal class names, so we can't use classnames to detect a SyntheticEvent in the static build.

### v1.10.1

* Don't serve index.html in static directory as a site index. See [PR100](https://github.com/kadirahq/react-storybook/pull/100)
* Use cjson for parsing .babelrc files (support comments). See [PR98](https://github.com/kadirahq/react-storybook/pull/98)
* Remove the dist directory before running babel to avoid older code. See [PR101](https://github.com/kadirahq/react-storybook/pull/101)

### v1.10.0

* Add custom head support inside the iframe. See [PR77](https://github.com/kadirahq/react-storybook/pull/77)
* Unmount components before rendering into DOM node. Fix: [#81](https://github.com/kadirahq/react-storybook/issues/81)
* Add a static file builder. See [PR88](https://github.com/kadirahq/react-storybook/pull/88)
* Fix search box's lineHeight to work with all the browsers. See: [PR94](https://github.com/kadirahq/react-storybook/pull/94)
* Add the search box. See: [PR91](https://github.com/kadirahq/react-storybook/pull/91).

### v1.9.0

Add some minor improvements.

* Avoid deprecated warning in Chrome Canary. See: [PR85](https://github.com/kadirahq/react-storybook/pull/85)
* Fix the React Warning about CSS property. See: [PR84](https://github.com/kadirahq/react-storybook/pull/84)
* Transition on latest logged action. See: [PR80](https://github.com/kadirahq/react-storybook/pull/80)

### v1.8.0

* Add story linking functionality.
  * [Documentation](https://github.com/kadirahq/react-storybook/blob/master/docs/api.md#linking-stories).
  * Original feature request: [#50](https://github.com/kadirahq/react-storybook/issues/50)
  * Implementation: [PR86](https://github.com/kadirahq/react-storybook/pull/86)

### v1.7.0

* Add support to React v15.0.0.

### v1.6.0

* Make scrollable layout. See: [PR](https://github.com/kadirahq/react-storybook/pull/70)
* Add npm3 requirement to the `package.json`.
* Add `react` and `react-dom` to devDependencies.

### v1.5.0

* Add support for most of the custom webpack configuration. See [PR64](https://github.com/kadirahq/react-storybook/pull/64)

### v1.4.0

* Add CLI option to specify the config dir. See [PR52](https://github.com/kadirahq/react-storybook/pull/52).

### v1.3.0

* Load the `.babelrc` manually. Fixed: [#41](https://github.com/kadirahq/react-storybook/issues/41)
* Add a better contributing guide. See [CONTRIBUTING.md](https://github.com/kadirahq/react-storybook/blob/master/CONTRIBUTING.md)
* Add a development utility `npm run dev` which watches "src" directory and run `npm run prepublish`.

### v1.2.0

* Add a button to clear logs in the ActionLogger. This is requested in [PR21](https://github.com/kadirahq/react-storybook/issues/21).
* Remove navigation list order hijacking. See [commit](https://github.com/kadirahq/react-storybook/commit/166365fd38f51f79e69e028a1c11e2620eddcb99).
* Fix a typo in .gitignore. See [PR31](https://github.com/kadirahq/react-storybook/pull/31).
* Add support for JSX. See [PR18](https://github.com/kadirahq/react-storybook/pull/18).

### v1.1.0

* v1.0.0 was a mistake and it contains very old code. That's why we had to do a 1.1.0 release.

### v1.0.0

* Yeah!
