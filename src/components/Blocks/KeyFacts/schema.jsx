// import React from 'react';

const LineSchema = {
  title: 'Line',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['upper', 'lower'],
    },
  ],

  properties: {
    upper: {
      type: 'string',
      title: 'Upper text',
    },
    lower: {
      type: 'string',
      title: 'Lower',
    },
  },

  required: ['upper', 'lower'],
};

const KeyFactsSchema = {
  title: 'KeyFacts',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'align',
        'lines',
        'message',
        'message_link_text',
        'message_link',
      ],
    },
  ],

  properties: {
    lines: {
      widget: 'objectlist',
      title: 'Lines',
      // this is an invention, should confront with dexterity serializer
      schema: LineSchema,
    },
    align: {
      title: 'Alignment',
      widget: 'align',
      type: 'string',
    },
    message: {
      type: 'string',
      title: 'Key message',
    },
    message_link_text: {
      type: 'string',
      title: 'Key message link text',
    },
    message_link: {
      type: 'string',
      title: 'Key message link',
    },
  },

  required: ['lines'],
};

export default KeyFactsSchema;
