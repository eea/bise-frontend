// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const path = require('path');
const jsConfig = require('./jsconfig').compilerOptions;
// const base = require('./src/develop/volto-base/src').razzle;
// const config = base.BaseConfig(path.resolve('.'));

const pathsConfig = jsConfig.paths;
let voltoPath = './node_modules/@plone/volto';
Object.keys(pathsConfig).forEach(pkg => {
  if (pkg === '@plone/volto') {
    voltoPath = `./${jsConfig.baseUrl}/${pathsConfig[pkg][0]}`;
  }
});

// module.exports = require(`${voltoPath}/razzle.config`);

// let config = require(`${voltoPath}/razzle.config`);
// console.log(config);
// module.exports = config;

const base = require('./src/develop/volto-base/src').razzle;
const config = base.BaseConfig(path.resolve('.'));
const razzleModify = config.modify;

module.exports = {
  plugins: base.plugins,
  modify: config.modify, //razzleModify(voltoPath), 
};
