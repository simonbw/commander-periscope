import {
  Button, Collapse, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, Paper, Tooltip
} from 'material-ui';
import { Forward } from 'material-ui-icons';
import React, { Component } from 'react';
import styles from '../../../../styles/MainMenu.css'
import { getLobbyIdErrors } from '../../../common/Validation';

const TIMEOUT = 140;

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
        className={styles.JoinCustomGameInput}
      >
        <Collapse in={!this.state.open} timeout={TIMEOUT}>{this.renderClosed()}</Collapse>
        <Collapse in={this.state.open} timeout={TIMEOUT}>{this.renderOpen()}</Collapse>
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
        onBlur={() => {
          if (!this.state.lobbyId) {
            setTimeout(() => {
              if (!this.state.error) {
                this.setState({ open: false })
              }
            }, 10);
          }
        }}
      >
        <FormControl fullWidth>
          <InputLabel htmlFor={"custom-game-input"}>Lobby Id</InputLabel>
          <Input
            autoComplete="off"
            disabled={!this.state.open}
            error={Boolean(error)}
            fullWidth
            id="custom-game-input"
            name="Lobby Id Input"
            onChange={(event) => this.onChange(event.target.value)}
            inputRef={(inputRef) => this._inputRef = inputRef}
            spellCheck={false}
            value={lobbyId}
            endAdornment={
              <InputAdornment position="end">
                <IconButton type="submit" disabled={Boolean(error) || !this.state.open} color="primary">
                  <Tooltip title="Join Lobby" enterDelay={300} placement="left">
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
        name="Join Lobby Button"
        onClick={() => {
          this.setState({ open: true, error: null });
          setTimeout(() => {
            this._inputRef.focus();
          }, TIMEOUT)
        }}
        fullWidth
        disabled={this.state.open}
      >
        Join Lobby
      </Button>
    );
  }
}