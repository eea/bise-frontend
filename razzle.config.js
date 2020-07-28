// const path = require('path');
//
// const base = require('./src/develop/volto-base/src').razzle;
// const config = base.BaseConfig(path.resolve('.'));
// const razzleModify = config.modify;
//
// module.exports = {
//   plugins: base.defaultPlugins,
//   modify: razzleModify,
// };

/**
 * Replace with custom razzle config when needed.
 * @module razzle.config
 */

const jsConfig = require('./jsconfig').compilerOptions;

const pathsConfig = jsConfig.paths;
let voltoPath = './node_modules/@plone/volto';
Object.keys(pathsConfig).forEach(pkg => {
  if (pkg === '@plone/volto') {
    voltoPath = `./${jsConfig.baseUrl}/${pathsConfig[pkg][0]}`;
  }
});

module.exports = require(`${voltoPath}/razzle.config`);
