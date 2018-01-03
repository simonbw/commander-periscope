import React from 'react';
import { connect } from 'react-redux';
import { ALL_DIRECTIONS } from '../../../common/Direction';
import { WATER_TILE } from '../../../common/Grid';
import { headInDirection, setStartLocation } from '../../actions/GameActions';
import GameDebugPane from './GameDebugPane';
import Grid from './GridView';

const CaptainPage = ({ game, headInDirection, setStartLocation }) => (
  <div id="captain-page">
    Captain Page
    
    {game.get('started') ?
      <DirectionSelect headInDirection={headInDirection}/>
      : <StartLocationChooser
        grid={game.get('grid')}
        setStartLocation={setStartLocation}
        subLocation={game.get('subLocation')}
      />
    }
    
    <GameDebugPane game={game}/>
  </div>
);

export const StartLocationChooser = ({ grid, subLocation, setStartLocation }) => (
  <Grid
    grid={grid}
    subLocation={subLocation}
    canClick={([x, y], tile) => tile === WATER_TILE}
    onClick={(location) => setStartLocation(location)}
  />
);

const DirectionSelect = ({ headInDirection }) => (
  <div>
    {ALL_DIRECTIONS.map(direction => (
      <DirectionButton key={direction} {...{ direction, headInDirection }}/>
    ))}
  </div>
);

const DirectionButton = ({ direction, headInDirection }) => (
  <button onClick={() => headInDirection(direction)}>
    {direction}
  </button>
);

export default connect(
  (state) => ({
    game: state.get('game'),
  }),
  (dispatch) => ({
    headInDirection: (direction) => dispatch(headInDirection(direction)),
    setStartLocation: (location) => dispatch(setStartLocation(location))
  })
)(CaptainPage);