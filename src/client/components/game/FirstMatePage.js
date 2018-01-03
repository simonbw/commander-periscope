import React from 'react';
import { connect } from 'react-redux';
import { chargeSystem } from '../../actions/GameActions';
import GameDebugPane from './GameDebugPane';

const FirstMatePage = ({ game, chargeSystem }) => (
  <div id="first-mate-page">
    <span>First Mate Page</span>
    {game.get('started') && <SystemPanel {...{ systems: game.get('systems'), chargeSystem }}/>}
    {!game.get('started') && <div>Game Not Started Yet</div>}
    <GameDebugPane {...{ game }}/>
  </div>
);

const SystemPanel = ({ systems, chargeSystem }) => (
  <div>
    {systems
      .map((system, name) => system.set('name', name))
      .toIndexedSeq() // TODO: Is there an easier way to do this? Also, guarantee order.
      .map((system, i) => (
        <System key={i} {...system.toJS()} chargeSystem={chargeSystem}/>
      ))
      .toArray()
    }
  </div>
);

const System = ({ name, charge, max, chargeSystem }) => (
  <div onClick={() => chargeSystem(name)}>
    <b>{name}</b>: {charge} / {max}
  </div>
);

export default connect(
  (state) => ({
    game: state.get('game'),
  }),
  (dispatch) => ({
    chargeSystem: (systemName) => dispatch(chargeSystem(systemName))
  })
)(FirstMatePage);