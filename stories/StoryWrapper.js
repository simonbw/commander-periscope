import { action } from '@storybook/addon-actions';
import React from 'react';
import { Provider, State } from 'statty';
import { EmitterContext } from '../src/client/components/SocketProvider/SocketProvider';
import ThemeProvider from '../src/client/components/ThemeProvider';
import { inspect } from '../src/client/Inspector';
import '../styles/main.css';
import { mockAppState } from '../test/mocks';

const StoryWrapper = (initialState = mockAppState(), emit = () => action('emit')) => (story) => (
  <Provider state={initialState} inspect={inspect}>
    <ThemeProvider>
      <State
        render={(state, update) => (
          <EmitterContext.Provider value={{ emit: emit(update) }}>
            {story()}
          </EmitterContext.Provider>
        )}
      />
    </ThemeProvider>
  </Provider>
);

export default StoryWrapper;