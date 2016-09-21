import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';

import browserSync from 'browser-sync';


class ServeTask extends DefaultRegistry {

  init() {

    const config = require('../config/config.json');

    // browser-syncの起動
    gulp.task('serve', cb => {

        browserSync(config.browserSync);
        cb();

    });

    // リロード
    gulp.task('reload', cb => {

        browserSync.reload();
        cb();

    });

    // WordPress用
    gulp.task('wpserver', function(){
      browserSync({
        proxy: 'localhost/wordpress/',
        notify: true,
        port: 80
      });
    });

  }

};


module.exports = new ServeTask();
