import React, { Component } from 'react';
import { map } from 'lodash';
import { Tab, Container } from 'semantic-ui-react';
// import { getContent } from '@plone/volto/actions';
// import { Portal } from 'react-portal';
// import { DefaultView } from '@plone/volto/components';

import { settings, blocks } from '~/config';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  getBaseUrl,
  hasBlocksData,
} from '@plone/volto/helpers';

const renderTab = content => {
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
  const location = content['@id']
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');

  return hasBlocksData(content) ? (
    <div>
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
  ) : (
    <Container id="page-document">
      {content.description && (
        <p className="documentDescription">{content.description}</p>
      )}
      {content.text && (
        <div
          dangerouslySetInnerHTML={{
            __html: content.text.data.replace(
              /a href="([^"]*\.[^"]*)"/g,
              `a href="${settings.apiPath}$1/download/file"`,
            ),
          }}
        />
      )}
    </Container>
  );
};

class ChildrenTabsView extends Component {
  render() {
    return (
      <div className="children-tabs-view">
        <div id="page-document" className="ui container">
          <Tab
            menu={{ attached: false, tabular: false }}
            panes={
              this.props.content.items &&
              this.props.content.items.map(child => ({
                menuItem: child.title,
                render: () => (
                  <Tab.Pane key={child['@id']}>{renderTab(child)}</Tab.Pane>
                ),
              }))
            }
          />
        </div>
      </div>
    );
  }
}

export default ChildrenTabsView;
