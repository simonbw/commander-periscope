const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const CompressionPlugin = require("compression-webpack-plugin");

const config = {
  entry: "./src/client/index.js",
  output: {
    filename: "index.js",
    path: path.resolve('dist/client')
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      exclude: /node_modules/,
    }, {
      test: /\.(jpg|png|svg)$/,
      loader: 'file',
      include: path.resolve('images')
    }, {
      test: /\.css?$/,
      include: path.resolve('styles'),
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[local]-[hash:base64:5]'
        }
      }],
    }],
  },
  plugins: [],
  devtool: "source-map"
};

if (process.env.NODE_ENV === 'dev') {
  console.log('THIS IS A DEV BUILD!');
  config.plugins.push(new HardSourceWebpackPlugin());
} else if (process.env.NODE_ENV === 'test') {
  console.log('THIS IS A TEST BUILD!');
} else {
  console.log('THIS IS A PROD BUILD!');
  config.plugins.push(new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.SOURCE_HASH': JSON.stringify(process.env.SOURCE_VERSION),
  }));
  config.plugins.push(new UglifyJsPlugin({
    cache: true,
    parallel: true
  }));
  config.plugins.push(new UglifyJsPlugin({
    cache: true,
    parallel: true
  }));
  config.plugins.push(new CompressionPlugin({}));
}

module.exports = config;
