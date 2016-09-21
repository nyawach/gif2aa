import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';

class TestTask extends DefaultRegistry {
  init() {
    gulp.task('test', cb => {
      console.log('やったぜ。');
      cb()
    });
  }
};

module.exports = new TestTask();

