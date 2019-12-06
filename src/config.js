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

import {
  settings as defaultSettings,
  views as defaultViews,
  widgets as defaultWidgets,
  tiles as defaultTiles,
} from '@plone/volto/config';

export const settings = {
  ...defaultSettings,
};

export const views = {
  ...defaultViews,
};

export const widgets = {
  ...defaultWidgets,
};

export const tiles = {
  ...defaultTiles,
};
