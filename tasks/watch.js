import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';

import watch from 'gulp-watch';

class WatchTask extends DefaultRegistry {

  init() {

    const config = require('../config/config.json');

    // watch
  	gulp.task('watch', cb => {

  		watch([`${config.src}/jade/**/*.jade`, `${config.src}/jade/locals.json`], gulp.series('jade', 'reload'));
  		watch(`${config.src}/scss/**/*.scss`, gulp.series('sass', 'reload'));
  		watch([`${config.src}/js/**/*.js`], gulp.series('js', 'reload'));

  		cb();

   	});

  }

};

module.exports = new WatchTask();
