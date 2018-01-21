import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppContainer from './components/AppContainer';
import Socket from './socket';
import Store from './store';

window.addEventListener('DOMContentLoaded', () => {
  // TODO: Maybe clean this up with dependency injection
  let socket;
  const store = Store(() => socket);
  socket = Socket(() => store);
  
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
