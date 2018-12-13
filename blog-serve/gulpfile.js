const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

gulp.task('less', function() {
    return gulp.src('./app/view/style/*.less')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true,
            remove: true
        }))
        .pipe(less())
        .pipe(cleanCss())
        .pipe(gulp.dest('./app/public/style'))
})

gulp.task('js', function() {
    return gulp.src('./app/view/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./app/public/js'))
})

gulp.task('default', function() {
    gulp.watch('./app/view/js/*.js', gulp.parallel(['js']));
    gulp.watch('./app/view/style/*.less', gulp.parallel(['less']))
})