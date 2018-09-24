import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('build:website', done => runSequence(
  'build:website:images',
  'build:website:sprites',
  'build:website:styles',
  'build:website:scripts',
  'build:website:dependencies',
  'build:website:views',
  done
));
