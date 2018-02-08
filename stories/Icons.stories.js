import { storiesOf } from '@storybook/react';
import { Divider, Paper, Tooltip } from 'material-ui';
import React from 'react';
import { DetonateMineIcon, MoveIcon, SurfaceIcon } from '../src/client/components/icons/ActionIcons';
import { DroneIcon, MineIcon, SilentIcon, SonarIcon, TorpedoIcon } from '../src/client/components/icons/SystemIcons';
import { CommsIcon, NuclearIcon, SpecialIcon, WeaponsIcon } from '../src/client/components/icons/SystemTypeIcons';
import '../styles/main.css';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('Icons', () => (
    <Paper
      style={{
        display: 'inline-block',
        margin: 40,
        padding: 20,
        transform: 'scale(2.0) translate(100px, 100px)' // makes it easier to see the icons
      }}
    >
      <IconRow>
        <IconBox title="Comms"><CommsIcon/></IconBox>
        <IconBox title="Nuclear"><NuclearIcon/></IconBox>
        <IconBox title="Special"><SpecialIcon/></IconBox>
        <IconBox title="Weapons"><WeaponsIcon/></IconBox>
      </IconRow>
      
      <Divider/>
      
      <IconRow>
        <IconBox title="Drone"><DroneIcon/></IconBox>
        <IconBox title="Mine"><MineIcon/></IconBox>
        <IconBox title="Silent"><SilentIcon/></IconBox>
        <IconBox title="Sonar"><SonarIcon/></IconBox>
        <IconBox title="Torpedo"><TorpedoIcon/></IconBox>
      </IconRow>
      
      <Divider/>
      
      <IconRow>
        <IconBox title="Detonate Mine"><DetonateMineIcon/></IconBox>
        <IconBox title="Move"><MoveIcon/></IconBox>
        <IconBox title="Surface"><SurfaceIcon/></IconBox>
      </IconRow>
    </Paper>
  ));

const IconRow = ({ children }) => (
  <div style={{ display: 'flex' }}>
    {children}
  </div>
);

const IconBox = ({ title, children }) => (
  <div style={{ padding: 10 }}>
    <Tooltip title={title}>
      <div>{children}</div>
    </Tooltip>
  </div>
);