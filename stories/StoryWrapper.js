import { action } from '@storybook/addon-actions';
import React from 'react';
import { Provider } from 'statty';
import { EmitterContext } from '../src/client/components/SocketProvider/SocketProvider';
import ThemeProvider from '../src/client/components/ThemeProvider';
import { inspect } from '../src/client/Inspector';
import '../styles/main.css';
import { mockAppState } from '../test/mocks';

const StoryWrapper = (initialState = mockAppState()) => (story) => (
  <Provider state={initialState} inspect={inspect}>
    <ThemeProvider>
      <EmitterContext.Provider value={{ emit: action('emit') }}>
        {story()}
      </EmitterContext.Provider>
    </ThemeProvider>
  </Provider>
);

export default StoryWrapper;