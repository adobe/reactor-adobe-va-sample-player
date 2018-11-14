'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (env) {
  const entries = {
    'openVideo': './src/view/actions/openVideo/index.js',
    'playerEvent': './src/view/events/playerEvent/index.js'
  };

  const plugins = Object.keys(entries).map(chunkName => (
    new HtmlWebpackPlugin({
      chunks: ['common', chunkName],
      filename: chunkName + '.html',
      template: 'src/view/template.html'
    })
  ));

  if (env.production) {
    plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }));
  }

  if (env.sandbox) {
    // This allows us to run the sandbox after the initial build takes place. By not starting up the
    // sandbox while simultaneously building the view, we ensure:
    // (1) Whatever we see in the browser contains the latest view files.
    // (2) The sandbox can validate our extension.json and find that the view files it references
    // actually exist because they have already been built.
    plugins.push(new WebpackShellPlugin({
      onBuildEnd: ['./node_modules/.bin/reactor-sandbox']
    }));
  }

  if (env.analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    entry: entries,
    plugins: plugins,
    mode: (env.production) ? 'production' : 'development',
    optimization: {
      splitChunks: {
        name: 'common',
        chunks: 'all',
      },
      minimizer: [
        new UglifyJsWebpackPlugin({
          parallel: true, // uses all cores available on given machine
          sourceMap: false,
        }),
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist/view'),
      filename: '[name].js'
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        include: path.resolve('src/view'),
        exclude: /__tests__/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?|(jpg|gif)$/,
        loader: 'file-loader'
      }]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.css'],
      modules: [
        path.resolve(__dirname, 'node_modules')
      ]
    }
  };
}