import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../../styles/Grid/GridCrosshairs.css';
import { LocationPropType } from '../../GamePropTypes';

const GridCrosshairs = ({ tile, color = "#FFFFFFDD" }) => {
  if (!tile) {
    return <g/>;
  }
  const [cx, cy] = tile.map(c => c + 0.5).toArray();
  const r = 0.25;
  return (
    <g className={styles.GridCrosshairs}>
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={0.08}
      />
      <line x1={0} y1={cy} x2={cx - r} y2={cy} stroke={color} strokeWidth={0.04}/>
      <line x1={cx + r} y1={cy} x2={15} y2={cy} stroke={color} strokeWidth={0.04}/>
      
      <line x1={cx} y1={0} x2={cx} y2={cy - r} stroke={color} strokeWidth={0.04}/>
      <line x1={cx} y1={cy + r} x2={cx} y2={15} stroke={color} strokeWidth={0.04}/>
    </g>
  );
};

GridCrosshairs.propTypes = {
  tile: LocationPropType,
  color: PropTypes.string,
};

export default GridCrosshairs;