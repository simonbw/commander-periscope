import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../styles/ConnectionWarner.css';
import { CONNECTED } from '../../common/StateFields';

export const UnconnectedConnectionWarner = ({ connected }) => {
  if (connected) {
    return null;
  } else {
    return (
      <div className={styles.ConnectionWarner}>
        Uh Oh! Disconnected!
      </div>
    );
  }
};

export default connect(
  (state) => ({
    connected: state.get(CONNECTED),
  }),
  () => ({})
)(UnconnectedConnectionWarner);