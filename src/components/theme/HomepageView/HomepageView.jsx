/**
 * View container.
 * @module components/theme/View/View
 */

import React from 'react';
import { Grid, Button } from 'semantic-ui-react';

import image1 from './images/image-1.png';
import image2 from './images/image-2.png';
import image3 from './images/image-3.png';
import image4 from './images/image-4.png';
import image5 from './images/image-5.png';
import image6 from './images/image-6.png';
import image7 from './images/image-7.png';
import image8 from './images/image-8.png';

export default props => (
  <div>
    <div className="fp-explore-section">
      <div className="explore-section-wrapper fp-content">
        <h2>Explore</h2>
        <Grid>
          <Grid.Column className="area-wrapper" mobile={6} tablet={6} computer={3}>
            <a href="/" className="area-section">
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
          <Grid.Column className="area-wrapper" mobile={6} tablet={6} computer={3}>
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
          <Grid.Column className="area-wrapper" mobile={6} tablet={6} computer={3}>
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
          <Grid.Column className="area-wrapper" mobile={6} tablet={6} computer={3}>
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
        </Grid>

        <Grid>
          <Grid.Column className="area-wrapper" mobile={6} tablet={6} computer={3}>
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
          <Grid.Column className="area-wrapper" mobile={6} tablet={6} computer={3}>
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
          <Grid.Column className="area-wrapper" mobile={6} tablet={6} computer={3}>
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
          <Grid.Column className="area-wrapper" mobile={6} tablet={6} computer={3}>
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
        </Grid>
      </div>
    </div>

    <div className="fp-stats-wrapper">
      <div className="fp-content">
        <Grid columns="equal" stackable>
          <Grid.Column width={5}>
            <div className="fp-data-title-wrapper">
              <div className="fp-data-title-box">
                <h1>What does the EU do to protect Biodiversity?</h1>
                <Button content="Explore figures in detail" primary />
              </div>
            </div>
          </Grid.Column>

          <Grid.Column>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column className="fp-content-data">
                  <div className="fp-data-wrapper">
                    <div className="fp-data-title">127 000</div>
                    <p className="fp-data-desc">protected areas</p>
                  </div>
                </Grid.Column>
                <Grid.Column className="fp-content-data">
                  <div className="fp-data-wrapper">
                    <div className="fp-data-title">
                      1 000 000 km<sup>2</sup>
                    </div>
                    <p className="fp-data-desc">of land protected</p>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column className="fp-content-data">
                  <div className="fp-data-wrapper">
                    <div className="fp-data-title">23%</div>
                    <p className="fp-data-desc">of the EU</p>
                  </div>
                </Grid.Column>
                <Grid.Column className="fp-content-data">
                  <div className="fp-data-wrapper">
                    <div className="fp-data-title">
                      600 000 km<sup>2</sup>
                    </div>
                    <p className="fp-data-desc">of ocean protected</p>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column className="fp-content-data">
                  <div className="fp-data-wrapper">
                    <div className="fp-data-title">250</div>
                    <p className="fp-data-desc">protected habitats</p>
                  </div>
                </Grid.Column>
                <Grid.Column className="fp-content-data">
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
  </div>
);
