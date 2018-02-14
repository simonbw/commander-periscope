import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { State } from 'statty';
import { CONNECTED } from '../../../common/fields/StateFields';
import Handlers from './Handlers';

class UnconnectedConnectionHandlers extends Component {
  static propTypes = {
    update: PropTypes.func.isRequired,
  };
  
  constructor(props) {
    super(props);
    
    this.handlers = [[
      'connect', () => {
        this.props.update((state) => state.set(CONNECTED, true))
      }
    ], [
      'disconnect', () => {
        this.props.update((state) => state.set(CONNECTED, false))
      }
    ]];
  }
  
  render() {
    return <Handlers handlers={this.handlers}/>
  }
}

const ConnectedConnectionHandlers = () => (
  <State
    render={(state, update) => (
      <UnconnectedConnectionHandlers update={update}/>
    )}
  />
);

export default ConnectedConnectionHandlers;