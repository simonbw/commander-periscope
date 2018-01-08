import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { UnconnectedMainMenu } from '../src/client/components/MainMenu';
import '../styles/main.css';

storiesOf('MainMenu', module)
  .add('MainMenu', () => (
    <UnconnectedMainMenu
      createCustomLobby={action('createCustomLobby')}
      joinCustomLobby={action('joinCustomLobby')}
      userId={'userId'}
    />
  ));
