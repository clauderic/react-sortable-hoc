'use strict'

# -- Dependencies --------------------------------------------------------------

gulp       = require 'gulp'
coffeeify  = require 'coffeeify'
gutil      = require 'gulp-util'
browserify = require 'browserify'
header     = require 'gulp-header'
uglify     = require 'gulp-uglify'
buffer     = require 'vinyl-buffer'
pkg        = require './package.json'
source     = require 'vinyl-source-stream'

# -- Files ---------------------------------------------------------------------

src =
  main: './index.js'

module =
  filename : "#{pkg.name}.js"
  shortcut : "#{pkg.name}"
  dist     : 'dist'

banner = [
           "/**"
           " * <%= pkg.name %> - <%= pkg.description %>"
           " * @version v<%= pkg.version %>"
           " * @link    <%= pkg.homepage %>"
           " * @license <%= pkg.license %>"
           " */"].join("\n")

# -- Tasks ---------------------------------------------------------------------

gulp.task 'browserify', ->
  browserify
      extensions: ['.coffee', '.js']
    .transform coffeeify
    .require(src.main, { expose: module.shortcut})
    .ignore('coffee-script')
    .bundle()
  .pipe source module.filename
  .pipe buffer()
  .pipe uglify()
  .pipe header banner, pkg: pkg
  .pipe gulp.dest module.dist

gulp.task 'default', ->
  gulp.start 'browserify'
  return
