import { action } from '@storybook/addon-actions';
import React from 'react';
import { EmitterContext } from '../src/client/components/SocketProvider/SocketProvider';
import ThemeProvider from '../src/client/components/ThemeProvider';

const StoryWrapper = (story) => {
  return (
    <ThemeProvider>
      <EmitterContext.Provider value={{ emit: action('emit') }}>
        {story()}
      </EmitterContext.Provider>
    </ThemeProvider>
  );
};

export default StoryWrapper;