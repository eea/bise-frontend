import React from 'react';
import { settings } from '~/config';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';

export const thumbUrl = url =>
  (url || '').includes(settings.apiPath)
    ? `${flattenToAppURL(url)}/@@images/image/preview`
    : url;

const Card = props => {
  console.log('Card props', props);
  const { title, text, link, attachedimage } = props;

  return (
    <div className="card">
      {link ? (
        <>
          <a href={link}>
            <img
              src={flattenToAppURL(thumbUrl(attachedimage) || '')}
              alt={title}
            />
          </a>
          <h5>
            <a href={link}>{title}</a>
          </h5>
        </>
      ) : (
        <>
          <img
            src={flattenToAppURL(thumbUrl(attachedimage) || '')}
            alt={title}
          />
          <h5>{title}</h5>
        </>
      )}
    </div>
  );
};

const RoundTiled = ({ data }) => {
  const { title, cards } = data;
  return (
    <div className="imagecards">
      <div className="roundtiled">
        <h2>{title}</h2>
        <div className="cards">
          {(cards || []).map(card => (
            <Card {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Carousel = props => {
  return <div>Carousel</div>;
};

const byDisplayType = {
  carousel: Carousel,
  round_tiled: RoundTiled,
};

const ImageCardView = props => {
  console.log('ImageCardView', props);
  const Impl = byDisplayType[props.data.display || 'carousel'];
  return <Impl {...props} />;
};

export default ImageCardView;
