const baseCfg = require('@plone/volto/babel');
// "react-loadable/babel"

module.exports = function(api) {
  const voltoConfig = baseCfg(api);
  const presets = voltoConfig.presets;
  const plugins = [...voltoConfig.plugins];
  return {
    plugins,
    presets,
    sourceType: 'unambiguous',
  };
};
