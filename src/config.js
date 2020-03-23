import * as voltoConfig from '@plone/volto/config';
import {
  applyConfig as addonsConfig,
  // installImageSlides,
} from 'volto-addons/config';

import HomepageView from '~/components/theme/HomepageView';
import FactsheetDatabaseListing from '~/components/theme/FactsheetDatabaseListing';
import { applyConfig as plotlyConfig } from 'volto-plotlycharts/config';
import { applyConfig as ckeditorConfig } from 'volto-ckeditor/config';
// import { applyConfig as draftConfig } from 'volto-drafteditor/config';
import { applyConfig as mosaicConfig } from 'volto-mosaic/config';
import { applyConfig as dataBlocksConfig } from 'volto-datablocks/config';

const config = [
  addonsConfig,
  // installImageSlides,
  plotlyConfig,
  ckeditorConfig,
  // draftConfig,
  mosaicConfig,
  dataBlocksConfig,
].reduce((acc, apply) => apply(acc), voltoConfig);

export const settings = {
  ...config.settings,
};

export const views = {
  ...config.views,
  contentTypesViews: {
    ...config.views.contentTypesViews,
    'Plone Site': HomepageView,
  },
  layoutViews: {
    ...config.views.layoutViews,
    factsheet_database_listing_view: FactsheetDatabaseListing,
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
