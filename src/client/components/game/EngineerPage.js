import React from 'react';
import { connect } from 'react-redux';
import { GAME } from '../../../common/StateFields';
import DebugPane from '../DebugPane';

export const UnconnectedEngineerPage = ({ game }) => (
  <div id="engineer-page">
    <DebugPane data={game}/>
    Engineer Page
  </div>
);

export default connect(
  (state) => ({
    game: state.get(GAME),
  }),
  (dispatch) => ({})
)(UnconnectedEngineerPage);