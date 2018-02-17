import classnames from 'classnames';
import { Button, Tooltip } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../../../styles/FirstMatePage.css';
import { getSystemType } from '../../../../common/models/System';
import { getIconForSystemType } from '../../icons/SystemTypeIcons';
import ChargeMeter from './ChargeMeter';

const SystemCard = (props) => {
  const charge = props.charge;
  const maxCharge = props.maxCharge;
  const systemType = getSystemType(props.name);
  return (
    <Button
      className={classnames(styles.SystemPanel, { [styles.charged]: charge === maxCharge })}
      disabled={!props.readyToCharge || charge === maxCharge}
      onClick={props.onCharge}
      variant="raised"
    >
      <div className={styles.SystemPanelPaper}>
        <ChargeMeter charge={charge} maxCharge={maxCharge}/>
        <div className={styles.SystemPanelRight}>
          <div className={styles.SystemName}>{props.name}</div>
          <Tooltip title={systemType} placement="right" enterDelay={300}>
            {getIconForSystemType(systemType)}
          </Tooltip>
        </div>
      </div>
    </Button>
  );
};

SystemCard.propTypes = {
  name: PropTypes.string.isRequired,
  charge: PropTypes.number.isRequired,
  maxCharge: PropTypes.number.isRequired,
  onCharge: PropTypes.func.isRequired,
  readyToCharge: PropTypes.bool.isRequired,
};

export default SystemCard;