import cx from 'classnames';
import { Link } from 'react-router-dom';
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
          <Link to={link}>
            <img
              src={flattenToAppURL(thumbUrl(attachedimage) || '')}
              alt={title}
            />
          </Link>
          <h5>
            <Link to={link}>{title}</Link>
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
        <div className="roundtiled">
          <h2>{title}</h2>
          <div className="cards">
            {(cards || []).map(card => (
              <Card {...card} />
            ))}
          </div>
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
