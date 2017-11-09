var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    newer = require('gulp-newer'),
    babel = require("gulp-babel"),
    logger = require('gulp-logger');
var path = require('path');
var webappSrc = path.resolve('./src'),
    projectDir = path.resolve('../');
var config = require('../config.web').optijs;
var jsNames=['adminAppManage','adminAppUserManage','certManage','docServerManage','logManage','normUserManage','orgManage','secretKeyManage','sysConfManage','userManage','whitelistManage','usedcertManage'];
gulp.task("es", function () {  
    var jsTasks=[];
    var i,len;
    for(i=0,len=jsNames.length;i<len;i++){
        var jsTask=
         gulp.src(config.standjs+jsNames[i]+'.js')
        .pipe(babel({  
            presets: ['es2015']  
        }))  
        .pipe(gulp.dest(config.es5js));  
        jsTasks.push(jsTask);
    
    }
    return jsTasks;
});  

gulp.task('optijs',function(){

    var jsTasks=[];
    var i,len;
    for(i=0,len=jsNames.length;i<len;i++){
        var jsSrc=[];
        console.log(jsSrc);
        jsSrc.push(config.es5js+jsNames[i]+'.js')
        var jsTask=
        gulp.src(jsSrc)
        .pipe(plumber())
        .pipe(newer(config.dest))
        .pipe(logger({showChange:true}))
        .pipe(concat(jsNames[i]+'.js'))
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(config.dest));
        jsTasks.push(jsTask);
    }
   
    return jsTasks;
});