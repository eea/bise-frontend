import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import { BlockEditForm } from 'volto-addons/BlockForm';

import schema from './schema';
import KeyFactsView from './KeyFactsView';

class Edit extends Component {
  // componentDidMount() {
  //   this.props.changeSidebarState(true);
  // }
  //
  // componentDidUpdate(prevProps) {
  //   this.props.changeSidebarState(true);
  // }

  render() {
    return (
      <div className="block selected">
        <div className="block-inner-wrapper" />

        <KeyFactsView data={this.props.data} />

        <SidebarPortal selected={this.props.selected}>
          <BlockEditForm
            schema={schema}
            title={schema.title}
            onChangeField={(id, value) => {
              this.props.onChangeBlock(this.props.block, {
                ...this.props.data,
                [id]: value,
              });
            }}
            formData={this.props.data}
          />
        </SidebarPortal>
      </div>
    );
  }
}

export default connect(
  null,
  {},
)(Edit);
