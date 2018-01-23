import classnames from 'classnames';
import { Badge, Divider, IconButton, Paper, withStyles } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/EngineerPage.css';
import { ALL_DIRECTIONS, getDirectionArrow } from '../../../common/Grid';
import { BREAKDOWNS, GAME, ID, LAST_DIRECTION_MOVED, SUBSYSTEMS } from '../../../common/StateFields';
import { CIRCUIT, DIRECTION, SYSTEM_TYPE } from '../../../common/System';
import { trackBreakdown } from '../../actions/GameActions';
import { getIconForSystemType } from '../SystemIcons';

const INDEX = ID;

// TODO: Show
export const UnconnectedEngineerPage = ({ subsystems, breakdowns, directionMoved, trackBreakdown, readyToTrack }) => {
  // subsystems = subsystems.map((s, i) => s.set(INDEX, i));
  return (
    <div id="engineer-page" className={styles.EngineerPage}>
      <div className={styles.DirectionPanels}>
        {ALL_DIRECTIONS.map(direction => (
          <DirectionPane
            active={readyToTrack && direction === directionMoved}
            breakdowns={breakdowns}
            direction={direction}
            subsystems={subsystems.filter(s => s.get(DIRECTION) === direction)}
            trackBreakdown={trackBreakdown}
          />
        ))}
      </div>
    </div>
  );
};

const DirectionPane = ({ active, breakdowns, direction, subsystems, trackBreakdown }) => {
  const symbols = subsystems
    .sortBy(s => s.get(CIRCUIT) != null ? -s.get(CIRCUIT) : -10)
    .reverse()
    .map(subsystem => (
      <SubsystemButton
        active={active}
        broken={breakdowns.includes(subsystem.get(INDEX))}
        key={subsystem.get(INDEX)}
        onClick={() => trackBreakdown(subsystem.get(INDEX))}
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

export default connect(
  (state) => ({
    subsystems: state.getIn([GAME, SUBSYSTEMS]),
    breakdowns: state.getIn([GAME, BREAKDOWNS]),
    directionMoved: state.getIn([GAME, LAST_DIRECTION_MOVED]),
  }),
  (dispatch) => ({
    trackBreakdown: (breakdownIndex) => dispatch(trackBreakdown(breakdownIndex))
  })
)(UnconnectedEngineerPage);