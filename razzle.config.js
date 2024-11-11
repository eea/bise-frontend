/**
 * Replace with custom razzle config when needed.
 * @module razzle.config
 */
const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');

const projectRootPath = path.resolve('.');
let voltoPath = `${projectRootPath}/node_modules/@plone/volto`;

const AddonConfigurationRegistry = require(`${voltoPath}/addon-registry`);
const defaultVoltoRazzleConfig = require(`${voltoPath}/razzle.config`);
const createAddonsLoader = require(`${voltoPath}/create-addons-loader`);

const { modifyWebpackConfig } = defaultVoltoRazzleConfig;

const packageJson = require(path.join(projectRootPath, 'package.json'));

const registry = new AddonConfigurationRegistry(projectRootPath);

const customModifyWebpackConfig = ({
  env: { target, dev },
  webpackConfig,
  webpackObject,
  options,
}) => {
  const config = modifyWebpackConfig({
    env: { target, dev },
    webpackConfig,
    webpackObject,
    options,
  });

  // This is a workaround to make sure that swiper package is treated as external

  let addonsAsExternals = [];

  try {
    fs.unlinkSync(config.resolve.alias['load-volto-addons']);
    const addonsLoaderPath = createAddonsLoader(
      [
        ...registry
          .getAddonDependencies()
          .filter((addon) => addon !== '@eeacms/volto-block-style'),
        '@eeacms/volto-block-style',
      ],
      registry.getAddons(),
    );
    config.resolve.alias['load-volto-addons'] = addonsLoaderPath;
  } catch {}

  const { include } = options.webpackOptions.babelRule;
  if (packageJson.name !== '@plone/volto') {
    include.push(fs.realpathSync(`${registry.voltoPath}/src`));
  }

  // Add babel support external (ie. node_modules npm published packages)
  const packagesNames = Object.keys(registry.packages);
  if (registry.packages && packagesNames.length > 0) {
    packagesNames.forEach((addon) => {
      const p = fs.realpathSync(registry.packages[addon].modulePath);
      if (include.indexOf(p) === -1) {
        include.push(p);
      }
    });
    addonsAsExternals = packagesNames.map((addon) => new RegExp(addon));
  }

  if (process.env.ADDONS) {
    addonsFromEnvVar.forEach((addon) => {
      const normalizedAddonName = addon.split(':')[0];
      const p = fs.realpathSync(
        registry.packages[normalizedAddonName].modulePath,
      );
      if (include.indexOf(p) === -1) {
        include.push(p);
      }
      addonsAsExternals = [
        ...addonsAsExternals,
        ...packagesNames.map(
          (normalizedAddonName) => new RegExp(normalizedAddonName),
        ),
      ];
    });
  }

  config.externals =
    target === 'node'
      ? [
          nodeExternals({
            allowlist: [
              dev ? 'webpack/hot/poll?300' : null,
              /\.(eot|woff|woff2|ttf|otf)$/,
              /\.(svg|png|jpg|jpeg|gif|ico)$/,
              /\.(mp4|mp3|ogg|swf|webp)$/,
              /\.(css|scss|sass|sss|less)$/,
              // Add support for addons to include externals (ie. node_modules npm published packages)
              ...addonsAsExternals,
              /swiper/,
              /^@plone\/volto/,
            ].filter(Boolean),
          }),
        ]
      : [];

  return config;
};

module.exports = {
  ...defaultVoltoRazzleConfig,
  modifyWebpackConfig: customModifyWebpackConfig,
};
