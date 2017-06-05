const webpackConfigure   = require('./webpack-common.config');

const config = webpackConfigure('production');

module.exports = config;
