import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import ReactJsonSyntaxHighlighter from 'react-json-pretty';
import { State } from 'statty';
import styles from '../../../styles/DebugPane.css';

export class UnconnectedDebugPane extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };
  
  constructor(props) {
    super(props);
    this.state = { open: Boolean(this.props.initiallyOpen) };
  }
  
  toggle() {
    this.setState({ open: !this.state.open });
  }
  
  render() {
    return <div
      onClick={() => this.toggle()}
      className={classnames(styles.DebugPane, { [styles.open]: this.state.open })}
    >
      {this.state.open ?
        <ReactJsonSyntaxHighlighter json={this.props.data}/>
        :
        <Fragment>Debug</Fragment>
      }
    </div>
  }
}

const ConnectedDebugPage = () => (
  <State
    select={(state) => ({ data: state })}
    render={(data) => <UnconnectedDebugPane data={data}/>}
  />
);

export default ConnectedDebugPage;