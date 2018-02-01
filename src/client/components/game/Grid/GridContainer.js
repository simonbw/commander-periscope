import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../../../styles/Grid/GridContainer.css';

const GridContainer = ({ children, ...props }) => (
  <div className={styles.GridContainer} {...props}>
    <svg viewBox="-1 -1 16 16">{/* TODO: Actual grid size*/}
      {children}
    </svg>
  </div>
);

GridContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default GridContainer;