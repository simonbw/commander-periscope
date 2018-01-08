import { storiesOf } from '@storybook/react';
import React from 'react';
import { UnconnectedEngineerPage } from '../src/client/components/game/EngineerPage';
import { RADIO_OPERATOR } from '../src/common/Role';
import { COMMON, TEAMS } from '../src/common/StateFields';
import { RED } from '../src/common/Team';
import { getDataForUser } from '../src/server/data/UserGameTransform';
import '../styles/main.css';
import { mockGame } from '../test/mocks';

storiesOf('EngineerPage', module)
  .add('Not Started', () => {
    const fullGame = mockGame();
    const gameData = getDataForUser(fullGame, fullGame.getIn([COMMON, TEAMS, RED, RADIO_OPERATOR]));
    return (
      <UnconnectedEngineerPage game={gameData}/>
    );
  });