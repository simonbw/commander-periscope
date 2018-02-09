import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppContainer from './components/AppContainer';
import { initNavigation } from './navigation';
import Socket from './socket';
import Store from './store';

window.addEventListener('DOMContentLoaded', () => {
  
  let socket, store;
  socket = Socket(() => store.getState(), (action) => store.dispatch(action));
  store = Store(() => socket);
  
  initNavigation(() => store);
  
  render(store);
});

const render = function (store) {
  const root = document.createElement('div');
  document.body.appendChild(root);
  
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer/>
    </Provider>,
    root
  );
};
