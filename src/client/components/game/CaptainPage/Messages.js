import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styles from '../../../../../styles/CaptainPage.css';
import FloatingText from '../../FloatingText';
import { PICK_START_LOCATION_MODE } from './ModeWrapper';

const Messages = (props) => (
  <FloatingText className={styles.Messages}>
    {props.mode === PICK_START_LOCATION_MODE ? (
      <div>Choose Start Location</div>
    ) : (
      <Fragment>
        {props.waitingForEngineer ?
          <div className={styles.waiting}>Waiting for Engineer</div> :
          <div className={styles.notWaiting}>Engineer has gone</div>}
        {props.waitingForFirstMate ?
          <div className={styles.waiting}>Waiting for First Mate</div> :
          <div className={styles.notWaiting}>First Mate has gone</div>}
      </Fragment>
    )}
  </FloatingText>
);

Messages.propTypes = {
  mode: PropTypes.string.isRequired,
  waitingForEngineer: PropTypes.bool.isRequired,
  waitingForFirstMate: PropTypes.bool.isRequired,
};

export default Messages;