import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { UnconnectedCustomLobbyPage } from '../src/client/components/lobby/CustomLobbyPage';
import '../styles/main.css';
import { mockLobby } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('CustomLobby', () => {
    return (
      <UnconnectedCustomLobbyPage
        lobby={mockLobby()}
        userId="p3"
        goToMainMenu={action('goToMainMenu')}
        selectRole={action('selectRole')}
      />
    );
  });

// TODO: State wrapper to test interactions