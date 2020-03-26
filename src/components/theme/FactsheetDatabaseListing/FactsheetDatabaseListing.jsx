import React from 'react';
import { Container, Accordion } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { Portal } from 'react-portal';

import upSVG from '@plone/volto/icons/up-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';

const FactsheetDatabaseListing = props => {
  const sections =
    props.content['@components']?.['factsheet-database-listing'] || [];

  const [activeIndex, setActiveIndex] = React.useState(0);

  function handleClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  }

  return (
    <div>
      <div>
      <Portal node={__CLIENT__ && document.querySelector('#header-leadimage')}>
        {props.content.image && (
          <div className="leadimage-header">
            <div className="leadimage-container">
              <div className="leadimage-wrapper">
                <div className="leadimage document-image"
                  style={{ backgroundImage: `url(${props.content.image.download})` }}
                  >
                </div>
               <div className="image-layer"></div>
               <div className="ui container image-content">
                 <h1 className="leadimage-title">Discover biodiversity in Europe</h1>
               </div>
              </div>
            </div>
          </div>
        )}
      </Portal>
      </div>
      <div className="factsheet-view">
        <Container>
          {props.content.description && (
            <p style={{ padding: '2em 0' }}>{props.content.description}</p>
          )}
          <Accordion fluid styled exclusive={false}>
            {sections.map((section, index) => {
              return(
                <React.Fragment key={section['@id']}>
                  <Accordion.Title
                    active={activeIndex === index}
                    index={index}
                    onClick={handleClick}
                  >
                    <span className="section-title">{section.title}</span>
                    <div className="accordion-tools">
                      {activeIndex === index ? (
                        <Icon name={upSVG} size="40px" color="#f3c715"/>
                      ) : (
                        <Icon name={downSVG} size="40px" color="#f3c715"/>
                      )}
                    </div>
                  </Accordion.Title>
                  <Accordion.Content
                    className={section.id}
                    active={activeIndex === index}
                  >
                    <div className="fdl-listing-section" key={section['@id']}>
                      <table className="fdl-table">
                        <thead>
                        {section.factsheet_group_title && (
                          <tr>
                            <th>{''}</th>
                            <th>{section.factsheet_group_title}</th>
                          </tr>
                        )}
                        </thead>
                        <tbody>
                        {section.items.map(item => (
                          <tr key={item['@id']}>
                            <td>{item.title}</td>
                            {section.factsheet_group_title && (
                              <td>{item.factsheet_group}</td>
                            )}
                          </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  </Accordion.Content>
                </React.Fragment>
              );
            })
           }
          </Accordion>
        </Container>
      </div>
    </div>
  );
};

export default FactsheetDatabaseListing;
