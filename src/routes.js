/**
 * Routes.
 * @module routes
 */
import { App } from '@plone/volto/components';
import { defaultRoutes } from '@plone/volto/routes';
import { addonRoutes } from '~/config';

/**
 * Routes array.
 * @array
 * @returns {array} Routes.
 */
const routes = [
  {
    path: '/:lang/n2k',
    component: App, // Change this if you want a different component
    theme: 'n2k',
    routes: [
      // Add your routes here
      // addon routes have a higher priority then default routes
      ...(addonRoutes || []),
      ...defaultRoutes,
    ],
  },
  {
    path: '/',
    component: App, // Change this if you want a different component
    routes: [
      // Add your routes here
      // addon routes have a higher priority then default routes
      ...(addonRoutes || []),
      ...defaultRoutes,
    ],
  },
];

export default routes;
