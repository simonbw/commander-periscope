import { storiesOf } from '@storybook/react';
import React from 'react';
import { UnconnectedRadioOperatorPage } from '../src/client/components/game/RadioOperatorPage';
import { RADIO_OPERATOR } from '../src/common/Role';
import { COMMON, TEAMS } from '../src/common/StateFields';
import { RED } from '../src/common/Team';
import { getDataForUser } from '../src/server/data/UserGameTransform';
import '../styles/main.css';
import { mockGame } from '../test/mocks';

storiesOf('RadioOperatorPage', module)
  .add('Not Started', () => {
    const fullGame = mockGame();
    const gameData = getDataForUser(fullGame, fullGame.getIn([COMMON, TEAMS, RED, RADIO_OPERATOR]));
    return (
      <UnconnectedRadioOperatorPage game={gameData}/>
    );
  });