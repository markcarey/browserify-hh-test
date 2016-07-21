process.env.UNLAZY = true;
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var wrap = require('gulp-wrap');
var concat = require('gulp-concat');
var declare = require('gulp-declare');
var handlebars = require('gulp-handlebars');
var hb = require('handlebars');
var helpers = require('handlebars-helpers')({
  handlebars: hb
});

gulp.task('templates', function() {
  // Load templates from the templates/ folder relative to where gulp was executed
  gulp.src('*.handlebars')
    // Compile each Handlebars template source file to a template function
    .pipe(handlebars({
      handlebars: hb
    }))
    // Wrap each template function in a call to Handlebars.template
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    // Declare template functions as properties and sub-properties of exports
    .pipe(declare({
      namespace: 'templates',
      noRedeclare: true, // Avoid duplicate declarations
      processName: function(filePath) {
        // Allow nesting based on path using gulp-declare's processNameByPath()
        // You can remove this option completely if you aren't using nested folders
        // Drop the templates/ folder from the namespace path by removing it from the filePath
        return declare.processNameByPath(filePath.replace('templates/', ''));
      }
    }))
    // Concatenate down to a single file
    .pipe(concat('index.js'))
    // Add the Handlebars module in the final output
    //.pipe(wrap('var Handlebars = require("handlebars");\n <%= contents %>'))
    // WRite the output into the templates folder
    .pipe(gulp.dest('templates/'));
});

gulp.task('browserify', function () {
  var b = browserify({
    entries: './src/hh.js',
    debug: true,
    // Tell browserify that Handlebars is loaded already
    external: 'Handlebars'
  });

  // ignore the internal handlebars require
  b.ignore('handlebars');

  return b.bundle()
    .pipe(source('hh.js'))
    .pipe(buffer())
    .pipe(gulp.dest('javascript/'));
});

// Default task
gulp.task('default', ['templates']);