import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import PageContainer from './components/PageContainer';
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
  const root = document.body;
  
  ReactDOM.render(
    <Provider store={store}>
      <PageContainer/>
    </Provider>,
    root
  );
};
