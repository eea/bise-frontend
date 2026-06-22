const fs = require('fs');
const { AddonRegistry } = require('@plone/registry/addon-registry');

const projectRootPath = __dirname;

let voltoPath = './node_modules/@plone/volto';

let configFile;
if (fs.existsSync(`${projectRootPath}/tsconfig.json`))
  configFile = `${projectRootPath}/tsconfig.json`;
else if (fs.existsSync(`${projectRootPath}/jsconfig.json`))
  configFile = `${projectRootPath}/jsconfig.json`;

if (configFile) {
  const jsConfig = require(configFile).compilerOptions;
  const pathsConfig = jsConfig.paths;
  if (pathsConfig['@plone/volto'])
    voltoPath = `./${jsConfig.baseUrl}/${pathsConfig['@plone/volto'][0]}`;
}

const { registry } = AddonRegistry.init(projectRootPath);

// Extends ESLint configuration for adding aliases to local Volto add-ons.
const addonAliases = Object.keys(registry.packages).map((pkgName) => [
  pkgName,
  registry.packages[pkgName].modulePath,
]);

const addonExtenders = registry
  .getEslintExtenders()
  .map((modulePath) => require(modulePath));

const defaultConfig = {
  extends: `${voltoPath}/.eslintrc`,
  ignorePatterns: [
    'src/addons/**/node_modules',
    'src/addons/**/cypress',
    'src/addons/**/build',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@plone/volto', '@plone/volto/src'],
          ['@plone/volto-slate', '@plone/volto-slate/src'],
          ...addonAliases,
          ['@package', `${projectRootPath}/src`],
          ['@root', `${projectRootPath}/src`],
          ['~', `${projectRootPath}/src`],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
      'babel-plugin-root-import': {
        rootPathSuffix: 'src',
      },
    },
  },
};

module.exports = addonExtenders.reduce(
  (config, extender) => extender.modify(config),
  defaultConfig,
);
