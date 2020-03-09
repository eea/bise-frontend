/**
 * Add your config changes here.
 * @module config
 * @example
 * export const settings = {
 *   ...defaultSettings,
 *   port: 4300,
 *   listBlockTypes: {
 *     ...defaultSettings.listBlockTypes,
 *     'my-list-item',
 *   }
 * }
 */
import * as voltoConfig from '@plone/volto/config';
import {
  applyConfig as addonsConfig,
  // installImageSlides,
} from 'volto-addons/config';

import {
  settings as defaultSettings,
  views as defaultViews,
  widgets as defaultWidgets,
  blocks as defaultblocks,
} from '@plone/volto/config';

import HomepageView from '~/components/theme/HomepageView/HomepageView';
// import { applyConfig as plotlyConfig } from 'volto-plotlycharts/config';
// import { applyConfig as ckeditorConfig } from 'volto-ckeditor/config';
// import { applyConfig as draftConfig } from 'volto-drafteditor/config';
// import { applyConfig as mosaicConfig } from 'volto-mosaic/config';
// import { applyConfig as dataBlocksConfig } from 'volto-datablocks/config';

const config = [
  addonsConfig,
  // installImageSlides,
  // plotlyConfig,
  // ckeditorConfig,
  // draftConfig,
  // mosaicConfig,
  // dataBlocksConfig,
].reduce((acc, apply) => apply(acc), voltoConfig);

export const settings = {
  ...config.settings,
};

export const views = {
  ...config.views,
  layoutViews: {
    ...config.views.layoutViews,
    homepage_view: HomepageView,
  },
};

export const widgets = {
  ...config.widgets,
};

export const blocks = {
  ...config.blocks,
};

export const addonReducers = { ...config.addonReducers };
export const addonRoutes = [...(config.addonRoutes || [])];

export const viewlets = [...(config.viewlets || [])];

export const portlets = {
  ...config.portlets,
};

export const editForms = {
  ...config.editForms,
};
