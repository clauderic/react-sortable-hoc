1.5.0 / 2015-12-27
=================
  * [New] adds `Symbol.toPrimitive` support via `es-to-primitive`
  * [Deps] update `is-callable`, `es-to-primitive`
  * [Dev Deps] update `jscs`, `nsp`, `eslint`, `@ljharb/eslint-config`, `semver`, `tape`
  * [Tests] up to `node` `v5.3`

1.4.3 / 2015-11-04
=================
  * [Fix] `ES6.ToNumber`: should give `NaN` for explicitly signed hex strings (#4)
  * [Refactor] `ES6.ToNumber`: No need to double-trim
  * [Refactor] group tests better
  * [Tests] should still pass on `node` `v0.8`

1.4.2 / 2015-11-02
=================
  * [Fix] ensure `ES.ToNumber` trims whitespace, and does not trim non-whitespace (#3)

1.4.1 / 2015-10-31
=================
  * [Fix] ensure only 0-1 are valid binary and 0-7 are valid octal digits (#2)
  * [Dev Deps] update `tape`, `jscs`, `nsp`, `eslint`, `@ljharb/eslint-config`
  * [Tests] on `node` `v5.0`
  * [Tests] fix npm upgrades for older node versions
  * package.json: use object form of "authors", add "contributors"

1.4.0 / 2015-09-26
=================
  * [Deps] update `is-callable`
  * [Dev Deps] update `tape`, `jscs`, `eslint`, `@ljharb/eslint-config`
  * [Tests] on `node` `v4.2`
  * [New] Add `SameValueNonNumber` to ES7

1.3.2 / 2015-09-26
=================
  * [Fix] Fix `ES6.IsRegExp` to properly handle `Symbol.match`, per spec.
  * [Tests] up to `io.js` `v3.3`, `node` `v4.1`
  * [Dev Deps] update `tape`, `jscs`, `nsp`, `eslint`, `@ljharb/eslint-config`, `semver`

1.3.1 / 2015-08-15
=================
  * [Fix] Ensure that objects that `toString` to a binary or octal literal also convert properly

1.3.0 / 2015-08-15
=================
  * [New] ES6’s ToNumber now supports binary and octal literals.
  * [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config`, `tape`
  * [Docs] Switch from vb.teelaun.ch to versionbadg.es for the npm version badge SVG
  * [Tests] up to `io.js` `v3.0`

1.2.2 / 2015-07-28
=================
  * [Fix] Both `ES5.CheckObjectCoercible` and `ES6.RequireObjectCoercible` return the value if they don't throw.
  * [Tests] Test on latest `io.js` versions.
  * [Dev Deps] Update `eslint`, `jscs`, `tape`, `semver`, `covert`, `nsp`

1.2.1 / 2015-03-20
=================
  * Fix `isFinite` helper.

1.2.0 / 2015-03-19
=================
  * Use `es-to-primitive` for ToPrimitive methods.
  * Test on latest `io.js` versions; allow failures on all but 2 latest `node`/`io.js` versions.

1.1.2 / 2015-03-20
=================
  * Fix isFinite helper.

1.1.1 / 2015-03-19
=================
  * Fix isPrimitive check for functions
  * Update `eslint`, `editorconfig-tools`, `semver`, `nsp`

1.1.0 / 2015-02-17
=================
  * Add ES7 export (non-default).
  * All grade A-supported `node`/`iojs` versions now ship with an `npm` that understands `^`.
  * Test on `iojs-v1.2`.

1.0.1 / 2015-01-30
=================
  * Use `is-callable` instead of an internal function.
  * Update `tape`, `jscs`, `nsp`, `eslint`

1.0.0 / 2015-01-10
=================
  * v1.0.0
