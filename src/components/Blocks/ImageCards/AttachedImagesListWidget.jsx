import { readAsDataURL } from 'promise-file-reader';
import { connect } from 'react-redux';
import {
  Button,
  Dimmer,
  Form,
  Grid,
  Loader,
  Label,
  Item,
  Icon as IconOld,
  Message,
} from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import React, { Fragment, Component } from 'react';
import deleteSVG from '@plone/volto/icons/delete.svg';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { Field } from '@plone/volto/components';
import { defineMessages } from 'react-intl';
import { map } from 'lodash';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';

import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import { createContent } from '@plone/volto/actions';

import { settings } from '~/config';

// import uploadSVG from '@plone/volto/icons/upload.svg';
// import clearSVG from '@plone/volto/icons/clear.svg';
// import navTreeSVG from '@plone/volto/icons/nav.svg';
// import aheadSVG from '@plone/volto/icons/ahead.svg';
// import ImageWidget from './Object';
// import { Segment, Label } from 'semantic-ui-react';

const messages = defineMessages({
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  idTitle: {
    id: 'Short Name',
    defaultMessage: 'Short Name',
  },
  idDescription: {
    id: 'Used for programmatic access to the fieldset.',
    defaultMessage: 'Used for programmatic access to the fieldset.',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  required: {
    id: 'Required',
    defaultMessage: 'Required',
  },
  delete: {
    id: 'Delete',
    defaultMessage: 'Delete',
  },
});

export const thumbUrl = url =>
  (url || '').includes(settings.apiPath)
    ? `${flattenToAppURL(url)}/@@images/image/thumb`
    : url;

export class UnconnectedAttachedImageWidget extends Component {
  // Can show a preview of uploaded image.
  // If there's no uploaded image, shows a drag&drop area

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
    };

    this.onDrop = this.onDrop.bind(this);
  }

  componentDidMount() {
    if (this.props.focus) {
      this.node.focus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.request.loading &&
      this.props.request.loaded &&
      this.state.uploading
    ) {
      this.setState({
        uploading: false,
      });

      const url = this.props.content['@id'];
      this.props.onChange(this.props.id, url);
    }
  }

  onDrop(acceptedFiles) {
    this.setState({ uploading: true });

    acceptedFiles.forEach(file => {
      readAsDataURL(file).then(data => {
        const fields = data.match(/^data:(.*);(.*),(.*)$/);
        // console.log('fields', fields);

        this.props.createContent(getBaseUrl(this.props.pathname), {
          '@type': 'Image',
          title: file.name,
          image: {
            data: fields[3],
            encoding: fields[2],
            'content-type': fields[1],
            filename: file.name,
          },
        });
      });
    });
  }

  render() {
    const {
      id,
      title,
      required,
      description,
      error,
      value,
      onEdit,
      onDelete,
      intl,
      icon,
      iconAction,
      fieldSet,
    } = this.props;

    const schema = {
      fieldsets: [
        {
          id: 'default',
          title: intl.formatMessage(messages.default),
          fields: ['title', 'id', 'description', 'required'],
        },
      ],
      properties: {
        id: {
          type: 'string',
          title: intl.formatMessage(messages.idTitle),
          description: intl.formatMessage(messages.idDescription),
        },
        title: {
          type: 'string',
          title: intl.formatMessage(messages.title),
        },
        description: {
          type: 'string',
          widget: 'textarea',
          title: intl.formatMessage(messages.description),
        },
        required: {
          type: 'boolean',
          title: intl.formatMessage(messages.required),
        },
      },
      required: ['id', 'title'],
    };

    return (
      <Form.Field
        inline
        required={required}
        error={error.length > 0}
        className={description ? 'help text' : 'text'}
        id={`${fieldSet || 'field'}-${id}`}
      >
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width="4">
              <div className="wrapper">
                <label htmlFor={`field-${id}`}>
                  {onEdit && (
                    <i
                      aria-hidden="true"
                      className="grey bars icon drag handle"
                    />
                  )}
                  {title}
                </label>
              </div>
            </Grid.Column>
            <Grid.Column width="8">
              {onEdit && (
                <div className="toolbar">
                  <button
                    className="item ui noborder button"
                    onClick={() => onEdit(id, schema)}
                  >
                    <IconOld name="write square" size="large" color="blue" />
                  </button>
                  <button
                    aria-label={this.props.intl.formatMessage(messages.delete)}
                    className="item ui noborder button"
                    onClick={() => onDelete(id)}
                  >
                    <IconOld name="close" size="large" color="red" />
                  </button>
                </div>
              )}

              {value ? (
                <Item>
                  <Item.Image src={flattenToAppURL(thumbUrl(value) || '')} />
                </Item>
              ) : (
                <div>
                  <Dropzone onDrop={this.onDrop} className="dropzone">
                    <Message>
                      {this.state.uploading && (
                        <Dimmer active>
                          <Loader indeterminate>Uploading</Loader>
                        </Dimmer>
                      )}

                      <center>
                        <img src={imageBlockSVG} alt="" />
                        <div className="discreet">Click or drag file here</div>
                      </center>
                    </Message>
                  </Dropzone>
                </div>
              )}

              {map(error, message => (
                <Label key={message} basic color="red" pointing>
                  {message}
                </Label>
              ))}
              {icon && iconAction && (
                <button onClick={iconAction}>
                  <VoltoIcon name={icon} size="18px" />
                </button>
              )}
            </Grid.Column>
          </Grid.Row>
          {description && (
            <Grid.Row stretched>
              <Grid.Column stretched width="12">
                <p className="help">{description}</p>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Form.Field>
    );
  }
}

const Attachment = ({ schema, value, onChange, errors = {}, block }) => {
  return (
    <>
      {schema.fieldsets[0].fields.map((field, index) => {
        return (
          <Field
            {...schema.properties[field]}
            id={field}
            fieldSet={schema.fieldsets[0].title.toLowerCase()}
            focus={index === 0}
            value={value[field]}
            required={schema.required.indexOf(field) !== -1}
            onChange={(id, value) => onChange(field, value)}
            key={field}
            error={errors[field] || []}
            block={block}
          />
        );
      })}
    </>
  );
};

export const AttachedImageWidget = connect(
  (state, props) => ({
    pathname: state.router.location.pathname,
    content: state.content.data,
    request: state.content.create,
  }),
  {
    createContent,
  },
)(UnconnectedAttachedImageWidget);

const AttachedImagesListWidget = ({
  id,
  value = [],
  schema,
  onChange,
  block,
  ...props
}) => {
  // TODO: notice that the Fragment key={} might cause problems, need to test
  const empty = {};
  return (
    <>
      <h4>{schema.title}</h4>
      {!value && <Attachment schema={schema} />}
      {value.map((obj, index) => (
        <Fragment key={index}>
          <Form.Field inline>
            <Grid>
              <Grid.Row>
                <Grid.Column columns={1}>
                  <Button.Group>
                    <Button
                      basic
                      circular
                      size="mini"
                      onClick={() =>
                        onChange(id, value.filter((v, i) => i !== index))
                      }
                    >
                      <VoltoIcon size="20px" name={deleteSVG} />
                    </Button>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form.Field>
          <Attachment
            key={index}
            schema={schema}
            value={obj}
            block={block}
            onChange={(fi, fv) =>
              onChange(
                id,
                value.map((v, i) => (i !== index ? v : { ...v, [fi]: fv })),
              )
            }
          />
          <hr />
        </Fragment>
      ))}
      <Form.Field inline>
        <Grid>
          <Grid.Row stretched>
            <Grid.Column stretched columns={12}>
              <div className="wrapper">
                <Button
                  primary
                  onClick={() => {
                    onChange(id, [...value, empty]);
                  }}
                >
                  Add {schema.title}
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form.Field>
    </>
  );
};

export default AttachedImagesListWidget;
