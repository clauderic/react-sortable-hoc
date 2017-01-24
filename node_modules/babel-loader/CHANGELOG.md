# Changelog

## v6.2.2
  * Update peerDependencies to accept webpack 2 [#208](https://github.com/babel/babel-loader/pull/208)
  * Remove duplicated dependencies

## v6.2.0
  * Pass true filenames [#106](https://github.com/babel/babel-loader/issues/106)
  * Remove babel-core from devDependencies

## v6.1.0

  * Merge [PR #146](https://github.com/babel/babel-loader/pull/146) Set source file name relative to options.sourceRoot
  * Merge [PR #136](https://github.com/babel/babel-loader/pull/136) use container-based infrastructure for faster build
  * Merge [PR #121](https://github.com/babel/babel-loader/pull/121) Make babelrc configurable
  * Merge [PR #113](https://github.com/babel/babel-loader/pull/113) Include BABEL_ENV || NODE_ENV in cacheIdentifier

## v6.0.1

  * Update to babel v6.

## v5.3.1

  * Merge [PR #85](https://github.com/babel/babel-loader/pull/85) - Don't override sourcemap if sourcesContent already exists.


## v5.3.1

  * Merge [PR #82](https://github.com/babel/babel-loader/pull/82) - Fallback global options to empty object to avoid conflicts with object-assign polyfill.

## v5.3.0

  * Merge [PR #79](https://github.com/babel/babel-loader/pull/79) - This should allow babel-loader to work with [enhanced-require](https://github.com/webpack/enhanced-require).

## v5.2.0

  * Include `.babelrc` file into the `cacheIdentifier` if it exists
