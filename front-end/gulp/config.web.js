var path = require('path');
var webappSrc = path.resolve('./src'),
    projectDir = path.resolve('../');

module.exports={
    webappSrc:webappSrc,
    projectDir:projectDir,



    //opticss任务
    opticss:{
        sassSrc:projectDir+'/static/sass',
        dest:projectDir+'/static/css'
    },

    //optijs任务
    optijs:{
        commonjs:[],
        standjs:projectDir+'/static/js/',
        es5js:webappSrc+'/static/js/es5/',
        dest:projectDir+'/static/js/min'
    }
}
