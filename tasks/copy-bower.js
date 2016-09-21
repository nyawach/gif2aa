import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';

import filter from 'gulp-filter';
import bower from 'main-bower-files';
import uglify from 'gulp-uglify';
import inject from 'gulp-inject';
import concat from 'gulp-concat';

class CopyBowerTask extends DefaultRegistry {

  init() {

    const config = require('../config/config.json');

    gulp.task('copy-bower', () => {

        return gulp.src(bower())
        .pipe(filter('**/*.js'))
        // プラグインをconcatしたくない場合はここをコメントアウト
        // .pipe(concat('lib.min.js'))
        .pipe(uglify({
            mangle: false,
            preserveComments: 'license'
        }))
        .pipe(gulp.dest(`${config.src}/js/lib/`))
        .pipe(gulp.dest(`${config.dest}/js/lib/`));

    });

    gulp.task('inject', () => {

        const source = gulp.src(`${config.dest}/js/lib/*.js`, {
            read: false
        });

        return gulp.src(`${config.src}/jade/components/_template.jade`)
        .pipe(inject(source, {
            relative: false,
            addRootSlash: false,
            transform: function (filepath) {
                const rootPathRegExp = new RegExp(`${config.dest}/`, 'g');
                return `script(src="${filepath.replace(rootPathRegExp, '')}")`;
            }
        }))
        .pipe(gulp.dest(`${config.src}/jade/components/`));

    });

    gulp.task('bower-install', gulp.series('copy-bower', 'inject'));

  }

};


module.exports = new CopyBowerTask();


