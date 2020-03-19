/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container, List, Segment, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import LogoImage from '@plone/volto/components/theme/Logo/Logo.svg';
import ecLogo from './ec.png';
import eeaLogo from './eea.png';
import fiseLogo from './forest.svg';
import ccaLogo from './cca.svg';
import wiseLogo from './wise.png';

const messages = defineMessages({
  copyright: {
    id: 'Copyright',
    defaultMessage: 'Copyright',
  },
});

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = ({ intl }) => (
  <Segment
    role="contentinfo"
    vertical
    padded
    className="footerWrapper"
  >
    <Container>
      <div className="footer-top-wrapper">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={10} computer={10}>
              <ul className="footer-nav" id="footer_links">
                <li>
                  <Link className="item" to="/">
                    <FormattedMessage
                      id="home"
                      defaultMessage="Home"
                      />
                  </Link>
                </li>
                <li>
                  <a className="item" href={`mailto:bise@eea.europa.eu`}>
                    Contact
                  </a>
                </li>
                <li>
                  <Link className="item" to="/sitemap">
                    <FormattedMessage
                      id="sitemap"
                      defaultMessage="Sitemap"
                      />
                  </Link>
                </li>
                <li>
                  <Link className="item" to="/">
                    <FormattedMessage
                      id="legal_notice"
                      defaultMessage="Privacy and legal notice"
                      />
                  </Link>
                </li>
              </ul>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={2} computer={2}>
              <img
                style={{ height: '50px', marginTop: '0.8rem'}}
                src={LogoImage}
                alt="BISE"
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>

      <div className="site-info">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={5}
                         style={{ marginBottom: '1.5em'}}>
              <div>
                <p>
                  The Biodiversity information system for Europe is a partnership
                  between <br /> the <a href="https://ec.europa.eu/" target="_blank">
                  European Commission</a> and
                  the <a href="https://www.eea.europa.eu/" target="_blank">
                  European Environment Agency.</a>
                </p>.{' '}
              </div>
              <div>
                <a href="https://ec.europa.eu/" title="European Commission">
                  <img className="footerLogo" src={ecLogo} alt="" />
                </a>
                <a
                  href="https://www.eea.europa.eu/"
                  title="European Environment Agency">
                  <img className="footerLogo" src={eeaLogo} alt="" />
                </a>
              </div>
            </Grid.Column>

            <Grid.Column mobile={16} tablet={16} computer={7}
                         style={{ marginBottom: '0.8rem'}}>
              <div>
                <p>Other European Information Systems</p>
              </div>
              <div className="footerLogos">
                <a href="https://water.europa.eu/"
                   title="Water Information System for Europe">
                  <img className="footerLogo" src={wiseLogo} alt="" />
                </a>
                <a href="https://forest.eea.europa.eu/"
                   title="Forest Information System for Europe">
                  <img className="footerLogo" src={fiseLogo} alt="" />
                </a>
                <a
                  href="https://climate-adapt.eea.europa.eu/"
                  title="Climate-Adapt">
                  <img className="footerLogo" src={ccaLogo} alt="" />
                </a>
              </div>
            </Grid.Column>
         </Grid.Row>
        </Grid>
      </div>
    </Container>
  </Segment>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default injectIntl(Footer);
