import classnames from 'classnames';
import { IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Tooltip } from 'material-ui';
import { Clear, Done } from 'material-ui-icons';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../../styles/RoleSelect.css';
import * as Role from '../../../common/models/Role';
import { getAvatarForRole } from '../icons/RoleAvatars';

const RoleCard = (props) => {
  const isUser = props.isUser;
  const isAvailable = props.isAvailable;
  const isReady = props.isReady;
  const isOther = !isAvailable && !isUser;
  
  const role = props.role;
  return (
    <ListItem
      classes={{
        container: classnames(
          styles.RoleCard,
          { [styles.isOther]: isOther },
          { [styles.isReady]: isReady },
          { [styles.isUser]: isUser },
        )
      }}
      button={!isOther}
      id={`${props.team}-${role}`}
      onClick={() => {
        if (isAvailable && !isUser) {
          props.onSelect();
        }
      }}
    >
      <ListItemAvatar>
        {getAvatarForRole(role)}
      </ListItemAvatar>
      <ListItemText
        primary={Role.getDisplayName(role)}
        secondary={
          <span className={isAvailable ? styles.Available : styles.Username}>
            {isAvailable ? 'Available' : props.username}
          </span>
        }
      />
      {/* Hide instead of remove this element to avoid element swapping */}
      <ListItemSecondaryAction>
        {isUser && (
          <Tooltip enterDelay={300} title={'Deselect Role'} /*TODO: Tooltip delay in constant*/>
            <IconButton onClick={props.onUnSelect}>
              <Clear/>
            </IconButton>
          </Tooltip>
        )}
        {!isUser && isReady && (
          <IconButton style={{ cursor: 'default', color: '#00CC00' }} disableRipple>
            <Tooltip enterDelay={300} title={'User is Ready'}>
              <Done/>
            </Tooltip>
          </IconButton>
        )}
      </ListItemSecondaryAction>
    
    </ListItem>
  );
};

RoleCard.propTypes = {
  isAvailable: PropTypes.bool.isRequired,
  isReady: PropTypes.bool.isRequired,
  isUser: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onUnSelect: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  team: PropTypes.string.isRequired,
  username: PropTypes.string,
};

export default RoleCard;