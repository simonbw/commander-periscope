import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { Component } from 'react';
import { UnconnectedEngineerPage } from '../src/client/components/game/EngineerPage/index';
import { BREAKDOWNS, SUBSYSTEMS } from '../src/common/fields/GameFields';
import { ALL_DIRECTIONS, NORTH } from '../src/common/models/Direction';
import { RED } from '../src/common/models/Team';
import { fixCircuits } from '../src/common/util/GameUtils';
import { mockGame } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper())
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
      breakdowns: fixCircuits(this.state.subsystems, this.state.breakdowns.add(subsystemIndex)),
      directionMoved: ALL_DIRECTIONS[Math.floor(Math.random() * ALL_DIRECTIONS.length)],
      readyToTrack: false
    });
    setTimeout(() => this.setState({ readyToTrack: true }), 1000);
  }
  
  render() {
    return this.props.children({
      trackBreakdown: (subsystemIndex) => this.trackBreakdown(subsystemIndex),
      ...this.state,
    })
  }
}