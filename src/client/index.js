import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppContainer from './components/AppContainer';
import SocketContext from './components/SocketContext';
import ThemeProvider from './components/ThemeProvider';
import { initNavigation } from './navigation';
import Socket from './socket';
import Store from './store';

window.addEventListener('DOMContentLoaded', () => {
  
  const store = Store();
  
  let socket;
  const emit = (...args) => {
    console.log('socket.emit', ...args);
    socket.emit(...args);
  };
  
  socket = Socket(
    () => store.getState(),
    (action) => store.dispatch(action),
    emit
  );
  
  initNavigation(store, emit);
  
  render(store, emit);
});

const render = function (store, emit) {
  const root = document.createElement('div');
  document.body.appendChild(root);
  
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider>
        <SocketContext.Provider value={{ emit }}>
          <AppContainer/>
        </SocketContext.Provider>
      </ThemeProvider>
    </Provider>,
    root
  );
};
