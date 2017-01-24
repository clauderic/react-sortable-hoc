exports.pathMatch = pathMatch;

function pathMatch(url, path) {
  if (url == path) return true;
  var q = url.indexOf('?');
  if (q == -1) return false;
  return url.substring(0, q) == path;
}
