import gulp from 'gulp';

import JadeTask from './tasks/jade.js';
import SassTask from './tasks/sass.js';
import WebpackTask from './tasks/webpack.js';
import ServeTask from './tasks/serve.js';
import ImageTask from './tasks/image.js';
import WatchTask from './tasks/watch.js';
import CopyBowerTask from './tasks/copy-bower.js';

gulp.registry(JadeTask);
gulp.registry(SassTask);
gulp.registry(WebpackTask);
gulp.registry(CopyBowerTask);
gulp.registry(ServeTask);
gulp.registry(ImageTask);
gulp.registry(WatchTask);

gulp.task('css', gulp.series('sass'));
gulp.task('js', gulp.parallel('webpack'));
gulp.task('html', gulp.series('jade'));


gulp.task('default', gulp.series(gulp.parallel('html', 'css', 'js'), 'serve', gulp.parallel('watch')));

gulp.task('build', gulp.series(gulp.parallel('html', 'css', 'js', 'imagemin'), 'serve'));


