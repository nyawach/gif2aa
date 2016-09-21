import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';

import imagemin from 'gulp-imagemin';
import rename from 'gulp-rename';
import pngquant from 'imagemin-pngquant';

class ImageTask extends DefaultRegistry {

  init() {

    const config = require('../config/config.json');

    // imagemin
    gulp.task('imagemin', () => {
        return gulp.src(`${config.src}/images/**/*.{png,jpg,jpeg,gif}`)
          .pipe(imagemin(config.imagemin))
          .pipe(rename(function(path){
            path.dirname += '/images';
          }))
          .pipe(gulp.dest(`${config.dest}`));
  	});



  }

};


module.exports = new ImageTask();
