const path = require('path');


module.exports = {
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
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
  ],
  devtool: "inline-source-map",
};
