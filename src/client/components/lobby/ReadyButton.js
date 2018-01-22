import classnames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/CustomLobbyPage.css'; // TODO: Split these up?
import { LOBBY, READIED, USER_ID } from '../../../common/StateFields';
import { ready, unready } from '../../actions/CustomLobbyActions';

class UnconnectedReadyButton extends Component {
  constructor(props) {
    super(props);
    // TODO: Make button visibly update immediately to avoid double clicks
  }
  
  render() {
    const { ready, unready, userIsReady } = this.props;
    return (
      <button
        className={classnames(styles.ReadyButton, { [styles.ready]: userIsReady })}
        onClick={userIsReady ? unready : ready}
        id="ready-button"
      >
        {userIsReady ? 'Unready' : 'Ready'}
      </button>
    );
  }
}

export default connect(
  (state) => ({
    userIsReady: state.hasIn([LOBBY, READIED, state.get(USER_ID)])
  }),
  (dispatch) => ({
    ready: () => dispatch(ready()),
    unready: () => dispatch(unready())
  })
)(UnconnectedReadyButton);