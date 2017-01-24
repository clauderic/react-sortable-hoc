var gulp = require('gulp');
var babel = require('gulp-babel');
var server = require('gulp-webserver');
var del = require('del');

var browserifyCreator = require('./pipeline/browserify');

var args = require('yargs').alias('P', 'production')
               .alias('D', 'development')
               .alias('E', 'example').argv;

var envObject = {
  production: args.production,
  development: args.development,
  release: !(args.production || args.development)
};
var INFINITE_SOURCE = './src/react-infinite.jsx';

var buildFunction = browserifyCreator(false, envObject, INFINITE_SOURCE);

gulp.task('build-bundle', buildFunction);
gulp.task('cleanly-build-bundle', ['clean'], buildFunction);
gulp.task('watch-develop-bundle', browserifyCreator(true, {development: true}, INFINITE_SOURCE));

// This task builds everything for release: the dist
// folder is populated with react-infinite.js and
// react-infinite.min.js, while the build folder is
// provided with a copy of the source transpiled to ES5.
gulp.task('release', ['cleanly-build-bundle'], function() {
  // Transpile CommonJS files to ES5 with React's tools.
  gulp.src(['./src/**/*.js', './src/**/*.jsx'])
      .pipe(babel())
      .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  return del(['build', 'dist']);
});

// This task is used to build the examples. It is used
// in the development watch function as well.
gulp.task('examples', function() {
  gulp.src('./examples/*.jsx')
    .pipe(babel())
    .pipe(gulp.dest('examples'));
});

gulp.task('server', function() {
  gulp.src(__dirname)
      .pipe(server({
        port: 8080,
        directoryListing: true,
        livereload: {
          enable: true,
          filter: function(filename) {
            if (filename.match(__dirname + '/examples')) {
              return true;
              // The examples draw from /dist, which should change
              // when the source files change
            } else if (filename.match(__dirname + '/dist')) {
              return true;
            } else {
              return false;
            }
          }
        }
      }));
});

// This task is used for development. When run, it sets up
// a watch on the source files
gulp.task('develop', ['watch-develop-bundle', 'server'], function() {
  gulp.watch('Gulpfile.js', ['examples', 'build-bundle']);
  gulp.watch('./examples/*.jsx', ['examples', 'build-bundle']);
});

gulp.task('default', ['release']);
