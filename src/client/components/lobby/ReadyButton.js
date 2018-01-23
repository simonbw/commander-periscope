import { Button } from 'material-ui';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LOBBY, READIED, TEAMS, USER_ID } from '../../../common/StateFields';
import { getPlayerPosition } from '../../../common/util/GameUtils';
import { ready, unready } from '../../actions/CustomLobbyActions';

class UnconnectedReadyButton extends Component {
  constructor(props) {
    super(props);
    // TODO: Make button visibly update immediately to avoid double clicks
  }
  
  render() {
    const { ready, unready, userIsReady, userHasRole } = this.props;
    return (
      <Button
        raised
        onClick={userIsReady ? unready : ready}
        id="ready-button"
        color={userIsReady ? 'secondary' : 'primary'}
        disabled={!userHasRole}
      >
        {userIsReady ? 'Unready' : 'Ready'}
      </Button>
    );
  }
}

export default connect(
  (state) => ({
    userIsReady: state.hasIn([LOBBY, READIED, state.get(USER_ID)]),
    userHasRole: Boolean(getPlayerPosition(state.getIn([LOBBY, TEAMS]), state.get(USER_ID)))
  }),
  (dispatch) => ({
    ready: () => dispatch(ready()),
    unready: () => dispatch(unready())
  })
)(UnconnectedReadyButton);