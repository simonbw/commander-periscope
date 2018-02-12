import { Paper, TextField } from 'material-ui';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/CustomLobbyPage.css';
import { USERNAME } from '../../../common/fields/LobbyFields';
import { LOBBY } from '../../../common/fields/StateFields';
import { setUsername } from '../../actions/CustomLobbyActions';

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

export default connect(
  (state) => ({
    savedUsername: state.getIn([LOBBY, USERNAME])
  }),
  (dispatch) => ({
    setUsername: (username) => dispatch(setUsername(username)),
  })
)(UnconnectedUsernameInput);