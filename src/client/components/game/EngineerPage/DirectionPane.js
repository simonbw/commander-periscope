import classnames from 'classnames';
import { Divider, Paper } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from '../../../../../styles/EngineerPage.css';
import { ID } from '../../../../common/fields/CommonFields';
import { ALL_DIRECTIONS, getDirectionArrow } from '../../../../common/models/Direction';
import { CIRCUIT } from '../../../../common/models/System';
import SubsystemButton from './SubsystemButton';

const DirectionPane = ({ active, breakdowns, direction, subsystems, trackBreakdown }) => {
  const symbols = subsystems
    .sortBy(s => s.get(CIRCUIT) != null ? -s.get(CIRCUIT) : -10)
    .reverse()
    .map(subsystem => (
      <SubsystemButton
        active={active}
        broken={breakdowns.includes(subsystem.get(ID))}
        key={subsystem.get(ID)}
        onClick={() => trackBreakdown(subsystem.get(ID))}
        subsystem={subsystem}
      />
    ));
  return (
    <Paper
      className={classnames(styles.DirectionPanel, { [styles.active]: active })}
      elevation={active ? 16 : undefined}
    >
      <h2>{direction} {getDirectionArrow(direction)}</h2>
      <Divider/>
      <div className={styles.ButtonRow}>
        {symbols.slice(0, 3)}
      </div>
      <Divider/>
      <div className={styles.ButtonRow}>
        {symbols.slice(3)}
      </div>
    </Paper>
  );
};

DirectionPane.propTypes = {
  active: PropTypes.bool.isRequired,
  breakdowns: ImmutablePropTypes.set.isRequired,
  direction: PropTypes.oneOf(ALL_DIRECTIONS).isRequired,
  subsystems: ImmutablePropTypes.list.isRequired,
  trackBreakdown: PropTypes.func.isRequired,
};

export default DirectionPane;