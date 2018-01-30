import { storiesOf } from '@storybook/react';
import React from 'react';
import LoadingPage from '../src/client/components/LoadingPage';
import '../styles/main.css';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('LoadingPage', () => (
    <LoadingPage/>
  ));
