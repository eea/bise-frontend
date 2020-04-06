import React from 'react';
import cx from 'classnames';

const View = ({ data }) => {
  const { message, message_link, message_link_text, lines } = data;
  return (
    <div
      className={cx(
        'block align keyfacts',
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
                    <a href={message_link}>{message_link_text}</a>
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
