/**
 * Add your config changes here.
 * @module config
 * @example
 * export default function applyConfig(config) {
 *   config.settings = {
 *     ...config.settings,
 *     port: 4300,
 *     listBlockTypes: {
 *       ...config.settings.listBlockTypes,
 *       'my-list-item',
 *    }
 * }
 */

// All your imports required for the config here BEFORE this line
import '@plone/volto/config';

export default function applyConfig(config) {
  // Add here your project's configuration here by modifying `config` accordingly
  config.settings = {
    ...config.settings,
    sdf: ['/natura2000/sites/site', '/natura2000/sites/site_cdda'],
    explorer: ['/natura2000/habitats/habitat', '/natura2000/species/species'],
  };

  config.blocks.blocksConfig.video.restricted = false;
  config.blocks.blocksConfig.maps.restricted = false;
  config.blocks.blocksConfig.html.restricted = false;

  return config;
}
