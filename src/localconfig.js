import { DefaultView } from '@plone/volto/components';
import codeSVG from '@plone/volto/icons/code.svg';
import {
  ChildrenTabsView,
  FactsheetDatabaseListing,
  TocNavigationView,
  KeyFactsView,
  KeyFactsEdit,
} from './components';

const applyConfig = config => {
  config.views = {
    ...config.views,
    contentTypesViews: {
      ...config.views.contentTypesViews,
      'Plone Site': DefaultView,
    },
    layoutViews: {
      ...config.views.layoutViews,
      factsheet_database_listing_view: FactsheetDatabaseListing,
      toc_nav_view: TocNavigationView,
      children_tabs_view: ChildrenTabsView,
    },
  };

  config.blocks.groupBlocksOrder.push({ id: 'bise', title: 'BISE specific' });

  config.blocks.blocksConfig.keyfacts = {
    id: 'keyfacts',
    title: 'Key Facts',
    icon: codeSVG,
    group: 'bise',
    view: KeyFactsView,
    edit: KeyFactsEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};

export default applyConfig;
