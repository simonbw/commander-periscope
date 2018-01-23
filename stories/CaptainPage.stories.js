import { action, decorateAction } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import React from 'react';
import { UnconnectedCaptainPage } from '../src/client/components/game/CaptainPage';
import { CAPTAIN } from '../src/common/Role';
import {
  COMMON, STARTED, SUB_LOCATION, SUB_PATH, SYSTEMS, TEAMS, TURN_INFO, WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE
} from '../src/common/StateFields';
import { CHARGE, DRONE, MAX_CHARGE } from '../src/common/System';
import { RED } from '../src/common/Team';
import { getDataForUser } from '../src/server/resources/UserGameTransform';
import '../styles/main.css';
import { mockGame } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

const locationAction = decorateAction([(args) => [args[0].get(0), args[0].get(1)]]);

storiesOf('CaptainPage', module)
  .addDecorator(StoryWrapper)
  .add('Not Started', () => {
    const fullGame = mockGame();
    const gameData = getDataForUser(fullGame, fullGame.getIn([COMMON, TEAMS, RED, CAPTAIN]));
    return (
      <UnconnectedCaptainPage
        game={gameData}
        headInDirection={action('headInDirection')}
        setStartLocation={locationAction('setStartLocation')}
      />
    );
  })
  .add('Waiting', () => {
    const fullGame = mockGame()
      .setIn([RED, SUB_LOCATION], Immutable.List([4, 3]))
      .setIn([RED, SUB_PATH], Immutable.fromJS([[4, 4], [4, 5], [5, 5]]))
      .updateIn([RED, TURN_INFO], (turnInfo) => turnInfo
        .set(WAITING_FOR_ENGINEER, true)
        .set(WAITING_FOR_FIRST_MATE, true))
      .setIn([COMMON, STARTED], true);
    const gameData = getDataForUser(fullGame, fullGame.getIn([COMMON, TEAMS, RED, CAPTAIN]));
    return (
      <UnconnectedCaptainPage
        game={gameData}
        headInDirection={action('headInDirection')}
        setStartLocation={locationAction('setStartLocation')}
      />
    );
  })
  .add('Started', () => {
    const fullGame = mockGame()
      .setIn([COMMON, STARTED], true)
      .setIn([RED, SUB_LOCATION], Immutable.List([4, 3]))
      .setIn([RED, SUB_PATH], Immutable.fromJS([[4, 4], [4, 5], [5, 5]]))
      .updateIn([RED, SYSTEMS, DRONE], (drone) => drone.set(CHARGE, drone.get(MAX_CHARGE)));
    const gameData = getDataForUser(fullGame, fullGame.getIn([COMMON, TEAMS, RED, CAPTAIN]));
    return (
      <UnconnectedCaptainPage
        game={gameData}
        headInDirection={action('headInDirection')}
        setStartLocation={locationAction('setStartLocation')}
      />
    )
  });
