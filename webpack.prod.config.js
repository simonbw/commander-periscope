const CompressionPlugin = require("compression-webpack-plugin");
const DefinePlugin = require('webpack').DefinePlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('./webpack.config');

console.log('THIS IS A PROD BUILD!');
config.plugins.push(new DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
  'process.env.SOURCE_HASH': JSON.stringify(process.env.SOURCE_VERSION),
}));
config.plugins.push(new UglifyJsPlugin({
  cache: true,
  parallel: true
}));
config.plugins.push(new CompressionPlugin({}));

module.exports = config;
