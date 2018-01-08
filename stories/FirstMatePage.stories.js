import { action, decorateAction } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { UnconnectedFirstMatePage } from '../src/client/components/game/FirstMatePage';
import { FIRST_MATE } from '../src/common/Role';
import { COMMON, STARTED, TEAMS, WAITING_FOR_FIRST_MATE } from '../src/common/StateFields';
import { RED } from '../src/common/Team';
import { getDataForUser } from '../src/server/data/UserGameTransform';
import '../styles/main.css';
import { mockGame } from '../test/mocks';

storiesOf('FirstMatePage', module)
  .add('Not Started', () => {
    const fullGame = mockGame();
    const gameData = getDataForUser(fullGame, fullGame.getIn([COMMON, TEAMS, RED, FIRST_MATE]));
    return (
      <UnconnectedFirstMatePage
        game={gameData}
        chargeSystem={action('chargeSystem')}
      />
    );
  })
  .add('Waiting', () => {
    const fullGame = mockGame()
      .set(WAITING_FOR_FIRST_MATE, false)
      .setIn([COMMON, STARTED], true);
    const gameData = getDataForUser(fullGame, fullGame.getIn([COMMON, TEAMS, RED, FIRST_MATE]));
    return (
      <UnconnectedFirstMatePage
        game={gameData}
        chargeSystem={action('chargeSystem')}
      />
    );
  })
  .add('Ready', () => {
    const fullGame = mockGame()
      .set(WAITING_FOR_FIRST_MATE, true)
      .setIn([COMMON, STARTED], true);
    const gameData = getDataForUser(fullGame, fullGame.getIn([COMMON, TEAMS, RED, FIRST_MATE]));
    
    return (
      <UnconnectedFirstMatePage
        game={gameData}
        chargeSystem={action('chargeSystem')}
      />
    );
  });