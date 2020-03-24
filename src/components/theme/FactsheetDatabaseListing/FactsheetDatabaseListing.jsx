import React from 'react';

const FactsheetDatabaseListing = props => {
  const sections =
    props.content['@components']?.['factsheet-database-listing'] || [];
  return (
    <div className="fdl">
      {sections.map(section => (
        <div className="fdl-listing-section" key={section['@id']}>
          <h3>{section.title}</h3>
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
      ))}
    </div>
  );
};

export default FactsheetDatabaseListing;
