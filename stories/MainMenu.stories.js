import { storiesOf } from '@storybook/react';
import React from 'react';
import MainMenu from '../src/client/components/menu/MainMenu';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper())
  .add('MainMenu', () => (
    <MainMenu/>
  ));
