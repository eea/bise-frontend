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
  Breadcrumbs,
} from '@plone/volto/components';

// import HomepageSlider from '~/components/theme/Header/HomepageSlider';
// import homepageSlideIMG from '~/components/theme/Header/images/bise-slide.png';

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
                <div className="tools-search-wrapper">
                  <Navigation
                    pathname={this.props.pathname}
                    navigation={this.props.navigationItems}
                  />
                  {!this.props.token && (
                    <Portal
                      node={
                        __CLIENT__ && document.querySelector('#footer_links')
                      }
                    >
                      <Anontools />
                    </Portal>
                  )}
                  <div className="search">
                    <SearchWidget pathname={this.props.pathname} />
                  </div>
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
            {!this.state.isHomepage && (
              <div style={{ position: 'relative' }}>
                <Breadcrumbs pathname={this.props.pathname} />
                <div id="header-leadimage" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  token: state.userSession.token,
}))(Header);
