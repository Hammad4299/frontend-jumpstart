var path = require('path');
var gulp = require('gulp');
var swig = require('gulp-swig');
var data = require('gulp-data');
var watch = require('gulp-watch');
var ejs = require('gulp-ejs');
var gutil = require('gulp-util');

let paths = {
    src: path.join(__dirname,'src'),
    output: path.join(__dirname,'dist')
};

gulp.task('compile-templates-swig', function() {
    // let viewPath = path.join(paths.src,'views/pages/swig/**/*');
    // return watch(viewPath,function () {
    //     gulp.src(viewPath)
    //         .pipe(data(function (file) {
    //             console.log(file);
    //             return {
    //                 data: 'ABC'
    //             };
    //         }))
    //         .pipe(swig())
    //         .pipe(gulp.dest(path.join(paths.output)))
    // });
});

gulp.task('compile-templates-ejs', function() {
    // let viewPath = path.join(paths.src,'views/pages/ejs/**/*');
    // return watch(viewPath,function () {
    //     gulp.src(viewPath)
    //         .pipe(ejs({
    //             data: 'ABC'
    //         },{},{
    //             ext: '.html'
    //         })).on('error', gutil.log)
    //         .pipe(gulp.dest(path.join(paths.output)))
    // });
});