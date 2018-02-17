import { storiesOf } from '@storybook/react';
import React from 'react';
import DebugPane from '../src/client/components/DebugPane';
import { GAME } from '../src/common/fields/StateFields';
import { FIRST_MATE } from '../src/common/models/Role';
import { mockAppState, mockPlayerData } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

const initialState = mockAppState()
  .set(GAME, mockPlayerData(FIRST_MATE)
    .set('randomPropertyWithALongName',
      'a value for a property with a long name that is even longer than the property name'));
storiesOf('Components', module)
  .addDecorator(StoryWrapper(initialState))
  .add('DebugPane', () => (
    <DebugPane/>
  ));
