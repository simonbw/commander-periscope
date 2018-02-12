import { Map } from "immutable";
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import SocketContext from '../src/client/components/SocketContext';
import ThemeProvider from '../src/client/components/ThemeProvider';
import reducers from '../src/client/reducers';

const makeStore = () => {
  
  const initialState = Map({
    userId: 'mockUserId'
  });
  return createStore(
    reducers,
    reducers(initialState, { type: 'initialize' })
  );
};

const StoryWrapper = (story) => {
  const store = makeStore();
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SocketContext.Provider value={{ emit: action('emit') }}>
          {story(store)}
        </SocketContext.Provider>
      </ThemeProvider>
    </Provider>
  );
};

export default StoryWrapper;