import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import { BlockEditForm } from 'volto-addons/BlockForm';
import ImageCardsView from './ImageCardsView';

import schema from './schema';

const ImageCardEdit = props => {
  return (
    <div className="block selected">
      <div className="block-inner-wrapper">
        <ImageCardsView data={props.data} />
      </div>

      <SidebarPortal selected={props.selected}>
        <BlockEditForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: value,
            });
          }}
          formData={props.data}
          block={props.block}
        />
      </SidebarPortal>
    </div>
  );
};

export default ImageCardEdit;
