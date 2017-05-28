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
    const rs = gulp.src('./lib/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsMainProj());

    return merge2(
        rs.js.pipe(sourcemaps.write()).pipe(gulp.dest('dist/lib')),
        rs.dts.pipe(gulp.dest('dist/typings'))
    );
});
gulp.task('watch-tsc', ['tsc'], ()=>{
    gulp.watch('lib/**/*.ts', ['tsc']);
});

gulp.task('test-tsc', ()=>{
    return gulp.src(['./test/**/*.ts', '!./test/typing/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsTestProj())
    .js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/test'));
});
gulp.task('watch-test-tsc', ['test-tsc'], ()=>{
    gulp.watch(['test/**/*.ts', '!test/typing/**/*.ts'], ['test-tsc']);
});
gulp.task('test-typing', ()=>{
    return gulp.src('./test/typing/**/*.ts')
    .pipe(gulpChanged('dist/test/typing'))
    .pipe(gulp.dest('dist/test/typing'));
});
gulp.task('watch-test-typing', ['test-typing'], ()=>{
    gulp.watch('test/typing/**/*.ts', ['test-typing']);
});

gulp.task('default', ['tsc', 'test-tsc', 'test-typing']);
gulp.task('watch', ['watch-tsc', 'watch-test-tsc', 'watch-test-typing']);

gulp.task('clean', ()=>{
    return del([
        'dist',
    ]);
});
