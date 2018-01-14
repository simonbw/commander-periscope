import classnames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import style from '../../../../styles/EngineerPage.css';
import { ALL_DIRECTIONS } from '../../../common/Grid';
import { BREAKDOWNS, GAME, SUBSYSTEMS } from '../../../common/StateFields';
import { CIRCUIT, DIRECTION, SYSTEM_TYPE } from '../../../common/System';
import { trackBreakdown } from '../../actions/GameActions';
import DebugPane from '../DebugPane';

const INDEX = 'i';

export const UnconnectedEngineerPage = ({ game, trackBreakdown }) => {
  const subsystems = game.get(SUBSYSTEMS).map((s, i) => s.set(INDEX, i));
  const breakdowns = game.get(BREAKDOWNS);
  
  return (
    <div id="engineer-page" className={style.EngineerPage}>
      <DebugPane data={game}/>
      {ALL_DIRECTIONS.map(direction => (
        <DirectionPane
          direction={direction}
          subsystems={subsystems.filter(s => s.get(DIRECTION) === direction)}
          trackBreakdown={trackBreakdown}
          breakdowns={breakdowns}
        />
      ))}
    </div>
  );
};

const DirectionPane = ({ direction, subsystems, trackBreakdown, breakdowns }) => (
  <div className={style.DirectionPane}>
    <h2>{direction}</h2>
    {subsystems
      .sortBy(s => s.get(CIRCUIT))
      .reverse()
      .map(subsystem => (
        <SubsystemSymbol
          key={subsystem.get(INDEX)}
          subsystem={subsystem}
          broken={breakdowns.includes(subsystem.get(INDEX))}
          onClick={() => trackBreakdown(subsystem.get(INDEX))}
        />
      ))
      .insert(3, <hr/>)
    }
  </div>
);

const SubsystemSymbol = ({ subsystem, broken, onClick }) => (
  <div
    className={classnames(style.SubsystemSymbol, { [style.broken]: broken })}
    onClick={broken ? undefined : onClick} // TODO: Decide if can click
  >
    <span>{subsystem.get(SYSTEM_TYPE)}</span>
    <span className={style.Circuit}>{subsystem.get(CIRCUIT)}</span>
  </div>
);

export default connect(
  (state) => ({
    game: state.get(GAME),
  }),
  (dispatch) => ({
    trackBreakdown: (breakdownIndex) => dispatch(trackBreakdown(breakdownIndex))
  })
)(UnconnectedEngineerPage);