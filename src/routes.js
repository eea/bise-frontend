/**
 * Routes.
 * @module routes
 */
import { App } from '@plone/volto/components';
import FakeLocation from '~/FakeLocation';
import { defaultRoutes } from '@plone/volto/routes';
import { addonRoutes } from '~/config';

/**
 * Routes array.
 * @array
 * @returns {array} Routes.
 */
const routes = [
  {
    path: '/n2k/sites/:site_code',
    realPathname: '/n2k/sites/site',
    theme: 'n2k',
    component: FakeLocation,
    renderComponent: App,
    routes: [
      // Add your routes here
      // addon routes have a higher priority then default routes
      ...defaultRoutes.map((route) => ({
        ...route,
        ...(route.path === '/**' ? { path: route.path + '/:site_code' } : {}),
        realPathname: '/n2k/sites/site',
        component: FakeLocation,
        renderComponent: route.component,
      })),
    ],
  },
  {
    path: '/n2k',
    theme: 'n2k',
    component: App, // Change this if you want a different component
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
