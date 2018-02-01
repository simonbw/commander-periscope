import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../../../styles/Grid/GridBackground.css'

// TODO: This should probably be a PureComponent
const GridBackground = ({ width, height }) => (
  <g>
    <rect
      className={styles.GridBackground}
      x={0}
      y={0}
      height={width}
      width={height}
      fill={"#CCDDFF"}
    />
  </g>
);

GridBackground.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default GridBackground;