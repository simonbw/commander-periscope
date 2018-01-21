import { storiesOf } from '@storybook/react';
import React from 'react';
import ConnectionWarner, { UnconnectedConnectionWarner } from '../src/client/components/ConnectionWarner';
import '../styles/main.css';

storiesOf('ConnectionWarner', module)
  .add('Disconnected', () => {
    return (
      <UnconnectedConnectionWarner connected={false}/>
    );
  });