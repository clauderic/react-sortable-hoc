require('shelljs/global')
var path = require('path')

console.log("> Start transpiling ES2015")

rm('-rf', 'dist')

var babel = ['node_modules', '.bin', 'babel'].join(path.sep);
exec(babel + " --ignore __tests__,manager --plugins transform-runtime src --out-dir dist")

if(!process.env.DEV_BUILD){
  var webpack = ['node_modules', '.bin', 'webpack'].join(path.sep);
  var webpackManagerConf = ["scripts", "webpack.manager.conf.js"].join(path.sep);
  exec(webpack + " --config " + webpackManagerConf)
}

console.log("> Complete transpiling ES2015")
