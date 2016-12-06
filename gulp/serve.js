const gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    eslint = require('gulp-eslint');

const config  = require('./config');

gulp.task('serve', ['eslint'], function () {
    return nodemon({
        script: config.paths.startFile,
        task: 'eslint',
        watch: ['bin', 'routes', 'controllers', 'config'],
        ext: 'js',
        env: {
            'NODE_ENV': 'development'
        },
        exec: 'node --debug'
    });
});

gulp.task('eslint', function () {
    return gulp.src(['**/*.js', '!node_modules/**', '!public/**', '!resources/bower_components/**', '!coverage/**'])
        .pipe(eslint())
        .pipe(eslint.format());
});