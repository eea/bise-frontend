import React, { Component } from 'react';
import { getContent } from '@plone/volto/actions';
import { map } from 'lodash';
import { Portal } from 'react-portal';
import { Tab, Container } from 'semantic-ui-react';
import { DefaultView } from '@plone/volto/components';

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
        {this.props.content.image && (
          <Portal
            node={__CLIENT__ && document.querySelector('#header-leadimage')}
          >
            <div className="leadimage-header">
              <div className="leadimage-container">
                <div className="leadimage-wrapper">
                  <div
                    className="leadimage document-image"
                    style={{
                      backgroundImage: `url(${this.props.content.image.download})`,
                    }}
                  />
                  <div className="image-layer" />
                  <div className="ui container image-content">
                    <h1 className="leadimage-title">{this.props.content.title}</h1>
                    <p>{this.props.content.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </Portal>
        )}
        <div id="page-document" className="ui container">
          <Tab
            menu={{ attached: false, tabular: false }}
            panes={this.props.content.items && this.props.content.items.map(child => ({
              menuItem: child.title,
              render: () => (
                <Tab.Pane key={child['@id']}>{renderTab(child)}</Tab.Pane>
              ),
            }))}
          />
        </div>
      </div>
    );
  }
}

export default ChildrenTabsView;
