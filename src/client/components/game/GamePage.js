import React from 'react';
import { connect } from 'react-redux';
import * as Role from '../../../common/Role';
import { COMMON, GAME, TEAMS, USER_ID } from '../../../common/StateFields';
import { getPlayerPosition } from '../../../common/util/GameUtils';
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
      return (
        <div id="unknown-role-page">
          <span>Unknown role: "{role}"</span>
          <pre>{JSON.stringify(game, null, 2)}</pre>
        </div>
      );
  }
};

export default connect(
  (state) => ({
    game: state.get(GAME),
    ...getPlayerPosition(state.getIn([GAME, COMMON, TEAMS]), state.get(USER_ID))
  }),
  (dispatch) => ({})
)(GamePage);