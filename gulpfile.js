const gulp = require('gulp');
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
    const rs = gulp.src('./lib/**/*.ts').pipe(tsMainProj());

    return merge2(
        rs.js.pipe(gulp.dest('dist/lib')),
        rs.dts.pipe(gulp.dest('dist/typings'))
    );
});
gulp.task('watch-tsc', ['tsc'], ()=>{
    gulp.watch('lib/**/*.ts', ['tsc']);
});

gulp.task('test-tsc', ()=>{
    return gulp.src('./test/**/*.ts')
    .pipe(tsTestProj())
    .js.pipe(gulp.dest('dist/test'));
});
gulp.task('watch-test-tsc', ['test-tsc'], ()=>{
    gulp.watch('test/**/*.ts', ['test-tsc']);
});

gulp.task('default', ['tsc', 'test-tsc']);
gulp.task('watch', ['watch-tsc', 'watch-test-tsc']);

gulp.task('clean', ()=>{
    return del([
        'dist',
    ]);
});
