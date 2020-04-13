import cx from 'classnames';
import { Link } from 'react-router-dom';
import { settings } from '~/config';
import { flattenToAppURL } from '@plone/volto/helpers';
import React from 'react';

export const thumbUrl = url =>
  (url || '').includes(settings.apiPath)
    ? `${flattenToAppURL(url)}/@@images/image/preview`
    : url;

export const Card = props => {
  const { title, link, attachedimage } = props; // text,

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

export default RoundTiled;
