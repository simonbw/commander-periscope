import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import EngineerPage from '../src/client/components/game/EngineerPage/index';
import { BREAKDOWNS, SUBSYSTEMS } from '../src/common/fields/GameFields';
import { GAME } from '../src/common/fields/StateFields';
import { LAST_DIRECTION_MOVED, WAITING_FOR_ENGINEER } from '../src/common/fields/TurnInfoFields';
import { TRACK_BREAKDOWN_MESSAGE } from '../src/common/messages/GameMessages';
import { ALL_DIRECTIONS } from '../src/common/models/Direction';
import { ENGINEER } from '../src/common/models/Role';
import { fixCircuits } from '../src/common/util/GameUtils';
import { mockAppState, mockPlayerData } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

const randomDirection = () => ALL_DIRECTIONS[Math.floor(Math.random() * ALL_DIRECTIONS.length)];

const initialState = mockAppState()
  .set(GAME, mockPlayerData(ENGINEER))
  .setIn([GAME, WAITING_FOR_ENGINEER], true)
  .setIn([GAME, LAST_DIRECTION_MOVED], randomDirection());

const emitAction = action('emit');

const emit = (update) => (message, data) => {
  switch (message) {
    case TRACK_BREAKDOWN_MESSAGE:
      const breakdownIndex = data.breakdownIndex;
      update(state => state
        .setIn([GAME, WAITING_FOR_ENGINEER], false)
        .updateIn([GAME, BREAKDOWNS], breakdowns =>
          fixCircuits(state.getIn([GAME, SUBSYSTEMS]), breakdowns.add(breakdownIndex)))
      );
      setTimeout(() => update(state => state
        .setIn([GAME, WAITING_FOR_ENGINEER], true)
        .setIn([GAME, LAST_DIRECTION_MOVED], randomDirection())
      ), 1500);
      break;
    default:
      emitAction(message, data);
  }
};

storiesOf('Components', module)
  .addDecorator(StoryWrapper(initialState, emit))
  .add('EngineerPage', () => {
    return (
      <EngineerPage/>
    );
  });