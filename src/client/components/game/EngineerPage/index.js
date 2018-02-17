import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { State } from 'statty';
import styles from '../../../../../styles/EngineerPage.css';
import { BREAKDOWNS, SUBSYSTEMS } from '../../../../common/fields/GameFields';
import { GAME } from '../../../../common/fields/StateFields';
import { LAST_DIRECTION_MOVED, WAITING_FOR_ENGINEER } from '../../../../common/fields/TurnInfoFields';
import { TRACK_BREAKDOWN_MESSAGE } from '../../../../common/messages/GameMessages';
import { ALL_DIRECTIONS } from '../../../../common/models/Direction';
import { DIRECTION } from '../../../../common/models/System';
import { EmitterContext } from '../../SocketProvider/SocketProvider';
import DirectionPane from './DirectionPane';

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
            key={direction}
            subsystems={subsystems.filter(s => s.get(DIRECTION) === direction)}
            trackBreakdown={trackBreakdown}
          />
        ))}
      </div>
    </div>
  );
};

UnconnectedEngineerPage.propTypes = {
  breakdowns: ImmutablePropTypes.set.isRequired,
  directionMoved: PropTypes.oneOf(ALL_DIRECTIONS).isRequired,
  readyToTrack: PropTypes.bool.isRequired,
  subsystems: ImmutablePropTypes.list.isRequired,
  trackBreakdown: PropTypes.func.isRequired,
};

const ConnectedEngineerPage = () => (
  <State
    select={(state) => ({
      breakdowns: state.getIn([GAME, BREAKDOWNS]),
      directionMoved: state.getIn([GAME, LAST_DIRECTION_MOVED]),
      subsystems: state.getIn([GAME, SUBSYSTEMS]),
      readyToTrack: state.getIn([GAME, WAITING_FOR_ENGINEER])
    })}
    render={(stateProps) => (
      <EmitterContext.Consumer>
        {({ emit }) => (
          <UnconnectedEngineerPage
            trackBreakdown={(breakdownIndex => emit(TRACK_BREAKDOWN_MESSAGE, { breakdownIndex }))}
            
            breakdowns={stateProps.breakdowns}
            directionMoved={stateProps.directionMoved}
            readyToTrack={stateProps.readyToTrack}
            subsystems={stateProps.subsystems}
          />
        )}
      </EmitterContext.Consumer>
    )}
  />
);

export default ConnectedEngineerPage;