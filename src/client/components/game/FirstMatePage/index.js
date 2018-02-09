import classnames from 'classnames';
import Immutable from 'immutable';
import { Button, Tooltip } from 'material-ui';
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
              readyToCharge={readyToCharge}
            />
          ))
        }
        <Button
          className={styles.SkipChargingButton}
          color="secondary"
          disabled={!readyToCharge}
          onClick={skipCharging}
          variant="raised"
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
    <Button
      className={classnames(styles.SystemPanel, { [styles.charged]: charge === maxCharge })}
      disabled={!readyToCharge || charge === maxCharge}
      onClick={() => chargeSystem(name)}
      variant="raised"
    >
      <div className={styles.SystemPanelPaper}>
        <ChargeMeter charge={charge} maxCharge={maxCharge}/>
        <div className={styles.SystemPanelRight}>
          <div className={styles.SystemName}>{name}</div>
          <Tooltip title={systemType} placement="right" enterDelay={300}>
            {getIconForSystemType(systemType)}
          </Tooltip>
        </div>
      </div>
    </Button>
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