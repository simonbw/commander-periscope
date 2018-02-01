import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import React, { Component } from 'react';
import { UnconnectedCaptainContainer } from '../src/client/components/game/CaptainPage';
import { getNewLocation } from '../src/common/Grid';
import {
  COMMON,
  GRID,
  STARTED,
  SUB_LOCATION,
  SUB_PATH,
  SYSTEMS,
  TURN_INFO,
  WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE
} from '../src/common/StateFields';
import { getDataForUser } from '../src/server/resources/UserGameTransform';
import '../styles/main.css';
import { mockGame } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('Captain Page', () => {
    return (
      <StateWrapper>
        {({ game, setStartLocation, headInDirection }) => (
          <UnconnectedCaptainContainer
            grid={game.get(GRID)}
            headInDirection={headInDirection}
            setStartLocation={setStartLocation}
            started={game.getIn([COMMON, STARTED])}
            subLocation={game.get(SUB_LOCATION)}
            subPath={game.get(SUB_PATH)}
            systems={game.get(SYSTEMS)}
            waitingForEngineer={game.getIn([TURN_INFO, WAITING_FOR_ENGINEER])}
            waitingForFirstMate={game.getIn([TURN_INFO, WAITING_FOR_FIRST_MATE])}
          />
        )}
      </StateWrapper>
    );
  });

class StateWrapper extends Component {
  constructor(props) {
    super(props);
    const game = getDataForUser(mockGame(), 'p1')
      .update(SYSTEMS, systems => systems.map(() => true));
    this.state = {
      game: game
    }
  }
  
  setStartLocation(location) {
    action('setStartLocation')(Immutable.get(location, 0), Immutable.get(location, 1));
    this.setState({
      game: this.state.game
        .set(SUB_LOCATION, location)
        .setIn([COMMON, STARTED], true)
    })
  }
  
  headInDirection(direction) {
    action('headInDirection')(direction);
    const game = this.state.game;
    const oldLocation = game.get(SUB_LOCATION);
    const newLocation = getNewLocation(oldLocation, direction);
    this.setState({
      game: game
        .set(SUB_LOCATION, newLocation)
        .update(SUB_PATH, path => path.push(oldLocation))
    })
  }
  
  render() {
    return this.props.children({
      setStartLocation: (location) => this.setStartLocation(location),
      headInDirection: (direction) => this.headInDirection(direction),
      ...this.state,
    })
  }
}