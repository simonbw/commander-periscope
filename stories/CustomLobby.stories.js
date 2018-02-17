import { storiesOf } from '@storybook/react';
import React from 'react';
import CustomLobbyPage from '../src/client/components/lobby/CustomLobbyPage';
import { LOBBY } from '../src/common/fields/StateFields';
import { transformLobby } from '../src/server/transforms/LobbyTransform';
import { mockAppState, mockLobby } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper(mockAppState().set(LOBBY, transformLobby(mockLobby(), 'p3'))))
  .add('CustomLobby', () => {
    return (
      <CustomLobbyPage/>
    );
  });