import classnames from 'classnames';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../../styles/Grid/GridLabels.css';
import { COLUMN_LABELS, ROW_LABELS } from '../../../common/models/Grid';

const GridLabels = ({ height, width, selectedX, selectedY }) => (
  <g>
    {Immutable.Range(0, width).map((x) => (
      <text
        className={classnames(styles.GridLabel, { [styles.selected]: x === selectedX })}
        key={x}
        stroke="none"
        textAnchor="middle"
        x={x + 0.5}
        y={-0.5}
      >
        {COLUMN_LABELS[x]}
      </text>
    ))}
    {Immutable.Range(0, height).map((y) => (
      <text
        className={classnames(styles.GridLabel, { [styles.selected]: y === selectedY })}
        key={y}
        stroke="none"
        textAnchor="middle"
        x={-0.5}
        y={y + 0.5}
      >
        {ROW_LABELS[y]}
      </text>
    ))}
  </g>
);

GridLabels.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  selectedX: PropTypes.number,
  selectedY: PropTypes.number,
};

export default GridLabels;