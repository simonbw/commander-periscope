const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
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
          // cacheDirectory: true
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
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }],
    }],
  },
  plugins: [
    new HardSourceWebpackPlugin() // TODO: Don't use this on heroku
  ],
  devtool: "cheap-module-source-map"
};
