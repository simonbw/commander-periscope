import { IconButton } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { CIRCUIT, SYSTEM_TYPE } from '../../../../common/models/System';
import { getIconForSystemType } from '../../icons/SystemTypeIcons';
import CircuitBadge from './CircuitBadge';

const SubsystemButton = ({ active, subsystem, broken, onClick }) => {
  const circuit = subsystem.get(CIRCUIT);
  const systemType = subsystem.get(SYSTEM_TYPE);
  
  const inside = circuit != null ? (
    <CircuitBadge active={active} circuit={circuit}>
      {getIconForSystemType(systemType, broken)}
    </CircuitBadge>
  ) : (
    getIconForSystemType(systemType, broken)
  );
  
  return (
    <IconButton disabled={broken || !active} onClick={onClick}>
      {/*<Tooltip title={`${systemType}`}>*/} {/* TODO: Figure out how to make tooltips work */}
      {inside}
      {/*</Tooltip>*/}
    </IconButton>
  );
};

SubsystemButton.propTypes = {
  active: PropTypes.bool.isRequired,
  broken: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  subsystem: ImmutablePropTypes.map.isRequired,
};

export default SubsystemButton;