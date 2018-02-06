import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { Component } from 'react';
import { UnconnectedEngineerPage } from '../src/client/components/game/EngineerPage';
import { NORTH } from '../src/common/Direction';
import { ALL_DIRECTIONS} from '../src/common/Direction';
import { BREAKDOWNS, SUBSYSTEMS } from '../src/common/StateFields';
import { RED } from '../src/common/Team';
import '../styles/main.css';
import { fixCircuits } from '../src/common/util/GameUtils';
import { mockGame } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('EngineerPage', () => {
    return (
      <StateWrapper>
        {({ subsystems, breakdowns, directionMoved, readyToTrack, trackBreakdown }) => (
          <UnconnectedEngineerPage
            subsystems={subsystems}
            breakdowns={breakdowns}
            directionMoved={directionMoved}
            readyToTrack={readyToTrack}
            trackBreakdown={trackBreakdown}
          />
        )}
      </StateWrapper>
    );
  });

class StateWrapper extends Component {
  constructor(props) {
    super(props);
    const game = mockGame();
    const subsystems = game.get(SUBSYSTEMS);
    const breakdowns = game.getIn([RED, BREAKDOWNS]);
    this.state = {
      subsystems,
      breakdowns,
      directionMoved: NORTH,
      readyToTrack: true
    }
  }
  
  trackBreakdown(subsystemIndex) {
    action('trackingBreakdown')(subsystemIndex);
    this.setState({
      breakdowns: this.state.breakdowns.add(subsystemIndex),
      directionMoved: ALL_DIRECTIONS[Math.floor(Math.random() * ALL_DIRECTIONS.length)],
      readyToTrack: false
    }); // TODO: Circuits?
    setTimeout(() => this.setState({ readyToTrack: true }), 1000);
  }
  
  render() {
    return this.props.children({
      trackBreakdown: (subsystemIndex) => this.trackBreakdown(subsystemIndex),
      ...this.state,
    })
  }
}