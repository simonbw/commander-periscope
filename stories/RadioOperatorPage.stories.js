import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { State } from 'statty';
import RadioOperatorPage from '../src/client/components/game/RadioOperatorPage/index';
import { NOTIFICATIONS } from '../src/common/fields/GameFields';
import { GAME } from '../src/common/fields/StateFields';
import { RADIO_OPERATOR } from '../src/common/models/Role';
import { mockAppState, mockNotification, mockPlayerData } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper(mockAppState().set(GAME, mockPlayerData(RADIO_OPERATOR))))
  .add('RadioOperator Adding', () => {
    return (
      <Fragment>
        <Updater/>
        <RadioOperatorPage/>
      </Fragment>
    );
  });

class UnconnectedUpdater extends Component {
  static propTypes = {
    update: PropTypes.func.isRequired
  };
  
  constructor(props) {
    super(props);
    this.state = {
      notifications: Immutable.List(),
    };
  }
  
  startInterval() {
    this.interval = setInterval(() => this.addNotification(), 1500);
  }
  
  addNotification() {
    this.props.update(state => state.updateIn([GAME, NOTIFICATIONS],
      notifications => notifications.unshift(mockNotification()).take(20)));
  }
  
  stopInterval() {
    clearInterval(this.interval);
  }
  
  componentWillMount() {
    this.startInterval();
  }
  
  componentWillUnmount() {
    this.stopInterval();
  }
  
  render() {
    return null;
  }
}

const Updater = () => (
  <State
    render={(state, update) => (
      <UnconnectedUpdater update={update}/>
    )}
  />
);
