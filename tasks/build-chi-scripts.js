import gulp from 'gulp';
import path from 'path';
import vinylNamed from 'vinyl-named';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import { Folders } from './constants';
import * as chi from "../scripts/chi";

const gulpPlugins = require('gulp-load-plugins')();
const sources = path.join(Folders.SRC, 'chi', '**', '*.js');
const destination = path.join(Folders.DIST, 'js');

const webpackConfig = {
  output: {
    library: ["chi", "[name]"], //'chi',
    //libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          sources
        ],
        exclude: /(\/node_modules\/$)/,
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          'html-loader'
        ]
      }
    ]
  }
};

if (process.env.PRODUCTION) {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    comments: false,
    sourceMap: false,
    compress: {
      warnings: false,
      drop_console: false
    },
    exclude: [
      /node_modules\//
    ]
  }));
} else {
  webpackConfig.devtool = false;
  webpackConfig.plugins = [new webpack.SourceMapDevToolPlugin({
    filename: '[file].map',
    append: null,
    module: true,
    columns: true,
    lineToLine: false,
    noSources: false,
    namespace: ''
  })]
}

gulp.task('build:chi:scripts', () => gulp.src(sources)
  .pipe(gulpPlugins.plumber())
  .pipe(vinylNamed())
  .pipe(webpackStream(webpackConfig))
  .pipe(gulp.dest(destination))
.pipe(gulpPlugins.connect.reload())
);
