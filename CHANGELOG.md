Changelog
------------
### 0.0.9
Server-side rendering bugfix: safeguard against `document` being undefined [#59](https://github.com/clauderic/react-sortable-hoc/pull/59)

### 0.0.8
- Added `distance` prop ([#35](https://github.com/clauderic/react-sortable-hoc/issues/35))
- Added a `shouldCancelStart` ([#47](https://github.com/clauderic/react-sortable-hoc/issues/47), [#36](https://github.com/clauderic/react-sortable-hoc/issues/36), [#41](https://github.com/clauderic/react-sortable-hoc/issues/41)) prop to programatically cancel sorting before it begins.
- Prevent right click from causing sort start ([#46](https://github.com/clauderic/react-sortable-hoc/issues/46))

### 0.0.7
Fixes server-side rendering (window undefined) ([#39](https://github.com/clauderic/react-sortable-hoc/issues/39))

### 0.0.6
- Added support for a custom container ([#37](https://github.com/clauderic/react-sortable-hoc/issues/37))
- Fix changing disable property while receiving props ([#34](https://github.com/clauderic/react-sortable-hoc/issues/34))
