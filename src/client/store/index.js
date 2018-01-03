import { Map } from 'immutable';
import { applyMiddleware, createStore } from 'redux';
import ReduxMulti from 'redux-multi';
import ReduxThunk from 'redux-thunk';
import reducers from '../reducers';
import { getUserId } from '../user';
import SocketMiddleware from './SocketMiddleware';

const LoggingMiddleware = (store) => (next) => (action) => {
  console.log('dispatching', action);
  next(action);
};

export default (getSocket) => {
  let initialState = Map({
    userId: getUserId()
  });
  initialState = reducers(initialState, { type: 'initialize' });
  
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(
      LoggingMiddleware,
      ReduxThunk,
      ReduxMulti,
      SocketMiddleware(getSocket))
  );
  window._store = store; // For debugging
  return store;
};