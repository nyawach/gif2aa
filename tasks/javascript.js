import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';


class JsTask extends DefaultRegistry {

  init() {

    const config = require('../config/config.json');

    gulp.task('copy-js', () => {
        return gulp.src(`${config.src}/js/**/*.js`)
        .pipe(gulp.dest(`${config.dest}/js`));
    });

  }

};


module.exports = new JsTask();