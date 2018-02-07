import { storiesOf } from '@storybook/react';
import { Paper } from 'material-ui';
import React from 'react';
import {
  MineIcon} from '../src/client/components/icons/SystemIcons';
import '../styles/main.css';
import {
  CommsIcon, NuclearIcon, SpecialIcon,
  WeaponsIcon
} from '../src/client/components/icons/SystemTypeIcons';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('Icons', () => (
    <Paper
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        margin: 40,
        maxWidth: 320,
        padding: 20,
      }}
    >
      <WeaponsIcon/>
      <CommsIcon/>
      <SpecialIcon/>
      <NuclearIcon/>
      <MineIcon/>
    </Paper>
  ));
