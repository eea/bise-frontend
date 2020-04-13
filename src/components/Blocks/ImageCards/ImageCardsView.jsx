import React from 'react';
import RoundTiled from './RoundTiled';
import Carousel from './Carousel';

const byDisplayType = {
  carousel: Carousel,
  round_tiled: RoundTiled,
};

const ImageCardView = props => {
  const Impl = byDisplayType[props.data.display || 'carousel'];
  return <Impl {...props} />;
};

export default ImageCardView;
