const baseCfg = require('@plone/volto/babel');

module.exports = function (api) {
  const voltoConfig = baseCfg(api);
  const presets = voltoConfig.presets;
  const plugins = [
    ...voltoConfig.plugins,
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ];
  return {
    plugins,
    presets,
    sourceType: 'unambiguous',
  };
};
