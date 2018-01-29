import { storiesOf } from '@storybook/react';
import React, { Component } from 'react';
import { UnconnectedFirstMatePage } from '../src/client/components/game/FirstMatePage';
import { CHARGE, MAX_CHARGE } from '../src/common/System';
import '../styles/main.css';
import { mockSystems } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('FirstMatePage', () => {
    return (
      <StateWrapper>
        {({ systems, chargeSystem, skipCharging, readyToCharge }) => (
          <UnconnectedFirstMatePage
            readyToCharge={readyToCharge}
            systems={systems}
            chargeSystem={chargeSystem}
            skipCharging={skipCharging}
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