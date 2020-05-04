import { defineMessages, injectIntl } from 'react-intl';
import React, { useState } from 'react';
import cx from 'classnames';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  getBaseUrl,
} from '@plone/volto/helpers';
import { blocks } from '~/config';
import { map } from 'lodash';
import { Grid } from 'semantic-ui-react';
import VisibilitySensor from 'react-visibility-sensor';
import AnchorLink from 'react-anchor-link-smooth-scroll'

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const splitBlocksByTOC = (blockIds, blocksContent) => {
  // find position of first block id where block content is text with h2

  let cursor = blockIds.findIndex((blockId, index) => {
    if (blocksContent[blockId]['@type'] !== 'text') return false;

    const content = blocksContent[blockId];
    const blockType = content.text.blocks[0].type;
    return blockType === 'header-two';
  });
  return [blockIds.slice(0, cursor), blockIds.slice(cursor)];
};

const extractTextKey = block => {
  if (block['@type'] !== 'text') return [];

  const draftBlock = block.text.blocks[0];
  const { text, type, key } = draftBlock;

  if (!HEADLINES.includes(type)) return [];

  return [key, text];
};

const HEADLINES = ['header-two', 'header-three', 'header-four'];

let BlocksWithToc = ({ blockIds, blocksContent, intl, content, location }) => {
  let [activeId, setActiveId] = useState(null);
  const customSetActive = value => {
    return setActiveId(value);
  };
  return (
    <div>
      <Grid className="toc-navigation">
        <Grid.Column width={3}>
          <div className="toc-sidebar">
            <ul className="toc-nav">
              {map(blockIds, blockId => {
                const block = blocksContent[blockId];
                if (!block.text) return null;
                const draftBlock = block.text.blocks[0];
                const { text, type, key } = draftBlock;
                const h4 = type === 'header-four';
                if (!HEADLINES.includes(type)) return null;
                return (
                  <li key={blockId}>
                    <AnchorLink href={`#${key}`} offset={10}
                       className={cx(`toc-nav-header link-${type}`, {
                         selected: activeId === key,
                       })}
                      >
                      {text}
                    </AnchorLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </Grid.Column>
        <Grid.Column width={9} className="toc-content">
        {map(blockIds, blockId => {
          const Block =
            blocks.blocksConfig[(blocksContent?.[blockId]?.['@type'])]?.[
              'view'
            ] || null;
          return Block !== null ? (
            <VisibilitySensor
              scrollCheck={true}
              resizeCheck={true}
              scrollThrottle={100}
              minTopValue={400}
              partialVisibility={true}
              intervalDelay={4000}
              >
              {({ isVisible }) => {
                const [textKey, text] = extractTextKey(
                  blocksContent[blockId],
                );
                if (textKey && isVisible) customSetActive(textKey);
                return (
                  <Block
                    key={blockId}
                    properties={content}
                    data={blocksContent[blockId]}
                    path={getBaseUrl(location?.pathname || '')}
                  />
                );
              }}
            </VisibilitySensor>
          ) : (
            <div key={blockId}>
              {intl.formatMessage(messages.unknownBlock, {
                block: blocksContent?.[blockId]?.['@type'],
              })}
            </div>
          );
        })}
        </Grid.Column>
      </Grid>
    </div>
  );
};

BlocksWithToc = injectIntl(BlocksWithToc);

const TocNavView = ({ content, location, intl }) => {
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
  const blockIds = content[blocksLayoutFieldname].items;
  const blocksContent = content[blocksFieldname];
  const [preambleIds, contentIds] = splitBlocksByTOC(blockIds, blocksContent);
  return (
    <div id="page-document" className="ui container">
      {map(preambleIds, block => {
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
          <div key={block}>
            {intl.formatMessage(messages.unknownBlock, {
              block: content[blocksFieldname]?.[block]?.['@type'],
            })}
          </div>
        );
      })}
      <BlocksWithToc
        content={content}
        blockIds={contentIds}
        blocksContent={blocksContent}
        location={location}
      />
    </div>
  );
};

export default injectIntl(TocNavView);
