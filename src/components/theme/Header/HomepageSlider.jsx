import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'react-image-gallery/styles/css/image-gallery.css';

import ImageGallery from 'react-image-gallery';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Placeholder } from 'semantic-ui-react';
import { getBasePath } from '~/helpers';

class HomepageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slides: [],
    };
    this.getSlides = this.getSlides.bind(this);
  }

  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
  };

  renderSlide = item => {
    return (
      <div className="slider-slide">

        {item.original ? (
          <LazyLoadImage
            className="slide-img"
            height={601}
            effect="blur"
            style={{ backgroundImage: `url(${getBasePath(item.original)})` }}
            width={'100%'}
            visibleByDefault={true}
            placeholder={
              <Placeholder>
                <Placeholder.Image rectangular />
              </Placeholder>
            }
          />
        ) : (
          <Placeholder>
            <Placeholder.Image rectangular />
          </Placeholder>
        )}

        <div className="slide-overlay" />
        <div className="slide-body">
          <div className="slide-title">{item.title || ''}</div>
          <div className="slide-description">{item.description || ''}</div>
        </div>
      </div>
    );
  };

  getSlides(items) {
    const slidesArr = items ? items : this.props.items;

    const slidesUrl =
      (slidesArr &&
        slidesArr.map((item, index) => {
          return {
            original: item.image,
            thumbnail: item.image,
            title: item.title,
            description: item.description,
          };
        })) ||
      [];

    return slidesUrl;
  }

  render() {
    // if (!this.state.slides.length) return '';
    const slides = this.getSlides(this.props.items);
    return (
      <div className="slider-wrapper">
        <ImageGallery
          className="mainSlider"
          items={slides}
          showFullscreenButton={false}
          showPlayButton={false}
          autoPlay
          renderItem={this.renderSlide}
          renderThumbInner={this.renderThumbnail}
          slideDuration={300}
          slideInterval={10000}
        />
      </div>
    );
  }
}

export default HomepageSlider;
