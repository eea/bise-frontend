const path = require('path');

const base = require('./src/develop/volto-base/src').razzle;
const config = base.BaseConfig(path.resolve('.'));
const razzleModify = config.modify;

module.exports = {
  plugins: base.defaultPlugins,
  modify: razzleModify,
};
