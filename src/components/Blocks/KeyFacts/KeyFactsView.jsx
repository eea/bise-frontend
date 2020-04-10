import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';

const View = ({ data }) => {
  const { message, message_link, message_link_text, lines } = data;
  return (
    <div
      className={cx(
        'block align keyfacts-block',
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
        <div className="block-wrapper">
          <div className="title-wrapper">
            <div className="title">
              {message ? (
                <>
                  <div className="headline">{message}</div>
                  {message_link && (
                    <Link className="ui primary button" to={message_link}>
                      {message_link_text}
                    </Link>
                  )}
                </>
              ) : (
                ''
              )}
            </div>
          </div>

          <div className="facts-wrapper">
            {(lines || []).map(line => (
              <div class="fact">
                <div className="upper">{line.upper}</div>
                <div className="lower">{line.lower}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
