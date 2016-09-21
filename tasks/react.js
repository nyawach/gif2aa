import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';

import browserify from 'browserify';
import react from 'gulp-react';
import source from 'vinyl-source-stream';
import babelify from 'babelify';

class ReactTask extends DefaultRegistry {

  init() {

    const config = require('../config/config.json');

    gulp.task('browserify:react', () => {

  	  return browserify(`${config.src}/js/script.js`, {debug: true})
  	    .transform(babelify.configure({
  	      presets: ["es2015", "react"]
  	    }))
          .bundle()
          .pipe(source('script.js'))
          .pipe(gulp.dest(`${config.dest}/js`));

    });

  }

};


module.exports = new ReactTask();