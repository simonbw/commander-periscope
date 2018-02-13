import React from 'react';
import { Provider } from 'statty';
import { EmitterContext } from '../src/client/components/SocketProvider/SocketProvider';
import ThemeProvider from '../src/client/components/ThemeProvider';
import { initialState } from '../src/client/InitialState';
import { inspect } from '../src/client/Inspector';

const StoryWrapper = (story) => {
  return (
    <Provider state={initialState} inspect={inspect}>
      <ThemeProvider>
        <EmitterContext.Provider value={{ emit: action('emit') }}>
          {story(store)}
        </EmitterContext.Provider>
      </ThemeProvider>
    </Provider>
  );
};

export default StoryWrapper;