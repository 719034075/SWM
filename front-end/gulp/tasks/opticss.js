var gulp = require('gulp'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    streamqueue = require('streamqueue'),
    plumber = require('gulp-plumber'),
    newer = require('gulp-newer'),
    logger = require('gulp-logger'),
    sass = require('gulp-sass');
    
var config = require('../config.web').opticss;

gulp.task('opticss',function(){
    console.log(config.dest);
    var cssTask=gulp.src(config.sassSrc+'/swm.scss')
        .pipe(plumber())
        .pipe(newer(config.dest))
        .pipe(logger({showChange:true}))
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(config.dest));
    return cssTask;
});
