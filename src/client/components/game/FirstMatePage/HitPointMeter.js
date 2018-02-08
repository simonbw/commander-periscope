import classnames from 'classnames';
import Immutable from "immutable";
import { Paper } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../../../styles/HitPointMeter.css';
import { MAX_HIT_POINTS } from '../../../../server/resources/GameFactory';

const HitPointMeter = ({ hitPoints }) => (
  <Paper className={styles.HitPointMeterPaper}>
    <h2>Hit Points</h2>
    <div className={styles.HitPointMeter}>
      {Immutable.Range(0, MAX_HIT_POINTS).map((i) => (
        <div
          key={i}
          className={classnames(
            styles.HitPointMeterUnit,
            { [styles.charged]: i < hitPoints }
          )}
        />
      ))}
    </div>
  </Paper>
);

HitPointMeter.propTypes = {
  hitPoints: PropTypes.number.isRequired,
};

export default HitPointMeter;