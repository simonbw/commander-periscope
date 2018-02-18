const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const config = require('./webpack.config');

console.log('THIS IS A DEV BUILD!');
config.plugins.push(new HardSourceWebpackPlugin());

module.exports = config;
