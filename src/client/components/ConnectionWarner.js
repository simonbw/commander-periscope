import { Snackbar } from 'material-ui';

import PropTypes from 'prop-types';
import React from 'react';
import { State } from 'statty';
import styles from '../../../styles/ConnectionWarner.css';
import { CONNECTED } from '../../common/fields/StateFields';

// TODO: Make this not show up at the beginning
export const UnconnectedConnectionWarner = ({ connected }) => (
  <Snackbar
    anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
    className={styles.ConnectionWarner}
    open={!connected}
    message={<span className={styles.Message}>Uh Oh! Disconnected!</span>}
  />
);

UnconnectedConnectionWarner.propTypes = {
  connected: PropTypes.bool.isRequired,
};

const ConnectedConnectionWarner = () => (
  <State
    select={(state) => ({
      connected: state.get(CONNECTED),
    })}
    render={({ connected }) => (
      <UnconnectedConnectionWarner connected={connected}/>
    )}
  />
);

export default ConnectedConnectionWarner;