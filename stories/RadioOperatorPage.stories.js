import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import Random from 'random-js';
import React, { Component } from 'react';
import { UnconnectedRadioOperatorPage } from '../src/client/components/game/RadioOperatorPage/index';
import { GRID } from '../src/common/fields/GameFields';
import { EAST, NORTH, SOUTH, WEST } from '../src/common/models/Direction';
import { DIRECT_HIT, INDIRECT_HIT, MISS } from '../src/common/models/Explosion';
import {
  createDetonateMineNotification, createDroneNotification, createDropMineNotification, createMoveNotification,
  createSilentNotification, createSonarNotification, createSurfaceNotification, createTorpedoNotification,
  NOTIFICATION_ID
} from '../src/common/models/Notifications';
import { BLUE, RED } from '../src/common/models/Team';
import { generateSonarResult } from '../src/common/util/GameUtils';
import { mockGame } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper())
  .add('RadioOperator Adding', () => {
    const grid = mockGame().get(GRID);
    return (
      <StateWrapper>
        {({ notifications }) => (
          <UnconnectedRadioOperatorPage
            grid={grid}
            notifications={notifications}
            team={RED}
          />
        )}
      </StateWrapper>
    );
  })
  .add('RadioOperator Static', () => {
    const grid = mockGame().get(GRID);
    const mockedMoves = Immutable.Range(0, 10).map(() => mockNotification()).toList();
    return (
      <UnconnectedRadioOperatorPage
        grid={grid}
        notifications={mockedMoves}
        team={RED}
      />
    );
  });

class StateWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: Immutable.List(),
    };
  }
  
  componentWillMount() {
    this.interval = setInterval(() => {
      this.setState({ notifications: this.state.notifications.unshift(mockNotification()).take(20) })
    }, 1500);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render() {
    return this.props.children({
      ...this.state,
    })
  }
}

const r = Random();

function randomLocation() {
  return Immutable.List([r.integer(0, 14), r.integer(0, 14)]);
}

const notificationCreators = [
  () => createDetonateMineNotification(BLUE, randomLocation(), r.pick([DIRECT_HIT, INDIRECT_HIT, MISS])),
  () => createDroneNotification(RED, r.integer(0, 8), r.bool(0.5)),
  () => createDropMineNotification(BLUE, randomLocation()),
  () => createMoveNotification(RED, EAST),
  () => createMoveNotification(RED, NORTH),
  () => createMoveNotification(RED, SOUTH),
  () => createMoveNotification(RED, WEST),
  () => createSilentNotification(RED, randomLocation()),
  () => createSonarNotification(RED, generateSonarResult(randomLocation())),
  () => createSurfaceNotification(RED, r.integer(0, 8)),
  () => createTorpedoNotification(RED, randomLocation(), r.pick([DIRECT_HIT, INDIRECT_HIT, MISS])),
];

let lastId = 1;

function mockNotification() {
  return r.pick(notificationCreators)().set(NOTIFICATION_ID, lastId++)
}