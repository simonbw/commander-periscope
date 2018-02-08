import Immutable from 'immutable';
import { Button, Paper, Tooltip } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../../../styles/FirstMatePage.css';
import { HIT_POINTS, SYSTEMS } from '../../../../common/fields/GameFields';
import { GAME } from '../../../../common/fields/StateFields';
import { WAITING_FOR_FIRST_MATE } from '../../../../common/fields/TurnInfoFields';
import { CHARGE, getSystemType, MAX_CHARGE } from '../../../../common/System';
import { chargeSystem } from '../../../actions/GameActions';
import { getIconForSystemType } from '../../icons/SystemTypeIcons';
import ChargeMeter from './ChargeMeter';
import HitPointMeter from './HitPointMeter';

export const UnconnectedFirstMatePage = ({ systems, readyToCharge, hitPoints, chargeSystem, skipCharging }) => {
  return (
    <div id="first-mate-page" className={styles.FirstMatePage}>
      <div className={styles.HitPointMeterBox}>
        <HitPointMeter hitPoints={hitPoints}/>
      </div>
      <div className={styles.SystemPanels}>
        {(systems || Immutable.Map())
          .map((system, name) => system.set('name', name))
          .toIndexedSeq() // TODO: Is there an easier way to do this? Also, guarantee order.
          .map((system, i) => (
            <System
              charge={system.get(CHARGE)}
              chargeSystem={chargeSystem}
              key={i}
              maxCharge={system.get(MAX_CHARGE)}
              name={system.get('name')}
              readyToCharge={readyToCharge && system.get(CHARGE) < system.get(MAX_CHARGE)}
            />
          ))
        }
        <Button
          className={styles.SkipChargingButton}
          color="secondary"
          disabled={!readyToCharge}
          onClick={skipCharging}
          raised
        >
          Skip Charging
        </Button>
      </div>
    </div>
  );
};

const System = ({ name, charge, maxCharge, chargeSystem, readyToCharge }) => {
  const systemType = getSystemType(name);
  return (
    <Paper className={styles.SystemPanel}>
      <ChargeMeter charge={charge} maxCharge={maxCharge}/>
      <div className={styles.SystemPanelRight}>
        <div className={styles.SystemName}>{name}</div>
        <Tooltip title={systemType} placement="right" enterDelay={300}>
          {getIconForSystemType(systemType)}
        </Tooltip>
        <Button
          color="primary"
          disabled={!readyToCharge}
          onClick={() => chargeSystem(name)}
        >
          Charge
        </Button>
      </div>
    </Paper>
  );
};

export default connect(
  (state) => ({
    systems: state.getIn([GAME, SYSTEMS]),
    hitPoints: state.getIn([GAME, HIT_POINTS]),
    readyToCharge: state.getIn([GAME, WAITING_FOR_FIRST_MATE])
  }),
  (dispatch) => ({
    chargeSystem: (systemName) => dispatch(chargeSystem(systemName)),
    skipCharging: () => dispatch(chargeSystem())
  })
)(UnconnectedFirstMatePage);