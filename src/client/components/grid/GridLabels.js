import classnames from 'classnames';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../../styles/Grid/GridLabels.css';

export const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// TODO: This should probably be a PureComponent
const GridLabels = ({ height, width, selectedX, selectedY }) => (
  <g>
    {Immutable.Range(0, width).map((x) => (
      <text
        className={classnames(styles.GridLabel, { [styles.selected]: x === selectedX })}
        key={x}
        stroke="none"
        textAnchor="middle"
        x={x + 0.5}
        y={-0.333} /* TODO: Why? */
      >
        {ROW_LABELS[x]}
      </text>
    ))}
    {Immutable.Range(0, height).map((y) => (
      <text
        className={classnames(styles.GridLabel, { [styles.selected]: y === selectedY })}
        key={y}
        stroke="none"
        textAnchor="middle"
        x={-0.5}
        y={y + 0.6666} /* TODO: Why is this 0.6666? */
      >
        {y}
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