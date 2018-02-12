import { Button } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { IS_READY, TEAM_AND_ROLE } from '../../../common/fields/LobbyFields';
import { LOBBY } from '../../../common/fields/StateFields';
import { ready, unready } from '../../actions/CustomLobbyActions';

const UnconnectedReadyButton = (props) => (
  <Button
    variant="raised"
    onClick={props.isReady ? props.unready : props.ready}
    id="ready-button"
    color={props.isReady ? 'secondary' : 'primary'}
    disabled={!props.canReady}
  >
    {props.isReady ? 'Unready' : 'Ready'}
  </Button>
);

UnconnectedReadyButton.propTypes = {
  canReady: PropTypes.bool.isRequired,
  isReady: PropTypes.bool.isRequired,
  ready: PropTypes.func.isRequired,
  unready: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    isReady: Boolean(state.getIn([LOBBY, IS_READY])),
    canReady: Boolean(state.getIn([LOBBY, TEAM_AND_ROLE])),
  }),
  (dispatch) => ({
    ready: () => dispatch(ready()),
    unready: () => dispatch(unready())
  })
)(UnconnectedReadyButton);