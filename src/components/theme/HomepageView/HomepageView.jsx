/**
 * View container.
 * @module components/theme/View/View
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Portal } from 'react-portal';
import { injectIntl } from 'react-intl';
import qs from 'query-string';
import { views, settings } from '~/config';

import { Comments, Tags, Toolbar } from '@plone/volto/components';
import { listActions, getContent } from '@plone/volto/actions';
import {
  BodyClass,
  getBaseUrl,
  getLayoutFieldname,
} from '@plone/volto/helpers';

import { Grid, Button } from 'semantic-ui-react'

import image1 from './images/image-1.png';
import image2 from './images/image-2.png';
import image3 from './images/image-3.png';
import image4 from './images/image-4.png';
import image5 from './images/image-5.png';
import image6 from './images/image-6.png';
import image7 from './images/image-7.png';
import image8 from './images/image-8.png';

/**
 * View container class.
 * @class View
 * @extends Component
 */
class View extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    actions: PropTypes.shape({
      object: PropTypes.arrayOf(PropTypes.object),
      object_buttons: PropTypes.arrayOf(PropTypes.object),
      user: PropTypes.arrayOf(PropTypes.object),
    }),
    listActions: PropTypes.func.isRequired,
    /**
     * Action to get the content
     */
    getContent: PropTypes.func.isRequired,
    /**
     * Pathname of the object
     */
    pathname: PropTypes.string.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }).isRequired,
    /**
     * Version id of the object
     */
    versionId: PropTypes.string,
    /**
     * Content of the object
     */
    content: PropTypes.shape({
      /**
       * Layout of the object
       */
      layout: PropTypes.string,
      /**
       * Allow discussion of the object
       */
      allow_discussion: PropTypes.bool,
      /**
       * Title of the object
       */
      title: PropTypes.string,
      /**
       * Description of the object
       */
      description: PropTypes.string,
      /**
       * Type of the object
       */
      '@type': PropTypes.string,
      /**
       * Subjects of the object
       */
      subjects: PropTypes.arrayOf(PropTypes.string),
      is_folderish: PropTypes.bool,
    }),
    error: PropTypes.shape({
      /**
       * Error type
       */
      status: PropTypes.number,
    }),
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    actions: null,
    content: null,
    versionId: null,
    error: null,
  };

  state = {
    hasObjectButtons: null,
  };

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  UNSAFE_componentWillMount() {
    !settings.minimizeNetworkFetch &&
      this.props.listActions(getBaseUrl(this.props.pathname));
    this.props.getContent(
      getBaseUrl(this.props.pathname),
      this.props.versionId,
    );
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      !settings.minimizeNetworkFetch &&
        this.props.listActions(getBaseUrl(nextProps.pathname));
      this.props.getContent(
        getBaseUrl(nextProps.pathname),
        this.props.versionId,
      );
    }

    if (nextProps.actions.object_buttons) {
      const objectButtons = nextProps.actions.object_buttons;
      this.setState({
        hasObjectButtons: !!objectButtons.length,
      });
    }
  }

  /**
   * Default fallback view
   * @method getViewDefault
   * @returns {string} Markup for component.
   */
  getViewDefault = () => views.defaultView;

  /**
   * Get view by content type
   * @method getViewByType
   * @returns {string} Markup for component.
   */
  getViewByType = () =>
    views.contentTypesViews[this.props.content['@type']] || null;

  /**
   * Get view by content layout property
   * @method getViewByLayout
   * @returns {string} Markup for component.
   */
  getViewByLayout = () =>
    views.layoutViews[
      this.props.content[getLayoutFieldname(this.props.content)]
    ] || null;

  /**
   * Cleans the component displayName (specially for connected components)
   * which have the Connect(componentDisplayName)
   * @method cleanViewName
   * @param  {string} dirtyDisplayName The displayName
   * @returns {string} Clean displayName (no Connect(...)).
   */
  cleanViewName = dirtyDisplayName =>
    dirtyDisplayName
      .replace('Connect(', '')
      .replace('injectIntl(', '')
      .replace(')', '')
      .replace('connect(', '')
      .toLowerCase();

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (this.props.error) {
      let FoundView;
      if (this.props.error.status === undefined) {
        // For some reason, while development and if CORS is in place and the
        // requested resource is 404, it returns undefined as status, then the
        // next statement will fail
        FoundView = views.errorViews['404'];
      } else {
        FoundView = views.errorViews[this.props.error.status.toString()];
      }
      if (!FoundView) {
        FoundView = views.errorViews['404']; // default to 404
      }
      return (
        <div id="view">
          <FoundView />
        </div>
      );
    }
    if (!this.props.content) {
      return <span />;
    }
    const RenderedView =
      this.getViewByType() || this.getViewByLayout() || this.getViewDefault();

    return (
      <div id="view">
        {/* Body class if displayName in component is set */}
        <BodyClass
          className={
            RenderedView.displayName
              ? `view-${this.cleanViewName(RenderedView.displayName)}`
              : null
          }
        />

        <RenderedView
          content={this.props.content}
          location={this.props.location}
          token={this.props.token}
          history={this.props.history}
        />

        <div className="fp-explore-section">
          <div className="explore-section-wrapper fp-content">
            <h2>Explore</h2>
            <Grid>
              <Grid.Row columns={4}>
                <Grid.Column>
                  <a href="" className="area-section">
                    <div className="area-image">
                      <img src={image1} alt="" />
                    </div>
                    <div className="area-content">
                      <h5 className="area-title">
                        Discover <br /> biodiversity
                      </h5>
                    </div>
                  </a>
                </Grid.Column>
                <Grid.Column>
                  <a href="/" className="area-section">
                    <div className="area-image">
                      <img src={image2} alt="" />
                    </div>
                    <div className="area-content">
                      <h5 className="area-title">
                        Track progress in <br /> protecting nature
                      </h5>
                    </div>
                  </a>
                </Grid.Column>
                <Grid.Column>
                  <a href="/" className="area-section">
                    <div className="area-image">
                      <img src={image3} alt="" />
                    </div>
                    <div className="area-content">
                      <h5 className="area-title">
                        Explore <br /> ecosystems
                      </h5>
                    </div>
                  </a>
                </Grid.Column>
                <Grid.Column>
                  <a href="/" className="area-section">
                    <div className="area-image">
                      <img src={image4} alt="" />
                    </div>
                    <div className="area-content">
                      <h5 className="area-title">
                        Understand <br /> protected areas
                      </h5>
                    </div>
                  </a>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={4}>
                <Grid.Column>
                  <a href="" className="area-section">
                    <div className="area-image">
                      <img src={image5} alt="" />
                    </div>
                    <div className="area-content">
                      <h5 className="area-title">
                        Understand <br /> biodiversity policy
                      </h5>
                    </div>
                  </a>
                </Grid.Column>
                <Grid.Column>
                  <a href="/" className="area-section">
                    <div className="area-image">
                      <img src={image6} alt="" />
                    </div>
                    <div className="area-content">
                      <h5 className="area-title">
                        Be informed on <br /> Green Infrastructure
                      </h5>
                    </div>
                  </a>
                </Grid.Column>
                <Grid.Column>
                  <a href="/" className="area-section">
                    <div className="area-image">
                      <img src={image7} alt="" />
                    </div>
                    <div className="area-content">
                      <h5 className="area-title">
                        Find biodiversity <br /> data
                      </h5>
                    </div>
                  </a>
                </Grid.Column>
                <Grid.Column>
                  <a href="/" className="area-section">
                    <div className="area-image">
                      <img src={image8} alt="" />
                    </div>
                    <div className="area-content">
                      <h5 className="area-title">
                        Explore challenges <br /> to biodiversity
                      </h5>
                    </div>
                  </a>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>

        <div className="fp-stats-wrapper">
          <div className="fp-content">
            <Grid columns='equal'>
              <Grid.Column width={5}>
                <div className="fp-data-title-wrapper">
                  <h1>What does the EU do to protect Biodiversity?</h1>
                  <Button content='Explore figures in detail' primary />
                </div>
              </Grid.Column>
              <Grid.Column>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <div className="fp-data-wrapper">
                        <div className="fp-data-title">127 000</div>
                        <p className="fp-data-desc">protected areas</p>
                      </div>
                    </Grid.Column>
                    <Grid.Column>
                      <div className="fp-data-wrapper">
                        <div className="fp-data-title">1 000 000 km<sup>2</sup></div>
                        <p className="fp-data-desc">of land protected</p>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <div className="fp-data-wrapper">
                        <div className="fp-data-title">23%</div>
                        <p className="fp-data-desc">of the EU</p>
                      </div>
                    </Grid.Column>
                    <Grid.Column>
                      <div className="fp-data-wrapper">
                        <div className="fp-data-title">600 000 km<sup>2</sup></div>
                        <p className="fp-data-desc">of ocean protected</p>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <div className="fp-data-wrapper">
                        <div className="fp-data-title">250</div>
                        <p className="fp-data-desc">protected habitats</p>
                      </div>
                    </Grid.Column>
                    <Grid.Column>
                      <div className="fp-data-wrapper">
                        <div className="fp-data-title">2 500</div>
                        <p className="fp-data-desc">protected species</p>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid>
          </div>
        </div>

        {this.props.content.subjects &&
          this.props.content.subjects.length > 0 && (
            <Tags tags={this.props.content.subjects} />
          )}
        {/* Add opt-in social sharing if required, disabled by default */}
        {/* In the future this might be parameterized from the app config */}
        {/* <SocialSharing
          url={typeof window === 'undefined' ? '' : window.location.href}
          title={this.props.content.title}
          description={this.props.content.description || ''}
        /> */}
        {this.props.content.allow_discussion && (
          <Comments pathname={this.props.pathname} />
        )}

        <Portal node={__CLIENT__ && document.getElementById('toolbar')}>
          <Toolbar pathname={this.props.pathname} inner={<span />} />
        </Portal>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      actions: state.actions.actions,
      token: state.userSession.token,
      content: state.content.data,
      error: state.content.get.error,
      pathname: props.location.pathname,
      versionId:
        qs.parse(props.location.search) &&
        qs.parse(props.location.search).version_id,
    }),
    {
      listActions,
      getContent,
    },
  ),
)(View);
