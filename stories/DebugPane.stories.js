import { storiesOf } from '@storybook/react';
import React from 'react';
import DebugPane, { UnconnectedDebugPane } from '../src/client/components/DebugPane';
import '../styles/main.css';
import { UnconnectedEngineerPage } from '../src/client/components/game/EngineerPage';
import { mockGame } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('DebugPane', module)
  .addDecorator(StoryWrapper)
  .add('DebugPane', () => (
    <UnconnectedDebugPane data={mockGame().set('randomPropertyWithALongName', 'a value for a property with a long name that is even longer than the property name')}/>
  ));
