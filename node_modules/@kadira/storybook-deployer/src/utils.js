var shell = require('shelljs');
var parseGitUrl = require('git-url-parse');

module.exports.exec = function exec(command) {
  const options = { silent: true };
  const ref = shell.exec(command, options);
  if (ref.code === 0) {
   return ref.stdout.trim();
  }

  const message =
    'Exec code(' + ref.code + ') on executing: ' + command + '\n' +
    shell.stderr;

  throw new Error(message);
};

module.exports.getGHPagesUrl = function getGHPagesUrl(ghUrl) {
  var parsedUrl = parseGitUrl(ghUrl);
  var ghPagesUrl = 'https://' + parsedUrl.owner + '.github.io/' + parsedUrl.name;
  return ghPagesUrl;
};
