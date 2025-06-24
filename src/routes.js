/**
 * Routes.
 * @module routes
 */

import { App } from '@plone/volto/components';
import FakeLocation from './FakeLocation';
import { defaultRoutes } from '@plone/volto/routes';
import config from '@plone/volto/registry';
import { Sitemap } from '@eeacms/volto-n2k/components';

/**
 * Routes array.
 * @array
 * @returns {array} Routes.
 */

const routes = [
  {
    path: '/sites/natura2000/:site_code', // EE0010173
    realPathname: '/natura2000/sites/site',
    component: FakeLocation,
    renderComponent: App,
    routes: [
      // Add your routes here
      // addon routes have a higher priority then default routes
      ...defaultRoutes.map((route) => ({
        ...route,
        ...(route.path === '/**' ? { path: route.path + '/:site_code' } : {}),
        ...(route.path === '/**/edit' ? { path: '/**/:site_code/edit' } : {}),
        realPathname: '/natura2000/sites/site',
        component: FakeLocation,
        renderComponent: route.component,
      })),
    ],
  },
  {
    path: '/sites/national/:site_code', // 11155
    realPathname: '/natura2000/sites/site_cdda',
    component: FakeLocation,
    renderComponent: App,
    routes: [
      // Add your routes here
      // addon routes have a higher priority then default routes
      ...defaultRoutes.map((route) => ({
        ...route,
        ...(route.path === '/**' ? { path: route.path + '/:site_code' } : {}),
        ...(route.path === '/**/edit' ? { path: '/**/:site_code/edit' } : {}),
        realPathname: '/natura2000/sites/site_cdda',
        component: FakeLocation,
        renderComponent: route.component,
      })),
    ],
  },
  {
    path: '/sites/emerald/:site_code', // AL0000017
    realPathname: '/natura2000/sites/emerald',
    component: FakeLocation,
    renderComponent: App,
    routes: [
      // Add your routes here
      // addon routes have a higher priority then default routes
      ...defaultRoutes.map((route) => ({
        ...route,
        ...(route.path === '/**' ? { path: route.path + '/:site_code' } : {}),
        ...(route.path === '/**/edit' ? { path: '/**/:site_code/edit' } : {}),
        realPathname: '/natura2000/sites/emerald',
        component: FakeLocation,
        renderComponent: route.component,
      })),
    ],
  },
  {
    path: '/habitats/:habitat_unique_id', // ANNEX1_8240
    realPathname: '/natura2000/habitats/habitat',
    component: FakeLocation,
    renderComponent: App,
    routes: [
      // Add your routes here
      // addon routes have a higher priority then default routes
      ...defaultRoutes.map((route) => ({
        ...route,
        ...(route.path === '/**' ? { path: route.path + '/:habitat_unique_id' } : {}),
        ...(route.path === '/**/edit' ? { path: '/**/:habitat_unique_id/edit' } : {}),
        realPathname: '/natura2000/habitats/habitat',
        component: FakeLocation,
        renderComponent: route.component,
      })),
    ],
  },
  {
    path: '/species/:id_eunis', // 1435
    realPathname: '/natura2000/species/species',
    component: FakeLocation,
    renderComponent: App,
    routes: [
      // Add your routes here
      // addon routes have a higher priority then default routes
      ...defaultRoutes.map((route) => ({
        ...route,
        ...(route.path === '/**' ? { path: route.path + '/:id_eunis' } : {}),
        ...(route.path === '/**/edit' ? { path: '/**/:id_eunis/edit' } : {}),
        realPathname: '/natura2000/species/species',
        component: FakeLocation,
        renderComponent: route.component,
      })),
    ],
  },
  /**
   * sites/site
   * sites/site_cdda
   * habitats/habitat
   * species/species
   */
  {
    path: '/natura2000',
    component: App, // Change this if you want a different component
    routes: [
      // Add your routes here
      // addon routes have a higher priority then default routes
      {
        path: '/natura2000/sitemap',
        component: Sitemap,
      },
      ...(config.addonRoutes || []),
      ...defaultRoutes,
    ],
  },
  {
    path: '/',
    component: App, // Change this if you want a different component
    routes: [
      // Add your routes here
      // addon routes have a higher priority then default routes
      ...(config.addonRoutes || []),
      ...defaultRoutes,
    ],
  },
];

export default routes;
