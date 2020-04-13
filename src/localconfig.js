// import HomepageView from '~/components/theme/HomepageView';
import FactsheetDatabaseListing from '~/components/theme/FactsheetDatabaseListing';
import codeSVG from '@plone/volto/icons/code.svg';
import {
  KeyFactsView,
  KeyFactsEdit,
  ImageCardsView,
  ImageCardsEdit,
  // AttachedImagesListWidget,
  AttachedImageWidget,
} from './components';

const applyConfig = config => {
  config.views = {
    ...config.views,
    contentTypesViews: {
      ...config.views.contentTypesViews,
      // 'Plone Site': HomepageView,
    },
    layoutViews: {
      ...config.views.layoutViews,
      factsheet_database_listing_view: FactsheetDatabaseListing,
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
  config.blocks.blocksConfig.imagecards = {
    id: 'imagecards',
    title: 'Image Cards',
    icon: codeSVG,
    group: 'bise',
    view: ImageCardsView,
    edit: ImageCardsEdit,
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
