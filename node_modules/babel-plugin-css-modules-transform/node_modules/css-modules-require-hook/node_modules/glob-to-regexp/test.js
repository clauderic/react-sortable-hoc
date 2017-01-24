var globToRegexp = require("./index.js");
var assert = require("assert");

function assertMatch(glob, str, opts) {
  assert.ok(globToRegexp(glob, opts).test(str));
}

function assertNotMatch(glob, str, opts) {
  assert.equal(false, globToRegexp(glob, opts).test(str));
}

// Match everything
assertMatch("*", "foo");
assertMatch("*", "foo", { flags: 'g' });

// Match the end
assertMatch("f*", "foo");
assertMatch("f*", "foo", { flags: 'g' });

// Match the start
assertMatch("*o", "foo");
assertMatch("*o", "foo", { flags: 'g' });

// Match the middle
assertMatch("f*uck", "firetruck");
assertMatch("f*uck", "firetruck", { flags: 'g' });

// Don't match without Regexp 'g'
assertNotMatch("uc", "firetruck");
// Match anywhere with RegExp 'g'
assertMatch("uc", "firetruck", { flags: 'g' });

// Match zero characters
assertMatch("f*uck", "fuck");
assertMatch("f*uck", "fuck", { flags: 'g' });

// More complex matches
assertMatch("*.min.js", "http://example.com/jquery.min.js");
assertMatch("*.min.*", "http://example.com/jquery.min.js");
assertMatch("*/js/*.js", "http://example.com/js/jquery.min.js");

// More complex matches with RegExp 'g' flag (complex regression)
assertMatch("*.min.*", "http://example.com/jquery.min.js", { flags: 'g' });
assertMatch("*.min.js", "http://example.com/jquery.min.js", { flags: 'g' });
assertMatch("*/js/*.js", "http://example.com/js/jquery.min.js", { flags: 'g' });

var testStr = "\\/$^+?.()=!|{},[].*"
assertMatch(testStr, testStr);
assertMatch(testStr, testStr, { flags: 'g' });

// Equivalent matches without/with using RegExp 'g'
assertNotMatch(".min.", "http://example.com/jquery.min.js");
assertMatch("*.min.*", "http://example.com/jquery.min.js");
assertMatch(".min.", "http://example.com/jquery.min.js", { flags: 'g' });

assertNotMatch("http:", "http://example.com/jquery.min.js");
assertMatch("http:*", "http://example.com/jquery.min.js");
assertMatch("http:", "http://example.com/jquery.min.js", { flags: 'g' });

assertNotMatch("min.js", "http://example.com/jquery.min.js");
assertMatch("*.min.js", "http://example.com/jquery.min.js");
assertMatch("min.js", "http://example.com/jquery.min.js", { flags: 'g' });

// Match anywhere (globally) using RegExp 'g'
assertMatch("min", "http://example.com/jquery.min.js", { flags: 'g' });
assertMatch("/js/", "http://example.com/js/jquery.min.js", { flags: 'g' });

assertNotMatch("/js*jq*.js", "http://example.com/js/jquery.min.js");
assertMatch("/js*jq*.js", "http://example.com/js/jquery.min.js", { flags: 'g' });

// Extended mode

// ?: Match one character, no more and no less
assertMatch("f?o", "foo", { extended: true });
assertNotMatch("f?o", "fooo", { extended: true });
assertNotMatch("f?oo", "foo", { extended: true });

// ?: Match one character with RegExp 'g'
assertMatch("f?o", "foo", { extended: true, flags: 'g' });
assertMatch("f?o", "fooo", { extended: true, flags: 'g' });
assertMatch("f?o?", "fooo", { extended: true, flags: 'g' });
assertNotMatch("?fo", "fooo", { extended: true, flags: 'g' });
assertNotMatch("f?oo", "foo", { extended: true, flags: 'g' });
assertNotMatch("foo?", "foo", { extended: true, flags: 'g' });

// []: Match a character range
assertMatch("fo[oz]", "foo", { extended: true });
assertMatch("fo[oz]", "foz", { extended: true });
assertNotMatch("fo[oz]", "fog", { extended: true });

// []: Match a character range and RegExp 'g' (regresion)
assertMatch("fo[oz]", "foo", { extended: true, flags: 'g' });
assertMatch("fo[oz]", "foz", { extended: true, flags: 'g' });
assertNotMatch("fo[oz]", "fog", { extended: true, flags: 'g' });

// {}: Match a choice of different substrings
assertMatch("foo{bar,baaz}", "foobaaz", { extended: true });
assertMatch("foo{bar,baaz}", "foobar", { extended: true });
assertNotMatch("foo{bar,baaz}", "foobuzz", { extended: true });
assertMatch("foo{bar,b*z}", "foobuzz", { extended: true });

// {}: Match a choice of different substrings and RegExp 'g' (regression)
assertMatch("foo{bar,baaz}", "foobaaz", { extended: true, flags: 'g' });
assertMatch("foo{bar,baaz}", "foobar", { extended: true, flags: 'g' });
assertNotMatch("foo{bar,baaz}", "foobuzz", { extended: true, flags: 'g' });
assertMatch("foo{bar,b*z}", "foobuzz", { extended: true, flags: 'g' });

// More complex extended matches
assertMatch("http://?o[oz].b*z.com/{*.js,*.html}",
            "http://foo.baaz.com/jquery.min.js",
            { extended: true });
assertMatch("http://?o[oz].b*z.com/{*.js,*.html}",
            "http://moz.buzz.com/index.html",
            { extended: true });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://moz.buzz.com/index.htm",
               { extended: true });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://moz.bar.com/index.html",
               { extended: true });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://flozz.buzz.com/index.html",
               { extended: true });

// More complex extended matches and RegExp 'g' (regresion)
assertMatch("http://?o[oz].b*z.com/{*.js,*.html}",
            "http://foo.baaz.com/jquery.min.js",
            { extended: true, flags: 'g' });
assertMatch("http://?o[oz].b*z.com/{*.js,*.html}",
            "http://moz.buzz.com/index.html",
            { extended: true, flags: 'g' });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://moz.buzz.com/index.htm",
               { extended: true, flags: 'g' });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://moz.bar.com/index.html",
               { extended: true, flags: 'g' });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://flozz.buzz.com/index.html",
               { extended: true, flags: 'g' });

// Remaining special chars should still match themselves
var testExtStr = "\\/$^+.()=!|,.*"
assertMatch(testExtStr, testExtStr, { extended: true });
assertMatch(testExtStr, testExtStr, { extended: true, flags: 'g' });

console.log("Ok!");
