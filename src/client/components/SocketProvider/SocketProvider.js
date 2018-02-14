import createContext from 'create-react-context/lib/index';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SocketIO from 'socket.io-client';
import ConnectionHandlers from './ConnectionHandlers';
import GameHandlers from './GameHandlers';
import LobbyHandlers from './LobbyHandlers';

export const EmitterContext = createContext({ emit: () => null });
export const ReceiverContext = createContext({ on: () => null, off: () => null });

class SocketProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
    this.socket = SocketIO();
  }
  
  render() {
    return (
      <EmitterContext.Provider value={{ emit: (...args) => this.socket.emit(...args) }}>
        <ReceiverContext.Provider
          value={{
            on: (...args) => this.socket.on(...args),
            off: (...args) => this.socket.off(...args)
          }}
        >
          <LobbyHandlers/>
          <ConnectionHandlers/>
          <GameHandlers/>
          
          {this.props.children}
        </ReceiverContext.Provider>
      </EmitterContext.Provider>
    );
  }
}

export default SocketProvider;
