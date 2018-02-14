import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'statty';
import AppContainer from './components/AppContainer';
import NavigationWrapper from './components/NavigationWrapper';
import SocketProvider from './components/SocketProvider/SocketProvider';
import ThemeProvider from './components/ThemeProvider';
import { initialState } from './InitialState';
import { inspect } from './Inspector';

window.addEventListener('DOMContentLoaded', () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  
  ReactDOM.render(
    <Provider state={initialState} inspect={inspect}>
      <ThemeProvider>
        <SocketProvider>
          <NavigationWrapper>
            <AppContainer/>
          </NavigationWrapper>
        </SocketProvider>
      </ThemeProvider>
    </Provider>,
    root
  );
});
