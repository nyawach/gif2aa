import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';

import jade from 'gulp-jade';

class JadeTask extends DefaultRegistry {

  init() {

    const config = require('../config/config.json');
    const locals = require('../src/jade/locals.json');

    gulp.task('jade', callback => {

      return gulp.src([`${config.src}/jade/**/*.jade`, `!${config.src}/jade/**/components/*.jade`])
        .pipe(jade({
          locals: locals,
          pretty: true
        }))
        .pipe(gulp.dest(`${config.dest}/`));

    });

  }

};

module.exports = new JadeTask();

