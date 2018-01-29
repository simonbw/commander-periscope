import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import React from 'react';
import DebugPane, { UnconnectedDebugPane } from '../src/client/components/DebugPane';
import { GRID } from '../src/common/StateFields';
import '../styles/main.css';
import { mockGame } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('DebugPane', () => (
    <UnconnectedDebugPane
      initiallyOpen
      data={mockGame()
        .set(GRID, Immutable.List())
        .set('randomPropertyWithALongName',
          'a value for a property with a long name that is even longer than the property name')}
    />
  ));
