const ImageCard = {
  title: 'Image Card',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'text', 'attachedimage', 'link'],
    },
  ],

  properties: {
    title: {
      type: 'string',
      title: 'Title',
    },
    text: {
      widget: 'richtext',
      title: 'Text',
    },
    link: {
      widget: 'object_by_path',
      title: 'Link',
    },
    attachedimage: {
      widget: 'attachedimage',
      title: 'Image',
    },
  },

  required: ['attachedimage'],
};

const ImageCards = {
  title: 'Image Cards',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'text', 'display', 'align', 'cards'],
    },
  ],

  properties: {
    title: {
      type: 'string',
      title: 'Title',
    },
    text: {
      widget: 'richtext',
      title: 'Text',
    },
    display: {
      title: 'Display',
      choices: [['round_tiled', 'Round Tiled'], ['carousel', 'Carousel']],
    },
    cards: {
      widget: 'objectlist',
      title: 'Images',
      // this is an invention, should confront with dexterity serializer
      schema: ImageCard,
    },
    align: {
      title: 'Alignment',
      widget: 'align',
      type: 'string',
    },
  },

  required: ['display', 'cards'],
};

export default ImageCards;
