var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var moment = require('moment');
var buffer = require('vinyl-buffer');
var sourcestream = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var size = require('gulp-size');

var envify = require('envify/custom');

function transformBundle(root, envObject) {
  root = root.bundle();

  if (envObject.development) {
    root.pipe(sourcestream('react-infinite.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(size({
          title: 'Development bundle'
        }))
        .pipe(gulp.dest('dist'));
  }
  if (envObject.production || envObject.release) {
    root.pipe(sourcestream('react-infinite.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(size({
          title: 'Release minified bundle'
        }))
        .pipe(gulp.dest('dist'));
  }
  if (envObject.release) {
    root.pipe(sourcestream('react-infinite.js'))
      .pipe(buffer())
      .pipe(size({
        title: 'Release unminified bundle'
      }))
      .pipe(gulp.dest('dist'));
  }
}

module.exports = function(shouldWatch, envObject, files) {
  var watchFunction = shouldWatch ? watchify : function(x) { return x; };
  var watchArgs = shouldWatch ? watchify.args : undefined;

  return function() {
    var root = watchFunction(browserify({
      entries: files,
      standalone: 'Infinite'
    }, watchArgs))
      .transform(babelify)
      .transform(envify({
        NODE_ENV: envObject.production || envObject.release ? 'production' : 'development'
      }))
      .exclude('react')
      .exclude('react-dom');

    if (envObject.production || envObject.release) {
      root = root.transform('uglifyify');
    }

    if (shouldWatch) {
      root.on('update', function() {
        transformBundle(root, envObject);
      });

      root.on('log', function() {
        console.log('[' + moment().format() + '] Browserify bundle refreshed');
      });
    }

    transformBundle(root, envObject);
  };
};
