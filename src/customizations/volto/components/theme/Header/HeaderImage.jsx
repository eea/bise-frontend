import React from 'react';

function HeaderImage(props) {
  return (
    <div>
      { props.url &&
        <div className="leadimage-header">
          <div className="leadimage-container">
            <div className="leadimage-wrapper">
              <div
                className="leadimage document-image"
                style={{
                  backgroundImage: `url(${props.url})`,
                }}
              />
              <div className="image-layer" />
              <div className="ui container image-content" />
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default HeaderImage;
