/**
 * Header component.
 * @module components/theme/Header/Header
 */

import React, { Component } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Portal } from 'react-portal';

import {
  Anontools,
  Logo,
  Navigation,
  SearchWidget,
} from '@plone/volto/components';

import HomepageSlider from '~/components/theme/Header/HomepageSlider';
import homepageSlideIMG from '~/components/theme/Header/images/bise-slide.png';

/**
 * Header component class.
 * @class Header
 * @extends Component
 */
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHomepage: this.props.actualPathName === '/',
      url: null,
      description: null,
      title: null,
      frontPageSlides: null,
    };
  }
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    token: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    actualPathName: PropTypes.string.isRequired,
    frontPageSlides: PropTypes.array,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    token: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.actualPathName !== this.props.actualPathName) {
      this.setState({
        isHomepage: nextProps.actualPathName === '/',
      });
    }

    if (
      JSON.stringify(nextProps.frontPageSlides) !==
      JSON.stringify(this.props.frontPageSlides)
    ) {
      this.setState({
        frontPageSlides: nextProps.frontPageSlides,
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.actualPathName !== this.props.actualPathName) {
      this.setState({
        isHomepage: this.props.actualPathName === '/',
      });
    }

  }


  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div>
        <Segment basic className="header-wrapper" role="banner">
          <Container>
            <div className="header">
              <div className="logo-nav-wrapper">
                <div className="logo">
                  <Logo />
                </div>
              </div>
              <div className="tools-search-wrapper">
                <Navigation pathname={this.props.pathname} />
                {!this.props.token && (
                  <Portal node={__CLIENT__ && document.querySelector('#footer_links')}>
                    <Anontools />
                  </Portal>
                )}
                <div className="search">
                  <SearchWidget pathname={this.props.pathname} />
                </div>
              </div>
            </div>
          </Container>
        </Segment>
        <div>
          <div
            className={`header-bg ${
              this.state.isHomepage ? 'homepage' : 'contentpage'
            }`}
            >
          </div>

          {this.state.isHomepage ? (
            <div className="homepage-slides">
              <HomepageSlider items={this.props.frontpage_slides} />

              <div className="homepage-slide-wrapper">
                <div className="homepage-slide-img" style={{backgroundImage: `url(${homepageSlideIMG})`}}></div>
                <div className="slide-content ui container">
                  <div className="slide-title">Nature in Europe</div>
                  <div className="slide-description">
                    The source of data and information on biodiversity in Europe.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="header-image">
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  token: state.userSession.token,
}))(Header);
