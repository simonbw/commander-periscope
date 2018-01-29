import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { UnconnectedMainMenu } from '../src/client/components/menu/MainMenu';
import '../styles/main.css';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('MainMenu', () => (
    <UnconnectedMainMenu
      createCustomLobby={action('createCustomLobby')}
      joinCustomLobby={action('joinCustomLobby')}
    />
  ));
