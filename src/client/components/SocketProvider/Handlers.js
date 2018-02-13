import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ReceiverContext } from './SocketProvider';

class UnconnectedHandlers extends Component {
  static propTypes = {
    handlers: PropTypes.array.isRequired,
    off: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
  };
  
  constructor(props) {
    super(props);
  }
  
  // TODO: Reattach handlers if they change
  
  componentDidMount() {
    this.addHandlers();
  }
  
  componentWillUnmount() {
    this.removeHandlers();
  }
  
  addHandlers() {
    for (const [event, handler] of this.props.handlers) {
      this.props.on(event, handler);
    }
  }
  
  removeHandlers() {
    for (const [event, handler] of this.props.handlers) {
      this.props.off(event, handler);
    }
  }
  
  render() {
    return null;
  }
}

const Handlers = ({ handlers }) => (
  <ReceiverContext.Consumer>
    {({ on, off }) => (
      <UnconnectedHandlers on={on} off={off} handlers={handlers}/>
    )}
  </ReceiverContext.Consumer>
);

Handlers.propTypes = {
  handlers: PropTypes.array.isRequired,
};

export default Handlers;