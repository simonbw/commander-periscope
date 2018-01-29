import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import Random from 'random-js';
import React, { Component } from 'react';
import { UnconnectedRadioOperatorPage } from '../src/client/components/game/RadioOperatorPage';
import { ALL_DIRECTIONS } from '../src/common/Grid';
import { ACTION_ID, ACTION_TYPE, DIRECTION_MOVED, GRID, SYSTEM_USED } from '../src/common/StateFields';
import { ALL_SYSTEMS } from '../src/common/System';
import '../styles/main.css';
import { mockGame } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('RadioOperator Adding', () => {
    const grid = mockGame().get(GRID);
    return (
      <StateWrapper>
        {({ opponentActions }) => (
          <UnconnectedRadioOperatorPage
            grid={grid}
            opponentActions={opponentActions}
          />
        )}
      </StateWrapper>
    );
  })
  .add('RadioOperator Static', () => {
    const grid = mockGame().get(GRID);
    const mockedMoves = Immutable.Range(0, 10).map(() => mockMove()).toList();
    return (
      <UnconnectedRadioOperatorPage
        grid={grid}
        opponentActions={mockedMoves}
      />
    );
  });

const r = Random();
let lastId = 1;

function mockMove() {
  if (r.bool(0.7)) {
    return Immutable.Map({
      [ACTION_TYPE]: 'move',
      [DIRECTION_MOVED]: r.pick(ALL_DIRECTIONS),
      [ACTION_ID]: lastId++,
    });
  } else {
    return Immutable.Map({
      [ACTION_TYPE]: 'useSystem',
      [SYSTEM_USED]: r.pick(ALL_SYSTEMS),
      [ACTION_ID]: lastId++,
    });
  }
}

class StateWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opponentActions: Immutable.List(),
    };
  }
  
  componentWillMount() {
    this.interval = setInterval(() => {
      this.setState({ opponentActions: this.state.opponentActions.unshift(mockMove()).take(20) })
    }, 1500);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render() {
    return this.props.children({
      ...this.state,
    })
  }
}