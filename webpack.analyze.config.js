const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

console.log('THIS IS AN ANALYSE BUILD!');

const config = require('./webpack.prod.config');

config.plugins.push(new BundleAnalyzerPlugin());

module.exports = config;
