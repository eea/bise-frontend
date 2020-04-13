import cx from 'classnames';
import React, { Component } from 'react';

import { Placeholder } from 'semantic-ui-react';

import ImageGallery from 'react-image-gallery';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import 'react-image-gallery/styles/css/image-gallery.css';

class Carousel extends Component {
  renderSlide = card => {
    return (
      <div className="slider-slide">
        <LazyLoadImage
          className="slide-img"
          height={600}
          effect="blur"
          style={{ backgroundImage: `url(${card.attachedimage})` }}
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
          <div className="slide-title">{card.title || ''}</div>
          <div
            className="slide-description"
            dangerouslySetInnerHTML={{ __html: card.text?.data || '' }}
          />
        </div>
      </div>
    );
  };

  render() {
    const { data } = this.props;
    const images = this.props.data.cards;

    return (
      <div
        className={cx(
          'block align imagecards-block',
          {
            center: !Boolean(data.align),
          },
          data.align,
        )}
      >
        <div
          className={cx({
            'full-width': data.align === 'full',
          })}
        >
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
        </div>
      </div>
    );
  }
}

export default Carousel;
