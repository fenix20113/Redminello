var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');

var paths = {
    scss: ['./scss/*.scss']
};

gulp.task('scss', function () {
    gulp.src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./www/css'));
});

gulp.task('watch', function() {
    gulp.watch(paths.scss, ['scss']);
});
