import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { save, load } from 'redux-localstorage-simple';

import config from '@plone/volto/registry';
import reducers from '~/reducers';

import { api, crashReporter } from '@plone/volto/middleware';

const configureStore = (initialState, history, apiHelper) => {
  const settings = config.settings;
  let stack = [
    routerMiddleware(history),
    crashReporter,
    thunk,
    api(apiHelper),
    ...(__CLIENT__
      ? [save({ states: settings.persistentReducers, debounce: 500 })]
      : []),
  ];
  stack = settings.storeExtenders.reduce(
    (acc, extender) => extender(acc),
    stack,
  );
  const middlewares = composeWithDevTools(applyMiddleware(...stack));
  const store = createStore(
    combineReducers({
      router: connectRouter(history),
      ...reducers,
      ...config.addonReducers,
    }),
    {
      ...initialState,
      ...(__CLIENT__ ? load({ states: settings.persistentReducers }) : {}),
    },
    middlewares,
  );

  return store;
};

export default configureStore;
