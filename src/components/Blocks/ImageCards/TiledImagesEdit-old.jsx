import { readAsDataURL } from 'promise-file-reader';
import redraft from 'redraft';
import Dropzone from 'react-dropzone';
import Editor from '@plone/volto/components/manage/Blocks/Text/Edit';
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Grid, Button, Item, Dimmer, Loader, Message } from 'semantic-ui-react';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  createAttachment,
  getAllAttachments,
  updateAttachment,
  deleteAttachment,
} from 'volto-addons/actions';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';
import { settings } from '~/config';
import { withRouter } from 'react-router-dom';

import clearIcon from '@plone/volto/icons/clear.svg';
import penIcon from '@plone/volto/icons/pen.svg';

import Loadable from 'react-loadable';

const draftjs = Loadable({
  loader: () => import('draft-js'),
  loading() {
    return <div>Loading...</div>;
  },
});

const draftjsimporthtml = Loadable({
  loader: () => import('draft-js-import-html'),
  loading() {
    return <div>Loading...</div>;
  },
});

const CONTAINER = 'slider-images';

class SlideEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editorState: null,
    };
    this.save = this.save.bind(this);
    this.onChangeBlock = this.onChangeBlock.bind(this);
    this.sendDelete = this.sendDelete.bind(this);
  }

  onChangeBlock(id, data) {
    this.setState({
      editorState: data,
    });
  }

  sendDelete() {
    this.props.onDelete(this.props.slide['@id']);
  }

  save() {
    const text = ReactDOMServer.renderToStaticMarkup(
      redraft(
        this.state.editorState.text,
        settings.ToHTMLRenderers,
        settings.ToHTMLOptions,
      ),
    );
    this.setState({ editing: false }, () => {
      const url = this.props.slide['@id'];
      this.props.onChange(url, { text });
    });
  }

  nop() {}

  node = React.createRef();

  render() {
    const { stateFromHTML } = draftjsimporthtml;
    const { convertToRaw } = draftjs;
    const { slide } = this.props;

    let editorState = stateFromHTML(slide.text.data || '', {
      customBlockFn: settings.FromHTMLCustomBlockFn,
    });

    let text = convertToRaw(editorState);
    const textdata = { text };
    return (
      <div ref={this.node}>
        <Item>
          <Grid cols={12}>
            <Grid.Row>
              <Grid.Column width={2}>
                <Item.Image
                  src={flattenToAppURL(slide.file.scales.thumb.download)}
                />
              </Grid.Column>
              <Grid.Column width={8}>
                {this.state.editing ? (
                  <div>
                    <Editor
                      index={this.props.index}
                      detached={true}
                      selected={this.state.editing}
                      block={slide['@id']}
                      onAddBlock={this.nop}
                      onChangeBlock={this.onChangeBlock}
                      onDeleteBlock={this.nop}
                      onFocusPreviousBlock={this.nop}
                      onFocusNextBlock={this.nop}
                      onSelectBlock={this.nop}
                      onMutateBlock={this.nop}
                      data={textdata}
                      blockNode={this.node}
                    />
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: (slide.text && slide.text.data) || '',
                    }}
                  />
                )}
              </Grid.Column>
              <Grid.Column width={2}>
                {!this.state.editing && (
                  <Button
                    size="mini"
                    onClick={() => this.setState({ editing: true })}
                  >
                    <VoltoIcon size="10" name={penIcon} />
                    Edit
                  </Button>
                )}
                {this.state.editing && (
                  <Button size="mini" onClick={this.save}>
                    <VoltoIcon size="10" name={penIcon} />
                    Save
                  </Button>
                )}
                <Button size="mini" onClick={this.sendDelete}>
                  <VoltoIcon size="10" name={clearIcon} />
                  Delete
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Item>
      </div>
    );
  }
}

class EditSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
    };

    this.onDrop = this.onDrop.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onDrop(acceptedFiles) {
    this.setState({ uploading: true });
    acceptedFiles.forEach(file => {
      readAsDataURL(file).then(data => {
        const fields = data.match(/^data:(.*);(.*),(.*)$/);

        this.props.createAttachment(
          `${getBaseUrl(this.props.pathname)}/@attachments`,
          {
            '@container': CONTAINER,
            text: file.name,
            file: {
              data: fields[3],
              encoding: fields[2],
              'content-type': fields[1],
              filename: file.name,
            },
          },
        );
      });
    });
  }

  onDelete(path) {
    this.props.deleteAttachment(path);
  }

  componentDidMount() {
    const url = `${getBaseUrl(this.props.pathname)}/@attachments`;
    this.props.getAllAttachments(url);
  }

  componentDidUpdate(prevProps) {
    if (this.props.pathname !== prevProps.pathname) {
      const url = `${getBaseUrl(this.props.pathname)}/@attachments`;
      this.props.getAllAttachments(url);
      return;
    }
    if (
      this.props.create_attachment.loaded === true &&
      prevProps.create_attachment.loading === true
    ) {
      this.setState({ uploading: false });
    }
  }

  onChange(url, data) {
    this.props.saveAttachment(url, data);
  }

  render() {
    return (
      <div>
        <Dropzone onDrop={this.onDrop} className="dropzone">
          <Message>
            {(this.state.uploading && (
              <Dimmer active>
                <Loader indeterminate>Uploading</Loader>
              </Dimmer>
            )) || <div>Drag files here</div>}
          </Message>
        </Dropzone>
        <Item.Group divided>
          {this.props.slides.map((at, i) => (
            <SlideEditor
              key={at['@id']}
              slide={at}
              index={i}
              onChange={this.onChange}
              onDelete={this.onDelete}
            />
          ))}
        </Item.Group>
        {this.props.attach_errors || ''}
      </div>
    );
  }
}

function getSliderImages(attachments, new_attachment) {
  if (!attachments) return [];

  const atch = attachments.attachments || [];
  const slider = (atch && atch.find(el => el['@id'] === 'slider-images')) || [];
  let res = [...(slider.items || [])];
  if (new_attachment) res = [new_attachment, ...res];
  return res;
}

// update attachment then sync all attachments
function saveAttachment(path, data) {
  return (dispatch, getState) => {
    const basePath = getState().router.location.pathname;
    return new Promise(resolve => {
      resolve(dispatch(updateAttachment(path, data)));
    }).then(() => {
      const url = `${getBaseUrl(basePath)}/@attachments`;
      dispatch(getAllAttachments(url));
    });
  };
}

export default compose(
  connect(
    (state, props) => ({
      slides: getSliderImages(
        state.attachments || {},
        state.create_attachment.created_attachment,
      ),
      pathname: props.location.pathname,
      attach_errors: state.attachments.errors,
      create_attachment: state.create_attachment,
    }),
    {
      createAttachment,
      getAllAttachments,
      saveAttachment,
      deleteAttachment,
    },
  ),
  withRouter,
)(EditSlider);
