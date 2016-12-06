const gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    buffer = require('vinyl-buffer'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    merge = require('merge-stream');

const conf = require('./gulp/config');


gulp.task('sprite', function () {
    let spriteData = gulp.src('resources/images/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }));

    let imgStream = spriteData.img
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'));

    let cssStream = spriteData.css
        .pipe(csso())
        .pipe(gulp.dest('public/stylesheets'));

    return merge(imgStream, cssStream);
});