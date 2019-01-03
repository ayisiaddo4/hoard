import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSagas';
import CONFIG from 'src/config';

if (CONFIG.USE_REACTOTRON) {
  var Reactotron = require('./ReactotronConfig').default;
}

const sagaMonitor = CONFIG.USE_REACTOTRON
  ? Reactotron.createSagaMonitor()
  : null;
const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

/* eslint-disable no-underscore-dangle, no-undef */
const composeEnhancers =
  (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
/* eslint-enable no-underscore-dangle, no-undef */

export default function configureStore() {
  const createStoreFunc = CONFIG.USE_REACTOTRON
    ? Reactotron.createStore
    : createStore;
  const store = createStoreFunc(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
