import classnames from 'classnames';
import {
  Button, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, Paper, Tooltip
} from 'material-ui';
import { Forward } from 'material-ui-icons';
import React, { Component } from 'react';
import styles from '../../../../styles/MainMenu.css'
import { getLobbyIdErrors } from '../../../common/Validation';

export class JoinCustomGameInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId: '',
      open: false,
      error: null,
    }
  }
  
  submit() {
    const error = getLobbyIdErrors(this.state.lobbyId);
    if (error) {
      this.setState({ error });
    } else {
      this.props.joinCustomLobby(this.state.lobbyId);
    }
  }
  
  onChange(lobbyId) {
    const update = { lobbyId };
    
    // keep showing the error until it goes away
    if (this.state.error && this.state.error !== getLobbyIdErrors(lobbyId)) {
      update.error = null;
    }
    
    this.setState(update);
  }
  
  render() {
    return (
      <Paper
        className={classnames(
          styles.JoinCustomGameInput,
          { [styles.open]: this.state.open })}
      >
        {this.state.open ? this.renderOpen() : this.renderClosed()}
      </Paper>
    );
  }
  
  renderOpen() {
    const { error, lobbyId } = this.state;
    return (
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          this.submit()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            this.setState({ open: false });
            event.preventDefault();
          }
        }}
      >
        <FormControl fullWidth>
          <InputLabel htmlFor={"custom-game-input"}>Lobby Id</InputLabel>
          <Input
            autoFocus
            spellCheck={false}
            fullWidth
            id="custom-game-input"
            onChange={(event) => this.onChange(event.target.value)}
            value={lobbyId}
            error={Boolean(error)}
            autoComplete="off"
            endAdornment={
              <InputAdornment position="end">
                <IconButton type="submit" disabled={Boolean(error)} color="primary">
                  <Tooltip title="Join Lobby" enterDelay={300} placement="bottom">
                    <Forward/>
                  </Tooltip>
                </IconButton>
              </InputAdornment>
            }
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      </form>
    )
  }
  
  renderClosed() {
    return (
      <Button
        id="join-custom-game-button"
        onClick={() => this.setState({ open: true, error: null })}
        fullWidth
      >
        Join Lobby
      </Button>
    );
  }
}