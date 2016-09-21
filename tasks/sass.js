import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';

import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import pleeease from 'gulp-pleeease';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';

class SassTask extends DefaultRegistry {

  init() {

    const config = require('../config/config.json');

    gulp.task('sass', () => {

        return gulp.src(`${config.src}/scss/**/*.scss`)
            .pipe(sassGlob())
            .pipe(sourcemaps.init())
            .pipe(sass(config.sass).on('error', sass.logError))
            .pipe(pleeease(config.pleeease))
            .pipe(sourcemaps.write(config.sourcemaps))
            .pipe(rename(function(path){
                path.dirname += '/css'
            }))
            .pipe(gulp.dest(`${config.dest}`));

    });

    gulp.task('sass-build', () => {

        return gulp.src(`${config.src}/scss/**/*.scss`)
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(pleeease(config.pleeease))
        .pipe(gulp.dest(`${config.dest}/css`));

    });
  }

}


module.exports = new SassTask();
