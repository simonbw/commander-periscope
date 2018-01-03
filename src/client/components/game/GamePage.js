import React from 'react';
import { connect } from 'react-redux';
import * as Role from '../../../common/Role';
import { getPlayerPosition } from '../../../server/data/GameUtils';
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
      return <div>
        <span>Unknown role: "{role}"</span>
        <pre>{JSON.stringify(game, null, 2)}</pre>
      </div>
  }
};

export default connect(
  (state) => ({
    game: state.get('game'),
    ...getPlayerPosition(state.getIn(['game', 'common', 'teams']), state.get('userId'))
  }),
  (dispatch) => ({})
)(GamePage);