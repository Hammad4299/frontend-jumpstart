var path = require('path');
var gulp = require('gulp');
var swig = require('gulp-swig');
var data = require('gulp-data');
var watch = require('gulp-watch');

let paths = {
    src: path.join(__dirname,'src'),
    output: path.join(__dirname,'dist')
};

gulp.task('compile-templates', function() {
    let viewPath = path.join(paths.src,'views/pages/**/*');
    return watch(viewPath,function () {
        gulp.src(viewPath)
            .pipe(data(function (file) {
                console.log(file);
                return {
                    data: 'ABC'
                };
            }))
            .pipe(swig())
            .pipe(gulp.dest(path.join(paths.output)))
    });
});