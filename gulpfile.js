'use strict';

// Generated on 2014-02-08 using generator-gulp-webapp 0.0.1

// Load plugins
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-ruby-sass');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
var size = require('gulp-size');
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();

// Styles
gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe(sass({
          style: 'expanded',
          loadPath: ['app/bower_components']
        }))
        .pipe(autoprefixer('last 1 version'))
        .pipe(csso())
        .pipe(livereload(server))
        .pipe(size())
        .pipe(gulp.dest('dist/styles'));
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/scripts'));
});

// HTML
gulp.task('html', function () {
     return gulp.src('app/*.html')
        .pipe(livereload(server))
        .pipe(size())
        .pipe(gulp.dest('dist'));
});

// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(livereload(server))
        .pipe(size())
        .pipe(gulp.dest('dist/images'));
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false}).pipe(clean());
});

// Build
gulp.task('build', ['html', 'styles', 'scripts', 'images']);

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

// Watch
gulp.task('watch', function () {
    // Listen on port 35729
    server.listen(35729, function (err) {
        if (err) {
            return console.error(err);
        };

        // Watch .html files
        gulp.watch('app/*.html', ['html']);

        // Watch .scss files
        gulp.watch('app/styles/**/*.scss', ['styles']);

        // Watch .js files
        gulp.watch('app/scripts/**/*.js', ['scripts']);

        // Watch image files
        gulp.watch('app/images/**/*', ['images']);
    });
});
