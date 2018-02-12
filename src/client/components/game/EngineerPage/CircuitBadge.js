import { Badge, withStyles } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';

const createColoredBadge = (color, borderRadius = '50%') => withStyles(() =>
  ({
    badge: {
      color: '#FFF',
      backgroundColor: color,
      fontFamily: 'sans-serif',
      borderRadius: borderRadius,
    }
  }))(Badge);

const GreenBadge = createColoredBadge('#2C2', '50%');
const RedBadge = createColoredBadge('#C22', '25%'); // TODO: Try to get a different shape like triangle or diamond
const BlueBadge = createColoredBadge('#22C', '0');

const CircuitBadge = ({ circuit, active, ...props }) => {
  switch (circuit) {
    case 1:
      return <GreenBadge badgeContent={circuit} {...props}/>;
    case 2:
      return <RedBadge badgeContent={circuit} {...props}/>;
    case 3:
      return <BlueBadge badgeContent={circuit} {...props}/>
  }
};

CircuitBadge.propTypes = {
  active: PropTypes.bool.isRequired,
  circuit: PropTypes.number.isRequired,
};

export default CircuitBadge;