import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';

import browserify from 'browserify';
import source from 'vinyl-source-stream';
import babelify from 'babelify';
import debowerify from 'debowerify';


class BrowserifyTask extends DefaultRegistry {

  init() {

    const config = require('../config/config.json');

    gulp.task('browserify', () => {
        return browserify(`${config.src}/js/script.js`)
            .transform(babelify, { presets: ['es2015', 'react'] })
            .transform(debowerify)
            .bundle()
            .pipe(source('script.js'))
            .pipe(gulp.dest(`${config.dest}/js`));
    });

  }

};


module.exports = new BrowserifyTask();