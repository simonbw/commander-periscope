import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import React, { Component, Fragment } from 'react';
import { UnconnectedDebugPane } from '../src/client/components/DebugPane';
import { UnconnectedCaptainContainer } from '../src/client/components/game/CaptainPage';
import { getLocationFromDirection } from '../src/common/Grid';
import { CAPTAIN } from '../src/common/Role';
import {
  COMMON,
  GRID,
  MINE_LOCATIONS,
  STARTED,
  SUB_LOCATION,
  SUB_PATH,
  SYSTEMS,
  TURN_INFO,
  WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE
} from '../src/common/StateFields';
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from '../src/common/System';
import '../styles/main.css';
import { mockPlayerData } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('Captain Page', () => {
    return (
      <StateWrapper>
        {({ game, detonateMine, dropMine, fireTorpedo, goSilent, headInDirection, setStartLocation, surface, useDrone, useSonar }) => (
          <Fragment>
            <UnconnectedDebugPane data={game}/>
            <UnconnectedCaptainContainer
              detonateMine={detonateMine}
              dropMine={dropMine}
              fireTorpedo={fireTorpedo}
              goSilent={goSilent}
              grid={game.get(GRID)}
              headInDirection={headInDirection}
              mines={game.get(MINE_LOCATIONS)}
              setStartLocation={setStartLocation}
              started={game.getIn([COMMON, STARTED])}
              subLocation={game.get(SUB_LOCATION)}
              subPath={game.get(SUB_PATH)}
              surface={surface}
              systems={game.get(SYSTEMS)}
              useDrone={useDrone}
              useSonar={useSonar}
              waitingForEngineer={game.getIn([TURN_INFO, WAITING_FOR_ENGINEER])}
              waitingForFirstMate={game.getIn([TURN_INFO, WAITING_FOR_FIRST_MATE])}
            />
          </Fragment>
        )}
      </StateWrapper>
    );
  });

class StateWrapper extends Component {
  constructor(props) {
    super(props);
    const game = mockPlayerData(CAPTAIN);
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
    const newLocation = getLocationFromDirection(oldLocation, direction);
    this.setState({
      game: game
        .set(SUB_LOCATION, newLocation)
        .update(SUB_PATH, path => path.push(oldLocation))
        .update(SYSTEMS, systems => systems.map(() => true))
    })
  }
  
  dropMine(location) {
    action('dropMine')(...location);
    this.setState({
      game: this.state.game
        .update(MINE_LOCATIONS, mines => mines.push(location))
        .setIn([SYSTEMS, MINE], false)
    });
  }
  
  fireTorpedo(location) {
    action('fireTorpedo')(...location);
    this.setState({
      game: this.state.game.setIn([SYSTEMS, TORPEDO], false)
    });
  }
  
  goSilent(location) {
    action('goSilent')(...location);
    const game = this.state.game;
    this.setState({
      game: game
        .setIn([SYSTEMS, SILENT], false)
        .update(SUB_PATH, path => path.push(game.get(SUB_LOCATION)))
        .set(SUB_LOCATION, location)
    });
  }
  
  useDrone(sector) {
    action('useDrone')(sector);
    this.setState({
      game: this.state.game.setIn([SYSTEMS, DRONE], false)
    });
  }
  
  useSonar() {
    action('useSonar')();
    this.setState({
      game: this.state.game.setIn([SYSTEMS, SONAR], false)
    });
  }
  
  detonateMine(mine) {
    action('detonateMine')(...mine);
    this.setState({
      game: this.state.game
        .update(MINE_LOCATIONS, mines => mines.filter((m) => !m.equals(mine)))
    });
  }
  
  surface() {
    action('surface')();
    this.setState({
      game: this.state.game.set(SUB_PATH, Immutable.List([]))
    });
  }
  
  render() {
    return this.props.children({
      detonateMine: (location) => this.detonateMine(location),
      dropMine: (location) => this.dropMine(location),
      fireTorpedo: (location) => this.fireTorpedo(location),
      goSilent: (location) => this.goSilent(location),
      headInDirection: (direction) => this.headInDirection(direction),
      setStartLocation: (location) => this.setStartLocation(location),
      surface: () => this.surface(),
      useDrone: (sector) => this.useDrone(sector),
      useSonar: () => this.useSonar(),
      ...this.state,
    })
  }
}