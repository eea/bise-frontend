/**
 * Document view component.
 * @module components/theme/View/ListingView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import { Link } from 'react-router-dom';
import { Segment, Container, Image } from 'semantic-ui-react';
import { Portal } from 'react-portal';
/**
 * List view component class.
 * @function ListingView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */
const ListingView = ({ content }) => (
  <div>
    <Portal node={__CLIENT__ && document.querySelector('#header-leadimage')}>
      {content.image && (
        <div className="leadimage-header">
          <div className="leadimage-container">
            <div className="leadimage-wrapper">
              <div className="leadimage document-image"
                style={{ backgroundImage: `url(${content.image.download})` }}
                >
              </div>
             <div className="image-layer"></div>
             <div className="ui container image-content">
               <h1 className="leadimage-title">{content.title}</h1>
               <p>{content.description}</p>
             </div>
            </div>
          </div>
        </div>
      )}
    </Portal>
    <Container id="page-home">
      <Helmet title={content.title} />
      <section id="content-core">
      {content.items.map(item => (
        <Segment key={item.url} className="listing-item">
          <Container>
            <h2>
              <Link to={item.url} title={item['@type']}>
              {item.title}
              </Link>
            </h2>
            {item.description && <p>{item.description}</p>}
          </Container>
          {item.image && (
            <Image
            size="small"
            alt={item.image_caption ? item.image_caption : item.title}
            src={item.image.scales.thumb.download}
            />
          )}
        </Segment>
      ))}
      </section>
    </Container>
  </div>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ListingView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        '@type': PropTypes.string,
        description: PropTypes.string,
        review_state: PropTypes.string,
        title: PropTypes.string,
        url: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default ListingView;
