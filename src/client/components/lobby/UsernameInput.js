import { Paper, TextField } from 'material-ui';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/CustomLobbyPage.css';
import { USERNAMES } from '../../../common/fields/LobbyFields';
import { LOBBY, USER_ID } from '../../../common/fields/StateFields';
import { setUsername } from '../../actions/CustomLobbyActions';

class UnconnectedUsernameInput extends Component {
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

export default connect(
  (state) => ({
    savedUsername: state.getIn([LOBBY, USERNAMES, state.get(USER_ID)])
  }),
  (dispatch) => ({
    setUsername: (username) => dispatch(setUsername(username)),
  })
)(UnconnectedUsernameInput);