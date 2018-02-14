import { storiesOf } from '@storybook/react';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { State } from 'statty';
import DamageFlash from '../src/client/components/game/DamageFlash';
import { HIT_POINTS } from '../src/common/fields/GameFields';
import { GAME } from '../src/common/fields/StateFields';
import { mockAppState, mockPlayerData } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper(mockAppState().set(GAME, mockPlayerData())))
  .add('DamageFlash', () => (
    <State
      render={(state, update) => (
        <Fragment>
          <StateWrapper update={update}/>
          <DamageFlash/>
        </Fragment>
      )}
    />
  ));

class StateWrapper extends Component {
  static propTypes = {
    update: PropTypes.func.isRequired,
  };
  
  componentWillMount() {
    this.interval = setInterval(() => {
      this.props.update((state) => state.updateIn([GAME, HIT_POINTS], hitPoints => hitPoints - 1));
    }, 1500);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render() {
    return null;
  }
}
