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
