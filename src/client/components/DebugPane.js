import classnames from 'classnames';
import React, { Component, Fragment } from 'react';
import ReactJsonSyntaxHighlighter from 'react-json-pretty';
import styles from '../../../styles/DebugPane.css';

class DebugPane extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  
  toggle() {
    this.setState({ open: !this.state.open });
  }
  
  render() {
    return <div
      onClick={() => this.toggle()}
      className={classnames(styles.DebugPane, { [styles.open]: this.state.open })}
    >
      {(this.state.open ? this.renderOpen() : this.renderClosed())}
    </div>
  }
  
  renderOpen() {
    return <ReactJsonSyntaxHighlighter json={this.props.data}/>
  }
  
  renderClosed() {
    return <Fragment>Debug</Fragment>
  }
}

export default DebugPane;