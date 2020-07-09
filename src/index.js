/**
 * Replace with custom runner when needed.
 * @module index
 */

// import start from 'volto-base/start-server';
import start from '@plone/volto/start-server';

const reloadServer = start();

if (module.hot) {
  reloadServer();
}
