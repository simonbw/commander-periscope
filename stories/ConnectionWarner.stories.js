import { storiesOf } from '@storybook/react';
import { FormControl, FormLabel, Paper, Switch } from 'material-ui';
import React, { Fragment } from 'react';
import { State } from 'statty';
import ConnectionWarner from '../src/client/components/ConnectionWarner';
import { CONNECTED } from '../src/common/fields/StateFields';
import { mockAppState } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper(mockAppState().set(CONNECTED, true)))
  .add('ConnectionWarner', () => {
    return (
      <State
        select={(state) => ({
          connected: state.get(CONNECTED)
        })}
        render={({ connected }, update) => (
          <Fragment>
            <Paper style={{ display: 'inline-block', margin: '20px', padding: '10px' }}>
              <FormControl>
                <FormLabel>
                  Connection
                </FormLabel>
                <Switch
                  checked={connected}
                  onChange={() => update(state => state.set(CONNECTED, !connected))}
                />
              </FormControl>
            </Paper>
            <ConnectionWarner/>
          </Fragment>
        )}
      />
    );
  });
