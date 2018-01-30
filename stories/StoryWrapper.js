import { Map } from "immutable";
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
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
        {story(store)}
      </ThemeProvider>
    </Provider>
  );
};

const oldError = console.error;
console.error = (e) => {
  if (typeof e === "string") {
    throw new Error(e);
  } else {
    oldError.call(console, e)
  }
};

export default StoryWrapper;