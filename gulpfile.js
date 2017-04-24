const gulp = require("gulp");
const ts = require("gulp-typescript");
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const tsProject = ts.createProject("tsconfig.json");

gulp.task("default", () => {
    return tsProject.src()
        .pipe(tsProject()).js
        .pipe(concat('index.js'))
        .pipe(minify({
            ext: {
                src:'-debug.js',
                min: '.js'
            }
        }))
        .pipe(gulp.dest("dist"));
});