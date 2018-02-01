import classnames from 'classnames';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../../../styles/Grid/GridSectors.css'

const GridSectors = ({ selected }) => {
  return (
    <g>
      {Immutable.Range(0, 9).map(i => {
        const row = Math.floor(i / 3);
        const column = i % 3;
        return (
          <g key={i}>
            <rect
              className={classnames(styles.GridSectorBack, { [styles.selected]: i === selected })}
              x={column * 5}
              y={row * 5}
              height={5}
              width={5}
            />
            <text
              className={classnames(styles.GridSectorLabel, { [styles.selected]: i === selected })}
              textAnchor="middle"
              x={column * 5 + 2.5}
              y={row * 5 + 2.5}
            >
              {i + 1}
            </text>
          </g>
        );
      })}
      {/*TODO: Don't hardcode these points */}
      {[[5, 0, 5, 15], [10, 0, 10, 15], [0, 5, 15, 5], [0, 10, 15, 10]].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          className={styles.GridSectorLine}
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
        />
      ))}
    </g>
  );
};

GridSectors.propTypes = {
  selected: PropTypes.number
};

export default GridSectors;