import { storiesOf } from '@storybook/react';
import { FormControl, FormLabel, Paper, Switch } from 'material-ui';
import React, { Component } from 'react';
import { UnconnectedConnectionWarner } from '../src/client/components/ConnectionWarner';
import '../styles/main.css';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('ConnectionWarner', () => {
    return (
      <StateWrapper
        initiallyOn={true}
        render={(connected) =>
          <UnconnectedConnectionWarner connected={connected}/>
        }
      />
    );
  });

class StateWrapper extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      on: this.props.initiallyOn || false
    }
  }
  
  render() {
    const on = this.state.on;
    return (
      <Paper style={{ display: 'inline-block', margin: '20px', padding: '10px' }}>
        <FormControl>
          <FormLabel>
            Connection
          </FormLabel>
          <Switch
            checked={on}
            onChange={() => this.setState({ on: !on })}
          />
          {this.props.render(on)}
        </FormControl>
      </Paper>
    );
  }
}