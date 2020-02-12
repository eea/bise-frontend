const path = require('path');

// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const autoprefixer = require('autoprefixer');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');
// const projectRootPath = path.resolve('.');
// const voltoConfig = require(`${voltoPath}/razzle.config`);
// const voltoPath = base.resolveVoltoPath('.');

const base = require('./src/develop/volto-base/src').razzle;

const config = base.BaseConfig(path.resolve('.'));

module.exports = {
  plugins: base.plugins,
  modify: config.modify, //razzleModify(voltoPath),
};
