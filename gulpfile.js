/*jshint esversion:6*/

const exec = require('child_process').exec;
const gulp = require('gulp');

gulp.task('run_local',()=>{
    exec('sudo node index.js -local',(err,stdout,stderr)=>{
        if(err){
            console.log("Error running local server");
        }
    });
});

gulp.task('run_public',()=>{
    exec('sudo node index.js',(err,stdout,stderr)=>{
        if(err){
            console.log("Error running public server");
        }
    });
});

