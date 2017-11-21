import React from 'react';
import { connect } from 'react-redux';
import * as Role from '../../models/Role';
import CaptainPage from './CaptainPage';
import EngineerPage from './EngineerPage';
import FirstMatePage from './FirstMatePage';
import RadioOperatorPage from './RadioOperatorPage';

const GamePage = ({ role, game }) => {
  switch (role) {
    case Role.CAPTAIN:
      return <CaptainPage/>;
    case Role.ENGINEER:
      return <EngineerPage/>;
    case Role.FIRST_MATE:
      return <FirstMatePage/>;
    case Role.RADIO_OPERATOR:
      return <RadioOperatorPage/>;
    default:
      return <pre>{JSON.stringify(game, null, 2)}</pre>
  }
};

export default connect(
  (state) => ({
    game: state.get('game')
  }),
  (dispatch) => ({})
)(GamePage);