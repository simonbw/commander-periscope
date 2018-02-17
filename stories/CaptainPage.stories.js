import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import React, { Component, Fragment } from 'react';
import { UnconnectedDebugPane } from '../src/client/components/DebugPane';
import { UnconnectedCaptainContainer } from '../src/client/components/game/CaptainPage';
import {
  GRID, MINE_LOCATIONS, PHASE, SUB_LOCATION, SUB_PATH, SYSTEMS, TURN_INFO
} from '../src/common/fields/GameFields';
import { WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE } from '../src/common/fields/TurnInfoFields';
import { MAIN_PHASE } from '../src/common/models/GamePhase';
import { getLocationFromDirection } from '../src/common/models/Grid';
import { CAPTAIN } from '../src/common/models/Role';
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from '../src/common/models/System';
import { mockPlayerData } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper())
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
              gamePhase={game.get(PHASE)}
              goSilent={goSilent}
              grid={game.get(GRID)}
              headInDirection={headInDirection}
              mines={game.get(MINE_LOCATIONS)}
              setStartLocation={setStartLocation}
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

const ROUND_TRIP_TIME = 300;

class StateWrapper extends Component {
  constructor(props) {
    super(props);
    const game = mockPlayerData(CAPTAIN);
    this.state = {
      game: game
    }
  }
  
  setStartLocation(location) {
    action('setStartLocation')(...location.toArray());
    setTimeout(() => {
      this.setState((state) => ({
        game: state.game
          .set(SUB_LOCATION, location)
          .set(PHASE, MAIN_PHASE)
      }));
    }, ROUND_TRIP_TIME);
  }
  
  headInDirection(direction) {
    action('headInDirection')(direction);
    setTimeout(() => {
      
      this.setState((state) => {
        const oldLocation = state.game.get(SUB_LOCATION);
        const newLocation = getLocationFromDirection(oldLocation, direction);
        return {
          game: state.game
            .set(SUB_LOCATION, newLocation)
            .update(SUB_PATH, path => path.push(oldLocation))
            .setIn([TURN_INFO, WAITING_FOR_ENGINEER], true)
            .setIn([TURN_INFO, WAITING_FOR_FIRST_MATE], true)
        };
      });
      
      setTimeout(() => {
        this.setState((state) => ({
          game: state.game
            .update(SYSTEMS, systems => systems.map(() => true))
            .setIn([TURN_INFO, WAITING_FOR_ENGINEER], false)
        }))
      }, Math.random() * 1000 + 500);
      
      setTimeout(() => {
        this.setState((state) => ({
          game: state.game
            .setIn([TURN_INFO, WAITING_FOR_FIRST_MATE], false)
        }))
      }, Math.random() * 1000 + 500);
    }, ROUND_TRIP_TIME)
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
    setTimeout(() => {
      this.setState((state) => ({
        game: state.game.setIn([SYSTEMS, TORPEDO], false)
      }));
    }, ROUND_TRIP_TIME);
  }
  
  goSilent(location) {
    action('goSilent')(...location);
    setTimeout(() => {
      this.setState((state) => ({
        game: state.game
          .setIn([SYSTEMS, SILENT], false)
          .update(SUB_PATH, path => path.push(state.game.get(SUB_LOCATION)))
          .set(SUB_LOCATION, location)
      }));
    }, ROUND_TRIP_TIME);
  }
  
  useDrone(sector) {
    action('useDrone')(sector);
    setTimeout(() => {
      this.setState((state) => ({
        game: state.game.setIn([SYSTEMS, DRONE], false)
      }));
    }, ROUND_TRIP_TIME);
  }
  
  useSonar() {
    action('useSonar')();
    setTimeout(() => {
      this.setState(state => ({
        game: state.game.setIn([SYSTEMS, SONAR], false)
      }));
    }, ROUND_TRIP_TIME)
  }
  
  detonateMine(mine) {
    action('detonateMine')(...mine);
    setTimeout(() => {
      this.setState(state => ({
        game: state.game
          .update(MINE_LOCATIONS, mines => mines.filter((m) => !m.equals(mine)))
      }));
    }, ROUND_TRIP_TIME);
  }
  
  surface() {
    action('surface')();
    setTimeout(() => {
      this.setState(state => ({
        game: state.game.set(SUB_PATH, Immutable.List([]))
      }));
    }, ROUND_TRIP_TIME);
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