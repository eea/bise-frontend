import React from 'react';

const FrontpageHeroSchema = {
  title: 'Edit hero',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['lines', 'align'],
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
  },

  required: ['lines'],
};

export default ChartSchema;

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

  required: ['source'],
};
