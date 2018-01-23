import { Snackbar } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../styles/ConnectionWarner.css';
import { CONNECTED } from '../../common/StateFields';

// TODO: Make this more error-looky
export const UnconnectedConnectionWarner = ({ connected }) => (
  <Snackbar
    anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
    className={styles.ConnectionWarner}
    open={!connected}
    message={<span className={styles.Message}>Uh Oh! Disconnected!</span>}
  />
);

export default connect(
  (state) => ({
    connected: state.get(CONNECTED),
  }),
  () => ({})
)(UnconnectedConnectionWarner);