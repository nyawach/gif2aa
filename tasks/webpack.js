import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';

import webpack from 'webpack';
import gulp_webpack from 'gulp-webpack';
import named from 'vinyl-named';
import rename from 'gulp-rename';

class WebpackTask extends DefaultRegistry {

  init() {

    const config = require('../config/config.json');

    // webpackのconfigは関数なども入っているのでここで記入
    const webpackConfig = {
      devtool: 'source-map',
      plugins: [
          new webpack.optimize.UglifyJsPlugin({minimize: true})
      ],
      module: {
        loaders: [
          {
            test: /\.js$/,
            // exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              cacheDirectory: true,
              presets: ['es2015']
            }
          }
        ]
      }
    };

    gulp.task('webpack', callback => {

      return gulp.src(`${config.src}/js/**/script.js`)
        // http://2no.hatenablog.com/entry/2015/06/08/170511
        .pipe(named(function(file) {
          return file.relative.replace(/\.[^\.]+$/, '');
        }))
        .pipe(gulp_webpack(webpackConfig))
        .pipe(rename(function(path){
          path.dirname += '/js';
        }))
        .pipe(gulp.dest(`${config.dest}/`));

    });

  }

};

module.exports = new WebpackTask();

