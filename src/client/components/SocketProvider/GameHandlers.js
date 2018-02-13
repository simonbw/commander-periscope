import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { State } from 'statty';
import { GAME } from '../../../common/fields/StateFields';
import { GAME_JOINED_MESSAGE, GAME_UPDATED_MESSAGE } from '../../../common/messages/GameMessages';
import { jsonToImmutable } from '../../../common/util/ImmutableUtil';
import Handlers from './Handlers';

class UnconnectedConnectionHandlers extends Component {
  static propTypes = {
    update: PropTypes.func.isRequired,
  };
  
  constructor(props) {
    super(props);
    
    this.handlers = [[
      'action', (action) => {
        if (action.type === GAME_JOINED_MESSAGE || action.type === GAME_UPDATED_MESSAGE) {
          this.props.update((state) => state.set(GAME, jsonToImmutable(action.game)))
        }
      }
    ]];
  }
  
  render() {
    return <Handlers handlers={this.handlers}/>
  }
}

const ConnectedGameHandlers = () => (
  <State
    render={({}, update) => (
      <UnconnectedConnectionHandlers update={update}/>
    )}
  />
);

export default ConnectedGameHandlers;