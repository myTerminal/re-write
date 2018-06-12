/* global require */

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    watchNow = require('gulp-watch-now');

gulp.task('scripts', function () {
    return gulp.src([
        'src/**/*.js'
    ]).pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('bin'));
});

gulp.task('scripts-debug', function () {
    return gulp.src([
        'src/**/*.js'
    ]).pipe(gulp.dest('bin'));
});

gulp.task('default', ['scripts']);

gulp.task('debug', ['scripts-debug']);

gulp.task('develop', function() {
    watchNow.watch(gulp,
                   [
                       'src/**/*.js'
                   ],
                   [
                       'scripts-debug'
                   ]);
});
