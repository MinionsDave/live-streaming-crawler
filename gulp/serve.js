const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

const config = require('./config');

gulp.task('lint', function() {
    return gulp.src(['**/*.js', '!node_modules/**', '!public/**', '!resources/bower_components/**', '!coverage/**'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('serve', ['lint'], function() {
    let stream = nodemon({
        script: config.paths.startFile,
        // tasks: ['lint'],
        watch: ['bin', 'routes', 'controllers', 'config', 'util', 'app.js'],
        ext: 'js',
        env: {
            'NODE_ENV': 'development',
        },
        exec: 'node --debug',
    });

    /**
     * 用事件的形式，这样可以直接重启再执行任务，可以马上调试
    */
    stream.on('restart', function() {
        gulp.start('lint');
    });

    return stream;
});
