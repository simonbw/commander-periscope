import { Paper, TextField } from 'material-ui';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { State } from 'statty';
import styles from '../../../../styles/CustomLobbyPage.css';
import { USERNAME } from '../../../common/fields/LobbyFields';
import { LOBBY } from '../../../common/fields/StateFields';
import { CUSTOM_LOBBY_SET_USERNAME_MESSAGE } from '../../../common/messages/LobbyMessages';
import { debounceFunction } from '../../../common/util/FunctionUtils';
import { EmitterContext } from '../SocketProvider/SocketProvider';

class UnconnectedUsernameInput extends Component {
  static propTypes = {
    savedUsername: PropTypes.string,
    setUsername: PropTypes.func.isRequired,
  };
  
  constructor(props) {
    super(props);
    
    this.state = {
      value: this.props.savedUsername || ''
    };
  }
  
  onChange(value) {
    this.setState({ value });
    this.props.setUsername(value);
  }
  
  render() {
    return (
      <Paper className={styles.UsernamePaper}>
        <TextField
          fullWidth
          label={'Your Name'}
          onChange={(event) => this.onChange(event.target.value)}
          placeholder='Anonymous'
          value={this.state.value}
        />
      </Paper>
    );
  }
}

const setUsername = debounceFunction((emit, username) => {
  emit(CUSTOM_LOBBY_SET_USERNAME_MESSAGE, { username });
}, 200);

const ConnectedUsernameInput = () => (
  <State
    select={(state) => ({
      savedUsername: state.getIn([LOBBY, USERNAME])
    })}
    render={(stateProps) => (
      <EmitterContext.Consumer>
        {({ emit }) => (
          <UnconnectedUsernameInput
            setUsername={(username) => {
              window.localStorage.setItem('username', username);
              setUsername((...args) => emit(...args), username);
            }}
            savedUsername={stateProps.savedUsername}
          />
        )}
      </EmitterContext.Consumer>
    )}
  />
);

export default ConnectedUsernameInput;