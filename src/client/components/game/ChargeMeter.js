import classnames from 'classnames';
import Immutable from "immutable";
import React from 'react';
import styles from '../../../../styles/ChargeMeter.css';

const ChargeMeter = ({ charge, maxCharge }) => (
  <div className={styles.ChargeMeter}>
    {Immutable.Range(0, maxCharge).map((i) => (
      <div
        className={classnames(
          styles.ChargeMeterUnit,
          { [styles.charged]: i < charge }
        )}
      />
    ))}
  </div>
);

export default ChargeMeter;