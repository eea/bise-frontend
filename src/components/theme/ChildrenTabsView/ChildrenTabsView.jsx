import { Tab } from 'semantic-ui-react';
import React, { Component } from 'react';
import { getContent } from '@plone/volto/actions';
import { DefaultView } from '@plone/volto/components';
import { map } from 'lodash';

import { settings, blocks } from '~/config';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  getBaseUrl,
} from '@plone/volto/helpers';

const renderTab = content => {
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
  const location = content['@id']
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');

  return (
    <div className="ui container">
      {map(content[blocksLayoutFieldname].items, block => {
        const Block =
          blocks.blocksConfig[(content[blocksFieldname]?.[block]?.['@type'])]?.[
            'view'
          ] || null;
        return Block !== null ? (
          <Block
            key={block}
            id={block}
            properties={content}
            data={content[blocksFieldname][block]}
            path={getBaseUrl(location?.pathname || '')}
          />
        ) : (
          <div key={block}>Unknown block</div>
        );
      })}
    </div>
  );
};

class ChildrenTabsView extends Component {
  render() {
    return (
      <Tab
        panes={this.props.content.items.map(child => ({
          menuItem: child.title,
          render: () => (
            <Tab.Pane key={child['@id']}>{renderTab(child)}</Tab.Pane>
          ),
        }))}
      />
    );
  }
}

export default ChildrenTabsView;
