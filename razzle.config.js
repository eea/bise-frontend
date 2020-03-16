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
  modify: function(config, { target, dev }, webpack) {
    const vc = razzleModify(config, { target, dev }, webpack); //razzleModify(voltoPath),
    const loader = {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    };
    // const plugin = [
    //   'module-resolver',
    //   {
    //     root: ['./'],
    //     alias: {
    //       components: './src/components',
    //       lib: './src/lib',
    //       styles: './src/styles',
    //     },
    //   },
    // ];
    //
    const rcePath = vc.resolve.alias['react-chart-editor'] || '';
    if (!rcePath) {
      // TODO: take node_modules/react-chart-editor as base
      console.warn('react-chart-editor is not yet activated for development');
    }

    vc.resolve.alias = {
      ...vc.resolve.alias,
      components: `${rcePath}/components`,
      lib: `${rcePath}/lib`,
      styles: `${rcePath}/styles`,
    };
    console.log(vc.resolve.alias);

    vc.module.rules.push(loader);
    console.log(vc.module.rules);

    return vc;
  },
};
