import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { UnconnectedCustomLobbyPage } from '../src/client/components/lobby/CustomLobbyPage';
import LoadingPage from '../src/client/components/LoadingPage';
import '../styles/main.css';
import { mockLobby } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('CustomLobby', module)
  .addDecorator(StoryWrapper)
  .add('Loading', () => {
    return (
      <LoadingPage/>
    );
  })
  .add('InLobby', () => {
    return (
      <UnconnectedCustomLobbyPage
        lobby={mockLobby()}
        goToMainMenu={action('goToMainMenu')}
      />
    );
  });