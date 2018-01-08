import React from 'react';
import { connect } from 'react-redux';
import { CHARGE, COMMON, GAME, MAX_CHARGE, STARTED, SYSTEMS } from '../../../common/StateFields';
import { chargeSystem } from '../../actions/GameActions';
import DebugPane from '../DebugPane';

export const UnconnectedFirstMatePage = ({ game, chargeSystem }) => (
  <div id="first-mate-page">
    <span>First Mate Page</span>
    {game.getIn([COMMON, STARTED]) && <SystemPanel {...{ systems: game.get(SYSTEMS), chargeSystem }}/>}
    {!game.getIn([COMMON, STARTED]) && <div>Game Not Started Yet</div>}
    <DebugPane data={game}/>
  </div>
);

const SystemPanel = ({ systems, chargeSystem }) => (
  <div>
    {systems
      .map((system, name) => system.set('name', name))
      .toIndexedSeq() // TODO: Is there an easier way to do this? Also, guarantee order.
      .map((system, i) => (
        <System
          key={i}
          chargeSystem={chargeSystem}
          name={system.get('name')}
          charge={system.get(CHARGE)}
          max={system.get(MAX_CHARGE)}
        />
      ))
    }
    <div onClick={() => chargeSystem(undefined)}>Skip Charging</div>
  </div>
);

const System = ({ name, charge, max, chargeSystem }) => (
  <div onClick={() => chargeSystem(name)}>
    <b>{name}</b>: {charge} / {max}
  </div>
);

export default connect(
  (state) => ({
    game: state.get(GAME),
  }),
  (dispatch) => ({
    chargeSystem: (systemName) => dispatch(chargeSystem(systemName))
  })
)(UnconnectedFirstMatePage);