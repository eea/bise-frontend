import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'react-image-gallery/styles/css/image-gallery.css';

import ImageGallery from 'react-image-gallery';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Placeholder } from 'semantic-ui-react';
import { getBasePath } from '~/helpers';

import slideIMG1 from '~/components/theme/Header/images/bise-slide.png';
import slideIMG2 from '~/components/theme/Header/images/forest.jpg';

const images = [
  {
    original: slideIMG1,
    title: 'Nature in Europe',
    description:
      'The source of data and information on biodiversity in Europe.',
  },
  {
    original: slideIMG2,
    title: 'Nature in Europe',
    description:
      'The source of data and information on biodiversity in Europe.',
  },
];

class HomepageSlider extends Component {
  renderSlide = images => {
    return (
      <div className="slider-slide">
        <LazyLoadImage
          className="slide-img"
          height={600}
          effect="blur"
          style={{ backgroundImage: `url(${images.original})` }}
          width={'100%'}
          visibleByDefault={true}
          placeholder={
            <Placeholder>
              <Placeholder.Image rectangular />
            </Placeholder>
          }
        />

        <div className="slide-overlay" />
        <div className="slide-body">
          <div className="slide-title">{images.title || ''}</div>
          <div className="slide-description">{images.description || ''}</div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="slider-wrapper">
        <ImageGallery
          className="mainSlider"
          items={images}
          showFullscreenButton={false}
          showPlayButton={false}
          autoPlay
          renderItem={this.renderSlide}
          slideDuration={300}
          slideInterval={10000}
        />
      </div>
    );
  }
}

export default HomepageSlider;
