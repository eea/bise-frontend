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

/**
 * Header component class.
 * @class Header
 * @extends Component
 */
class Header extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    token: PropTypes.string,
    pathname: PropTypes.string.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    token: null,
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
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
    );
  }
}

export default connect(state => ({
  token: state.userSession.token,
}))(Header);
