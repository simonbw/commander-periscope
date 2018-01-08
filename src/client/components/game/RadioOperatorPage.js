import React from 'react';
import { connect } from 'react-redux';
import { GAME, GRID } from '../../../common/StateFields';
import DebugPane from '../DebugPane';
import Grid from './GridView';

export const UnconnectedRadioOperatorPage = ({ game }) => (
  <div id="radio-operator-page">
    <DebugPane data={game}/>
    <h1>Radio Operator Page</h1>
    <Grid grid={game.get(GRID)}/>
  </div>
);

export default connect(
  (state) => ({
    game: state.get(GAME),
  }),
  (dispatch) => ({})
)(UnconnectedRadioOperatorPage);