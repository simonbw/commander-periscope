const path = require('path');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      exclude: /node_modules/
    }, {
      test: /\.(jpg|png|svg)$/,
      loader: 'file',
      include: path.resolve('images')
    }, {
      test: /\.css?$/,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }],
    }]
  },
  plugins: [
    // your custom plugins
    // new HardSourceWebpackPlugin() // makes things faster
  ],
  devtool: "inline-source-map",
};
