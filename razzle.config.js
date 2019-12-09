// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const jsConfig = require('./jsconfig').compilerOptions;

const pathsConfig = jsConfig.paths;
let voltoPath = './node_modules/@plone/volto';
Object.keys(pathsConfig).forEach(pkg => {
  if (pkg === '@plone/volto') {
    voltoPath = `./${jsConfig.baseUrl}/${pathsConfig[pkg][0]}`;
  }
});

// module.exports = require(`${voltoPath}/razzle.config`);

let config = require(`${voltoPath}/razzle.config`);
// console.log(config);
// module.exports = config;

const razzleModify = config.modify;

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    const vc = razzleModify(config, { target, dev }, webpack);
    // console.log('vc', vc);
    // vc.module.rules.forEach((rule, i) => {
    //   console.log('rule', i, '-----');
    //   console.log(rule);
    //   console.log('rule options');
    //   console.log(rule.use && rule.use[0].options);
    // });
    // const hardSource = new HardSourceWebpackPlugin();
    // vc.plugins.push(hardSource);
    return vc;
  },
};
