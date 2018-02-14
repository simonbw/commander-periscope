import { storiesOf } from '@storybook/react';
import React, { Component } from 'react';
import { UnconnectedFirstMatePage } from '../src/client/components/game/FirstMatePage/index';
import { CHARGE, MAX_CHARGE } from '../src/common/models/System';
import { MAX_HIT_POINTS } from '../src/server/factories/GameFactory';
import { mockSystems } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper())
  .add('FirstMatePage', () => {
    return (
      <StateWrapper>
        {({ systems, chargeSystem, hitPoints, skipCharging, readyToCharge }) => (
          <UnconnectedFirstMatePage
            chargeSystem={chargeSystem}
            hitPoints={hitPoints}
            readyToCharge={readyToCharge}
            skipCharging={skipCharging}
            systems={systems}
          />
        )}
      </StateWrapper>
    );
  });

class StateWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      systems: mockSystems(),
      hitPoints: MAX_HIT_POINTS - 1,
      readyToCharge: true
    }
  }
  
  chargeSystem(systemName) {
    const systems = this.state.systems;
    this.setState({
      systems: systemName ?
        systems.update(systemName, system =>
          system.set(CHARGE, Math.min(system.get(CHARGE) + 1, system.get(MAX_CHARGE))))
        : systems,
      readyToCharge: false
    });
    setTimeout(() => this.setState({ readyToCharge: true }), 1000);
  }
  
  render() {
    return this.props.children({
      chargeSystem: (system) => this.chargeSystem(system),
      skipCharging: () => this.chargeSystem(null),
      ...this.state,
    })
  }
}