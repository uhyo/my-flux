const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpChanged = require('gulp-changed');
const merge2 = require('merge2');

const del = require('del');

const gulpTS = require('gulp-typescript');
const typescript = require('typescript');

const tsMainProj = gulpTS.createProject('tsconfig.json', {
    typescript,
});
const tsTestProj = gulpTS.createProject('tsconfig.json', {
    typescript,
    declaration: false,
});
gulp.task('tsc', ()=>{
    const rs = gulp.src('./lib/**/*.ts{,x}')
    .pipe(sourcemaps.init())
    .pipe(tsMainProj());

    return merge2(
        rs.js.pipe(sourcemaps.write()).pipe(gulp.dest('dist/lib')),
        rs.dts.pipe(gulp.dest('dist/typings'))
    );
});
gulp.task('watch-tsc', ['tsc'], ()=>{
    gulp.watch('lib/**/*.ts{,x}', ['tsc']);
});

gulp.task('default', ['tsc']);
gulp.task('watch', ['watch-tsc']);

gulp.task('clean', ()=>{
    return del([
        'dist',
    ]);
});
