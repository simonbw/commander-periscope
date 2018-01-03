import classnames from 'classnames';
import React, { Component, Fragment } from 'react';
import styles from '../../../../styles/GameDebugPane.css';

class GameDebugPane extends Component {
  constructor() {
    super();
    this.state = { open: false };
  }
  
  toggle() {
    this.setState({ open: !this.state.open });
  }
  
  render() {
    return <div
      onClick={() => this.toggle()}
      className={classnames(styles.GameDebugPane, { [styles.open]: this.state.open })}
    >
      {(this.state.open ? this.renderOpen() : this.renderClosed())}
    </div>
  }
  
  renderOpen() {
    return <pre>{JSON.stringify(this.props.game, null, 2)}</pre>
  }
  
  renderClosed() {
    return <Fragment>Debug</Fragment> // TODO: Use Fragment syntax when supported
  }
}

export default GameDebugPane;