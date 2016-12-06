const gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    buffer = require('vinyl-buffer'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    merge = require('merge-stream'),
    path = require('path');

const conf = require('./config');


gulp.task('sprite', function () {
    let spriteData = gulp.src(path.join(conf.paths.src, '/images/*.png'))
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }));

    let imgStream = spriteData.img
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(path.join(conf.paths.dest, '/images')));

    let cssStream = spriteData.css
        .pipe(csso())
        .pipe(gulp.dest(path.join(conf.paths.dest, '/stylesheets')));

    return merge(imgStream, cssStream);
});