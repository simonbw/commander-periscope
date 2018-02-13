import Immutable from 'immutable';
import { Button } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { State } from 'statty';
import styles from '../../../../../styles/FirstMatePage.css';
import { HIT_POINTS, SYSTEMS } from '../../../../common/fields/GameFields';
import { GAME } from '../../../../common/fields/StateFields';
import { WAITING_FOR_FIRST_MATE } from '../../../../common/fields/TurnInfoFields';
import { CHARGE_SYSTEM_MESSAGE } from '../../../../common/messages/GameMessages';
import { CHARGE, MAX_CHARGE } from '../../../../common/models/System';
import { EmitterContext } from '../../SocketProvider/SocketProvider';
import HitPointMeter from './HitPointMeter';
import SystemCard from './SystemCard';

export const UnconnectedFirstMatePage = (props) => {
  return (
    <div id="first-mate-page" className={styles.FirstMatePage}>
      <div className={styles.HitPointMeterBox}>
        <HitPointMeter hitPoints={props.hitPoints}/>
      </div>
      <div className={styles.SystemPanels}>
        {(props.systems || Immutable.Map()) // TODO: When do we not have systems?
          .map((system, name) => system.set('name', name))
          .toIndexedSeq() // TODO: Is there an easier way to do this? Also, guarantee order.
          .map((system, i) => (
            <SystemCard
              charge={system.get(CHARGE)}
              chargeSystem={props.chargeSystem}
              key={i}
              maxCharge={system.get(MAX_CHARGE)}
              name={system.get('name')}
              readyToCharge={props.readyToCharge}
            />
          ))
        }
        <Button
          className={styles.SkipChargingButton}
          color="secondary"
          disabled={!props.readyToCharge}
          onClick={props.skipCharging}
          variant="raised"
        >
          Skip Charging
        </Button>
      </div>
    </div>
  );
};

UnconnectedFirstMatePage.propTypes = {
  chargeSystem: PropTypes.func.isRequired,
  hitPoints: PropTypes.number.isRequired,
  readyToCharge: PropTypes.bool.isRequired,
  skipCharging: PropTypes.func.isRequired,
  systems: ImmutablePropTypes.map.isRequired,
};

const ConnectedFirstMatePage = () => (
  <State
    select={(state) => ({
      systems: state.getIn([GAME, SYSTEMS]),
      hitPoints: state.getIn([GAME, HIT_POINTS]),
      readyToCharge: state.getIn([GAME, WAITING_FOR_FIRST_MATE])
    })}
    render={(stateProps) => (
      <EmitterContext.Consumer>
        {({ emit }) => (
          <UnconnectedFirstMatePage
            chargeSystem={(systemName) => emit(CHARGE_SYSTEM_MESSAGE, { systemName })}
            skipCharging={() => emit(CHARGE_SYSTEM_MESSAGE, { systemName: null })}
            
            readyToCharge={stateProps.readyToCharge}
            hitPoints={stateProps.hitPoints}
            systems={stateProps.systems}
          />
        )}
      </EmitterContext.Consumer>
    )}
  />
);

export default ConnectedFirstMatePage;