import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { UnconnectedCustomLobbyPage } from '../src/client/components/lobby/CustomLobbyPage';
import { ID, TEAMS } from '../src/common/fields/CommonFields';
import { transformLobby } from '../src/server/transforms/LobbyTransform';
import { mockLobby } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper())
  .add('CustomLobby', () => {
    const lobby = transformLobby(mockLobby(), 'p3');
    return (
      <UnconnectedCustomLobbyPage
        lobbyId={lobby.get(ID)}
        userId="p3"
        goToMainMenu={action('goToMainMenu')}
        selectRole={action('selectRole')}
        teams={lobby.get(TEAMS)}
      />
    );
  });

// TODO: State wrapper to test interactions