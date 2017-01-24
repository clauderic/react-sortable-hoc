1.0.3 / 2015-01-29
=================
  * If @@toStringTag is not present, use the old-school Object#toString test.

1.0.2 / 2015-01-29
=================
  * Improve optimization by separating the try/catch, and bailing out early when not typeof "object".

1.0.1 / 2015-01-28
=================
  * Update `jscs`, `tape`, `covert`
  * Use RegExp#exec to test if something is a regex, which works even with ES6 @@toStringTag.

1.0.0 / 2014-05-19
=================
  * Initial release.
