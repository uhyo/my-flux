const gulp = require('gulp');
const merge2 = require('merge2');

const del = require('del');

const gulpTS = require('gulp-typescript');
const typescript = require('typescript');

const tsProj = gulpTS.createProject('tsconfig.json', {
    typescript,
});
gulp.task('tsc', ()=>{
    const rs = tsProj.src()
    .pipe(tsProj());

    return merge2(
        rs.js.pipe(gulp.dest('dist/lib')),
        rs.dts.pipe(gulp.dest('dist/typings'))
    );
});
gulp.task('watch-tsc', ['tsc'], ()=>{
    gulp.watch('lib/**/*.ts', ['tsc']);
});

gulp.task('default', ['tsc']);

gulp.task('clean', ()=>{
    return del([
        'dist',
    ]);
});
