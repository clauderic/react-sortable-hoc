# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.10.1"></a>

## [1.10.1](https://github.com/clauderic/react-sortable-hoc/compare/v1.10.0...v1.10.1) (2019-08-22)

### Bug Fixes

- PropType definition for keyCodes was incorrect ([eaf5070](https://github.com/clauderic/react-sortable-hoc/commit/eaf5070))

<a name="1.10.0"></a>

# [1.10.0](https://github.com/clauderic/react-sortable-hoc/compare/v1.9.1...v1.10.0) (2019-08-22)

### Bug Fixes

- don't spread the keysToOmit parameter in omit util ([#563](https://github.com/clauderic/react-sortable-hoc/issues/563)) ([1c69772](https://github.com/clauderic/react-sortable-hoc/commit/1c69772))
- Fix broken UMD build ([#587](https://github.com/clauderic/react-sortable-hoc/issues/587)) ([6cb7750](https://github.com/clauderic/react-sortable-hoc/commit/6cb7750))
- remove browser field with umd bundle ([#541](https://github.com/clauderic/react-sortable-hoc/issues/541)) ([d3b30fd](https://github.com/clauderic/react-sortable-hoc/commit/d3b30fd)

### Features

- Add keyCodes prop to configure the keyboard shortcuts ([#588](https://github.com/clauderic/react-sortable-hoc/issues/588)) ([4c6d8dd](https://github.com/clauderic/react-sortable-hoc/commit/4c6d8dd))

<a name="1.9.1"></a>

## [1.9.1](https://github.com/clauderic/react-sortable-hoc/compare/v1.9.0...v1.9.1) (2019-04-24)

### Bug Fixes

- do not copy canvas context if it has neither width nor height ([#530](https://github.com/clauderic/react-sortable-hoc/issues/530)) ([3808437](https://github.com/clauderic/react-sortable-hoc/commit/3808437))
- pass isKeySorting to onSortOver and updateBeforeSortStart handler props ([#531](https://github.com/clauderic/react-sortable-hoc/issues/531)) ([763fd33](https://github.com/clauderic/react-sortable-hoc/commit/763fd33)

<a name="1.9.0"></a>

# [1.9.0](https://github.com/clauderic/react-sortable-hoc/compare/v1.8.3...v1.9.0) (2019-04-23)

### Bug Fixes

- issue with radio input name collision when cloning helper ([5337c97](https://github.com/clauderic/react-sortable-hoc/commit/5337c97))

### Features

- add support for keyboard sorting ([#501](https://github.com/clauderic/react-sortable-hoc/issues/501)) ([439b92f](https://github.com/clauderic/react-sortable-hoc/commit/439b92f))
- prevent sort start on contentEditable target ([d64c8cf](https://github.com/clauderic/react-sortable-hoc/commit/d64c8cf))

<a name="1.8.3"></a>

## [1.8.3](https://github.com/clauderic/react-sortable-hoc/compare/v1.8.2...v1.8.3) (2019-03-20)

### Bug Fixes

- issue with windowAsScrollContainer and translation offsets ([0391e62](https://github.com/clauderic/react-sortable-hoc/commit/0391e62))

### Features

- Add disableAutoscroll prop ([#484](https://github.com/clauderic/react-sortable-hoc/issues/484)) ([7845e76](https://github.com/clauderic/react-sortable-hoc/commit/7845e76))
- added helperContainer prop ([286eff4](https://github.com/clauderic/react-sortable-hoc/commit/286eff4))
- allow helperContainer prop to be a function returning an HTMLElement ([#489](https://github.com/clauderic/react-sortable-hoc/issues/489)) ([f4a9b4a](https://github.com/clauderic/react-sortable-hoc/commit/f4a9b4a))
- Detect scroll container automatically ([#507](https://github.com/clauderic/react-sortable-hoc/issues/507)) ([6572921](https://github.com/clauderic/react-sortable-hoc/commit/6572921))

<a name="1.8.2"></a>

## [1.8.2](https://github.com/clauderic/react-sortable-hoc/compare/v1.8.1...v1.8.2) (2019-03-19)

### Bug Fixes

- issue with getComputedStyle and getScrollingParent ([b104249](https://github.com/clauderic/react-sortable-hoc/commit/b104249))

<a name="1.8.1"></a>

## [1.8.1](https://github.com/clauderic/react-sortable-hoc/compare/v1.8.0...v1.8.1) (2019-03-18)

### Bug Fixes

- issue with cloning canvas context of dragged items ([#512](https://github.com/clauderic/react-sortable-hoc/issues/512)) ([4df34ad](https://github.com/clauderic/react-sortable-hoc/commit/4df34ad))

<a name="1.8.0"></a>

# [1.8.0](https://github.com/clauderic/react-sortable-hoc/compare/v1.1.0...v1.8.0) (2019-03-18)

### Bug Fixes

- added prop-types to peerDependencies ([0e855c5](https://github.com/clauderic/react-sortable-hoc/commit/0e855c5))
- copy canvas content into cloned node ([43ad122](https://github.com/clauderic/react-sortable-hoc/commit/43ad122))
- get updated index after updateBeforeSortStart ([4471a0a](https://github.com/clauderic/react-sortable-hoc/commit/4471a0a))
- helperContainer PropType definition broke server-side rendering ([#471](https://github.com/clauderic/react-sortable-hoc/issues/471)) ([c0eef97](https://github.com/clauderic/react-sortable-hoc/commit/c0eef97))
- lock axis story should not use lockToContainerEdges ([db1d3a9](https://github.com/clauderic/react-sortable-hoc/commit/db1d3a9))
- omit disableAutoscroll prop ([#502](https://github.com/clauderic/react-sortable-hoc/issues/502)) ([e994e73](https://github.com/clauderic/react-sortable-hoc/commit/e994e73))
- omit spreading helperContainer prop ([#497](https://github.com/clauderic/react-sortable-hoc/issues/497)) ([12bafdf](https://github.com/clauderic/react-sortable-hoc/commit/12bafdf))
- overflow bug while dragging an item upwards in a grid ([1a2c87e](https://github.com/clauderic/react-sortable-hoc/commit/1a2c87e))
- replace process.env.NODE_ENV in UMD builds ([16135df](https://github.com/clauderic/react-sortable-hoc/commit/16135df))
- update helperContainer prop type definition ([#491](https://github.com/clauderic/react-sortable-hoc/issues/491)) ([fd30383](https://github.com/clauderic/react-sortable-hoc/commit/fd30383))
- updated the behaviour of disabled elements ([bd3d041](https://github.com/clauderic/react-sortable-hoc/commit/bd3d041))
- virtualized collection grid bug ([a57975c](https://github.com/clauderic/react-sortable-hoc/commit/a57975c))

### Features

- Add disableAutoscroll prop ([#484](https://github.com/clauderic/react-sortable-hoc/issues/484)) ([7845e76](https://github.com/clauderic/react-sortable-hoc/commit/7845e76))
- added helperContainer prop ([286eff4](https://github.com/clauderic/react-sortable-hoc/commit/286eff4))
- allow helperContainer prop to be a function returning an HTMLElement ([#489](https://github.com/clauderic/react-sortable-hoc/issues/489)) ([f4a9b4a](https://github.com/clauderic/react-sortable-hoc/commit/f4a9b4a))
- Detect scroll container automatically ([#507](https://github.com/clauderic/react-sortable-hoc/issues/507)) ([6572921](https://github.com/clauderic/react-sortable-hoc/commit/6572921))

<a name="1.7.1"></a>

## [1.7.1](https://github.com/clauderic/react-sortable-hoc/compare/v1.1.0...v1.7.1) (2019-03-06)

### Bug Fixes

- updated the behaviour of disabled elements ([bd3d041](https://github.com/clauderic/react-sortable-hoc/commit/bd3d041))

<a name="1.7.0"></a>

# [1.7.0](https://github.com/clauderic/react-sortable-hoc/compare/v1.1.0...v1.7.0) (2019-03-06)

### Bug Fixes

- updated the behaviour of disabled elements ([bd3d041](https://github.com/clauderic/react-sortable-hoc/commit/bd3d041))

<a name="1.6.1"></a>

## [1.6.1](https://github.com/clauderic/react-sortable-hoc/compare/v1.6.0...v1.6.1) (2019-02-11)

### Bug Fixes

- omit disableAutoscroll prop ([#502](https://github.com/clauderic/react-sortable-hoc/issues/502)) ([e994e73](https://github.com/clauderic/react-sortable-hoc/commit/e994e73))

<a name="1.6.0"></a>

# [1.6.0](https://github.com/clauderic/react-sortable-hoc/compare/v1.5.3...v1.6.0) (2019-02-07)

### Features

- Add disableAutoscroll prop ([#484](https://github.com/clauderic/react-sortable-hoc/issues/484)) ([7845e76](https://github.com/clauderic/react-sortable-hoc/commit/7845e76))

<a name="1.5.4"></a>

## [1.5.4](https://github.com/clauderic/react-sortable-hoc/compare/v1.5.3...v1.5.4) (2019-02-07)

### Bug Fixes

- overflow bug while dragging an item upwards in a grid ([1a2c87e](https://github.com/clauderic/react-sortable-hoc/commit/1a2c87e))
- virtualized collection grid bug ([a57975c](https://github.com/clauderic/react-sortable-hoc/commit/a57975c))

<a name="1.5.3"></a>

## [1.5.3](https://github.com/clauderic/react-sortable-hoc/compare/v1.1.0...v1.5.3) (2019-01-25)

### Bug Fixes

- omit spreading helperContainer prop on WrappedComponent ([#497](https://github.com/clauderic/react-sortable-hoc/issues/497)) ([12bafdf](https://github.com/clauderic/react-sortable-hoc/commit/12bafdf))

<a name="1.5.2"></a>

## [1.5.2](https://github.com/clauderic/react-sortable-hoc/compare/v1.5.1...v1.5.2) (2019-01-22)

### Bug Fixes

- invalid helperContainer PropType definition ([#493](https://github.com/clauderic/react-sortable-hoc/issues/493)) ([dc1d18f](https://github.com/clauderic/react-sortable-hoc/commit/dc1d18f))

<a name="1.5.1"></a>

## [1.5.1](https://github.com/clauderic/react-sortable-hoc/compare/v1.5.0...v1.5.1) (2019-01-22)

### Bug Fixes

- update helperContainer prop type definition ([#491](https://github.com/clauderic/react-sortable-hoc/issues/491)) ([fd30383](https://github.com/clauderic/react-sortable-hoc/commit/fd30383))

<a name="1.5.0"></a>

# [1.5.0](https://github.com/clauderic/react-sortable-hoc/compare/v1.4.0...v1.5.0) (2019-01-22)

### Features

- allow helperContainer prop to be a function returning an HTMLElement ([f4a9b4a](https://github.com/clauderic/react-sortable-hoc/commit/f4a9b4a))

<a name="1.4.0"></a>

# [1.4.0](https://github.com/clauderic/react-sortable-hoc/compare/v1.3.0...v1.4.0) (2019-01-10)

### Bug Fixes

- Fix CommonJS and UMD builds by using Rollup and Babel to generate the bundles ([#474](https://github.com/clauderic/react-sortable-hoc/issues/474))

<a name="1.3.0"></a>

# [1.3.0](https://github.com/clauderic/react-sortable-hoc/compare/v1.2.0...v1.3.0) (2019-01-08)

### Bug Fixes

- helperContainer PropType definition broke server-side rendering ([#471](https://github.com/clauderic/react-sortable-hoc/issues/471)) ([c0eef97](https://github.com/clauderic/react-sortable-hoc/commit/c0eef97))

<a name="1.2.0"></a>

# [1.2.0](https://github.com/clauderic/react-sortable-hoc/compare/v1.1.0...v1.2.0) (2019-01-08)

### Features

- added helperContainer prop ([286eff4](https://github.com/clauderic/react-sortable-hoc/commit/286eff4))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/clauderic/react-sortable-hoc/compare/v1.0.0...v1.1.0) (2019-01-07)

### Features

- added updateBeforeSortStart prop ([162857b](https://github.com/clauderic/react-sortable-hoc/commit/162857b))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/clauderic/react-sortable-hoc/compare/v0.8.4...v1.0.0) (2019-01-07)

### BREAKING CHANGES

- The UMD release no longer includes babel-polyfill, you will need to include your own polyfills in order to support older browsers.

# 0.8.4

- Fix a bug when you use SortableHandle and distance prop [#447](https://github.com/clauderic/react-sortable-hoc/pull/447)

# 0.8.3

- Fix: TouchEvent is undefined in certain browsers, such as Safari [#382](https://github.com/clauderic/react-sortable-hoc/issues/382)

# 0.8.1

- Fix scrolling issues on mobile with anchor tag elements [#380](https://github.com/clauderic/react-sortable-hoc/pull/380)
- Update TypeScript type definition for ContainerGetter to accept Promises that return HTMLElements

# 0.8.0

- Allow `getContainer` to return a promise. This is useful when the container node is rendered by a parent component, since `componentDidMount` fires backwards (from child to parent) [#155](https://github.com/clauderic/react-sortable-hoc/pull/155/)

# 0.7.4

- Fix typo in getLockPixelOffset helper

# 0.7.3

- Fix issues with distance and pressThreshold props on mobile [#378](https://github.com/clauderic/react-sortable-hoc/pull/378)

# 0.7.2

- Fix issues with TypeScript type definitions

# 0.7.1

- Provide TypeScript type definitions out of the box [#377](https://github.com/clauderic/react-sortable-hoc/pull/377)
- Fix potential issues with calling `removeEventListeners` on `componentWillUnmount` if the container node has already unmounted [#376](https://github.com/clauderic/react-sortable-hoc/pull/376)

# 0.7.0

- [Breaking change] Removed lodash dependency. For users wishing to support Internet Explorer, a [polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find#Polyfill) for Array.prototype.find will be required
- Added `onSortOver` prop that gets invoked when sorting over an element [#278](https://github.com/clauderic/react-sortable-hoc/pull/278)
- Fix `useWindowAsScrollContainer` [#306](https://github.com/clauderic/react-sortable-hoc/pull/306)

# 0.6.8

Update react and react-dom peerdependency requirements for React 16+ [#283](https://github.com/clauderic/react-sortable-hoc/pull/283). Thanks [@jnsdls](https://github.com/jnsdls)!

# 0.6.7

Fixes issues with Jest Snapshot testing trying to serialize the `window` object and running out of memory [#249](https://github.com/clauderic/react-sortable-hoc/issues/249). Thanks [@cameronmcefee](https://github.com/cameronmcefee)!

# 0.6.6

Fixes an issue with Internet Explorer 11 introduced in `0.6.5` [#248](https://github.com/clauderic/react-sortable-hoc/pull/248). Thanks [@humiston](https://github.com/humiston)!

# 0.6.5

Fixes the position of the sortable helper when the page is scrolled [#213](https://github.com/clauderic/react-sortable-hoc/pull/213)

# 0.6.4

Fix: when cloning the element that is being sorted, we no longer update the value of cloned file inputs [#232](https://github.com/clauderic/react-sortable-hoc/pull/232)

# 0.6.3

Fixes issues caused by a disabled SortableElement being moved when `distance` is set to a value other than `0`

# 0.6.2

Use `prop-types` package for PropType validation for compatibility with React ^15.5

# 0.6.1

Tweak: default to `pointerEvents: none` on sortable helper, this way the underlying view can still be scrolled using the trackpad/mousewheel while sorting [#160](https://github.com/clauderic/react-sortable-hoc/pull/160)

# 0.6.0

Feature: added `pressThreshold` prop to make `pressDelay` fault tolerant [#159](https://github.com/clauderic/react-sortable-hoc/pull/159)

# 0.5.0

Tweak: `button` elements are now included in the default `shouldCancelStart` implementation [#142](https://github.com/clauderic/react-sortable-hoc/pull/142).
Fix: Omit `getHelperDimensions` before passing down props in `SortableContainer`

# 0.4.12

Fix: This release fixes some issues caused by the `onSortEnd` callback being invoked before `setState` [#82](https://github.com/clauderic/react-sortable-hoc/issues/82).

# 0.4.10

Fix: This version fixes issues with nested `SortableContainer` elements using drag handles from also dragging their parent [#112](https://github.com/clauderic/react-sortable-hoc/issues/112), #127(https://github.com/clauderic/react-sortable-hoc/pull/127). Thanks [@DeadHeadRussell](https://github.com/DeadHeadRussell)!

# 0.4.9

Fix: This release fixes a bug introduced in `0.4.8` caused by calling the `forEach` method directly on a NodeList, which is undefined in a number of browsers [#125](https://github.com/clauderic/react-sortable-hoc/issues/125)

# 0.4.8

Fix: Added logic to ensure that `select`, `input` and `textarea` fields in `SortableElement` always retain their `value` when the element is cloned (this happens when sorting begins) [#122](https://github.com/clauderic/react-sortable-hoc/issues/122) [#123](https://github.com/clauderic/react-sortable-hoc/pull/123). Thanks [@tomasztomys](https://github.com/tomasztomys)!

# 0.4.7

Fix: This release fixes a bug in Firefox caused by active anchor tags preventing mousemove events from being fired [#118](https://github.com/clauderic/react-sortable-hoc/issues/118)

# 0.4.5

Fix: getHelperDimensions height was not being used (Thanks [@SMenigat](https://github.com/SMenigat)!)

# 0.4.4

Tweak: cherry-picking lodash methods instead of importing the entire bundle (slipped by in a PR, thanks for pointing this out [@arackaf](https://github.com/arackaf)!)

# 0.4.3

Fixes an edge-case bug in Firefox where window.getComputedStyle() returns null inside an iframe with `display: none` [#106](https://github.com/clauderic/react-sortable-hoc/pull/106). Thanks [@funnel-mark](https://github.com/funnel-mark)!

# 0.4.2

Fixes an issue when attempting to sort items while rapidly moving the mouse. By setting an immediate timer, we move the cancel event to the tail of the timer queue, and ensure that it is fired after the pressTimer [#80](https://github.com/clauderic/react-sortable-hoc/pull/80). Thanks [@v0lkan](https://github.com/v0lkan)!

# 0.4.0

- Fix a timing issue in Chrome caused by setTimeout [#71](https://github.com/clauderic/react-sortable-hoc/pull/71)
- Private props are no longer passed down to the wrapped component [#98](https://github.com/clauderic/react-sortable-hoc/pull/98)

# 0.3.0

Added grid support for elements of equal widths / heights [#4](https://github.com/clauderic/react-sortable-hoc/issues/4) [#86](https://github.com/clauderic/react-sortable-hoc/pull/86). Huge shout-out to [@richmeij](https://github.com/richmeij) for making this happen!

# 0.2.0

Add a `getHelperDimensions` prop to control SortableHelper size [#83](https://github.com/clauderic/react-sortable-hoc/issues/83). Thanks [@nervetattoo](https://github.com/nervetattoo)!

# 0.1.1

Added `touchCancel` listener to properly handle canceled touches [#73](https://github.com/clauderic/react-sortable-hoc/pull/73)

# 0.1.0

- Force `box-sizing: border-box` on sortable helper [#67](https://github.com/clauderic/react-sortable-hoc/issues/67)
- Support changing an item's collection prop on the fly [#66](https://github.com/clauderic/react-sortable-hoc/pull/66)

# 0.0.11

Utilize babel-plugin-transform-runtime to utilize `babelHelpers` without them being required in application code [#45](https://github.com/clauderic/react-sortable-hoc/issues/45)

# 0.0.10

The `arrayMove` helper no longer mutates the array, it now returns a new array [#61](https://github.com/clauderic/react-sortable-hoc/issues/61)

# 0.0.9

Server-side rendering bugfix: safeguard against `document` being undefined [#59](https://github.com/clauderic/react-sortable-hoc/pull/59)

# 0.0.8

- Added `distance` prop ([#35](https://github.com/clauderic/react-sortable-hoc/issues/35))
- Added a `shouldCancelStart` ([#47](https://github.com/clauderic/react-sortable-hoc/issues/47), [#36](https://github.com/clauderic/react-sortable-hoc/issues/36), [#41](https://github.com/clauderic/react-sortable-hoc/issues/41)) prop to programatically cancel sorting before it begins.
- Prevent right click from causing sort start ([#46](https://github.com/clauderic/react-sortable-hoc/issues/46))

# 0.0.7

Fixes server-side rendering (window undefined) ([#39](https://github.com/clauderic/react-sortable-hoc/issues/39))

# 0.0.6

- Added support for a custom container ([#37](https://github.com/clauderic/react-sortable-hoc/issues/37))
- Fix changing disable property while receiving props ([#34](https://github.com/clauderic/react-sortable-hoc/issues/34))
