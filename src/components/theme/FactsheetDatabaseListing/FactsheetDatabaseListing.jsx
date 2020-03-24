import React from 'react';
import { Accordion } from 'semantic-ui-react';

const FactsheetDatabaseListing = props => {
  const sections =
    props.content['@components']?.['factsheet-database-listing'] || [];
  return (
    <Accordion
      exclusive={false}
      fluid
      defaultActiveIndex={[0]}
      panels={sections.map(section => {
        return {
          key: section['@id'],
          title: section.title,
          content: (
            <div className="fdl-listing-section" key={section['@id']}>
              <table>
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
          ),
        };
      })}
    />
  );
};

export default FactsheetDatabaseListing;
