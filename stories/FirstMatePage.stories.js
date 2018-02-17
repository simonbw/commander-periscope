import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { Fragment } from 'react';
import DebugPane from '../src/client/components/DebugPane';
import FirstMatePage from '../src/client/components/game/FirstMatePage/index';
import { SYSTEMS } from '../src/common/fields/GameFields';
import { GAME } from '../src/common/fields/StateFields';
import { WAITING_FOR_FIRST_MATE } from '../src/common/fields/TurnInfoFields';
import { CHARGE_SYSTEM_MESSAGE } from '../src/common/messages/GameMessages';
import { FIRST_MATE } from '../src/common/models/Role';
import { CHARGE, MAX_CHARGE } from '../src/common/models/System';
import { mockAppState, mockPlayerData } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

const initialState = mockAppState()
  .set(GAME, mockPlayerData(FIRST_MATE))
  .setIn([GAME, WAITING_FOR_FIRST_MATE], true);

const emitAction = action('emit');

const emit = (update) => (message, data) => {
  switch (message) {
    case CHARGE_SYSTEM_MESSAGE:
      update(state => {
        const systemName = data.systemName;
        state = state.setIn([GAME, WAITING_FOR_FIRST_MATE], false);
        if (systemName) {
          state = state.updateIn([GAME, SYSTEMS, systemName], system =>
            system.set(CHARGE, Math.min(system.get(CHARGE) + 1, system.get(MAX_CHARGE))));
        }
        return state;
      });
      setTimeout(() => update(state => state
        .setIn([GAME, WAITING_FOR_FIRST_MATE], true)
      ), 1500);
      break;
    default:
      emitAction(message, data);
  }
};

storiesOf('Components', module)
  .addDecorator(StoryWrapper(initialState, emit))
  .add('FirstMatePage', () => {
    return (
      <Fragment>
        <DebugPane/>
        <FirstMatePage/>
      </Fragment>
    );
  });
