import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import GameOverPage from '../src/client/components/game/GameOverPage';
import SurfacedPage from '../src/client/components/game/SurfacedPage';
import LoadingPage from '../src/client/components/LoadingPage';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper())
  .add('LoadingPage', () => (
    <LoadingPage/>
  ))
  .add('SurfacedPage', () => (
    <SurfacedPage/>
  ))
  .add('WinPage', () => (
    <GameOverPage isWinner={true} goToMainMenu={action('goToMainMenu')}/>
  ))
  .add('LosePage', () => (
    <GameOverPage isWinner={false} goToMainMenu={action('goToMainMenu')}/>
  ));
