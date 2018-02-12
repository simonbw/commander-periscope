import { Button } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { IS_READY, TEAM_AND_ROLE } from '../../../common/fields/LobbyFields';
import { LOBBY } from '../../../common/fields/StateFields';
import { CUSTOM_LOBBY_READY_MESSAGE, CUSTOM_LOBBY_UNREADY_MESSAGE } from '../../../common/messages/LobbyMessages';
import SocketContext from '../SocketContext';

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
  () => ({})
)((stateProps) => (
  <SocketContext.Consumer>
    {({ emit }) => (
      <UnconnectedReadyButton
        ready={() => emit(CUSTOM_LOBBY_READY_MESSAGE)}
        unready={() => emit(CUSTOM_LOBBY_UNREADY_MESSAGE)}
        isReady={stateProps.isReady}
        canReady={stateProps.canReady}
      />
    )}
  </SocketContext.Consumer>
));