import { storiesOf } from '@storybook/react';
import React from 'react';
import DebugPane from '../src/client/components/DebugPane';
import '../styles/main.css';
import { mockGame } from '../test/mocks';

storiesOf('DebugPane', module)
  .add('DebugPane', () => (
    <DebugPane data={mockGame()}/>
  ));
