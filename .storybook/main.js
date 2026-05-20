const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const projectRootPath = path.resolve('.');
const lessPlugin = require('@plone/volto/webpack-plugins/webpack-less-plugin');
const scssPlugin = require('razzle-plugin-scss');

const createConfig = require('../node_modules/razzle/config/createConfigAsync.js');
const razzleConfig = require(path.join(projectRootPath, 'razzle.config.js'));

const SVGLOADER = {
  test: /icons\/.*\.svg$/,
  use: [
    {
      loader: 'svg-loader',
    },
    {
      loader: 'svgo-loader',
      options: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                convertPathData: false,
                removeViewBox: false,
              },
            },
          },
          'removeTitle',
          'removeUselessStrokeAndFill',
        ],
      },
    },
  ],
};

const walkRules = (rules, callback) => {
  for (const rule of rules || []) {
    if (!rule) continue;
    callback(rule);
    if (Array.isArray(rule.oneOf)) walkRules(rule.oneOf, callback);
    if (Array.isArray(rule.rules)) walkRules(rule.rules, callback);
  }
};

const findRule = (rules, predicate) => {
  let foundRule;
  walkRules(rules, (rule) => {
    if (!foundRule && predicate(rule)) {
      foundRule = rule;
    }
  });
  return foundRule;
};

const ruleUsesLoader = (rule, loaderName) => {
  const hasLoader = (entry) => {
    if (!entry) return false;
    if (typeof entry === 'string') return entry.includes(loaderName);
    return entry.loader?.includes(loaderName);
  };

  if (hasLoader(rule.loader)) return true;
  if (Array.isArray(rule.use)) return rule.use.some(hasLoader);
  return hasLoader(rule.use);
};

const defaultRazzleOptions = {
  verbose: false,
  debug: {},
  buildType: 'iso',
  cssPrefix: 'static/css',
  jsPrefix: 'static/js',
  enableSourceMaps: true,
  enableReactRefresh: true,
  enableTargetBabelrc: false,
  enableBabelCache: true,
  forceRuntimeEnvVars: [],
  mediaPrefix: 'static/media',
  staticCssInDev: false,
  emitOnErrors: false,
  disableWebpackbar: false,
  browserslist: [
    '>1%',
    'last 4 versions',
    'Firefox ESR',
    'not ie 11',
    'not dead',
  ],
};

module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: { builder: { useSWC: true } },
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      propFilter: () => true,
    },
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    let baseConfig;
    baseConfig = await createConfig(
      'web',
      'dev',
      {
        // clearConsole: false,
        modifyWebpackConfig: razzleConfig.modifyWebpackConfig,
        plugins: razzleConfig.plugins,
      },
      webpack,
      false,
      undefined,
      [],
      defaultRazzleOptions,
    );
    const { AddonRegistry } = require('@plone/registry/addon-registry');

    const { registry } = AddonRegistry.init(projectRootPath);

    config = lessPlugin({ registry }).modifyWebpackConfig({
      env: { target: 'web', dev: 'dev' },
      webpackConfig: config,
      webpackObject: webpack,
      options: {},
    });

    config = scssPlugin.modifyWebpackConfig({
      env: { target: 'web', dev: 'dev' },
      webpackConfig: config,
      webpackObject: webpack,
      options: { razzleOptions: {} },
    });

    // Put the SVG loader on top and prevent the asset loader
    // from processing the app's SVG icons.
    config.module.rules.unshift(SVGLOADER);
    const assetRule = findRule(
      config.module.rules,
      (rule) => rule.test instanceof RegExp && rule.test.test('.svg'),
    );
    if (assetRule) {
      const excludes = Array.isArray(assetRule.exclude)
        ? assetRule.exclude
        : assetRule.exclude
        ? [assetRule.exclude]
        : [];
      assetRule.exclude = [...excludes, /icons\/.*\.svg$/];
    }

    config.plugins.unshift(
      new webpack.DefinePlugin({
        __DEVELOPMENT__: true,
        __CLIENT__: true,
        __SERVER__: false,
      }),
    );

    const resultConfig = {
      ...config,
      resolve: {
        ...config.resolve,
        alias: { ...config.resolve.alias, ...baseConfig.resolve.alias },
        fallback: { ...config.resolve.fallback, zlib: false },
      },
    };

    // Addons have to be loaded with babel
    const addonPaths = registry
      .getAddons()
      .map((addon) => fs.realpathSync(addon.modulePath));

    const babelRule = findRule(resultConfig.module.rules, (rule) =>
      ruleUsesLoader(rule, 'babel-loader'),
    );
    if (babelRule) {
      babelRule.exclude = (input) =>
        /node_modules\/(?!(@plone\/volto)\/)/.test(input) &&
        !addonPaths.some((addonPath) => input.includes(addonPath));
    }

    const addonExtenders = registry.getAddonExtenders().map((m) => require(m));

    const extendedConfig = addonExtenders.reduce(
      (acc, extender) =>
        extender.modify(acc, { target: 'web', dev: 'dev' }, config),
      resultConfig,
    );

    // Note: we don't actually support razzle plugins, which are also a feature
    // of the razzle.extend.js addons file. Those features are probably
    // provided in a different manner by Storybook plugins (for example scss
    // loaders).

    return extendedConfig;
  },
  babel: async (options) => {
    return {
      ...options,
      plugins: [
        ...options.plugins,
        [
          './node_modules/babel-plugin-root-import/build/index.js',
          {
            rootPathSuffix: './src',
          },
        ],
      ],
    };
  },
};
