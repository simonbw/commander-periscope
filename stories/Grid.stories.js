import { action, decorateAction } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import React from 'react';
import Grid from '../src/client/components/game/GridView';
import { LAND_TILE } from '../src/common/Grid';
import '../styles/main.css';
import { mockGrid } from '../test/mocks';

const grid = mockGrid();

const locationAction = decorateAction([(args) => [args[0].get(0), args[0].get(1)]]);

storiesOf('Grid', module)
  .add('Basic Grid', () => (
    <Grid grid={grid}/>
  ))
  .add('Location and Path', () => (
    <Grid
      grid={grid}
      subLocation={Immutable.List([4, 3])}
      subPath={Immutable.fromJS([[4, 4], [4, 5], [5, 5]])}
    />
  ))
  .add('Clickable Grid (water only)', () => (
    <Grid
      grid={grid}
      canClick={(position) => grid.getIn(position) !== LAND_TILE}
      onClick={locationAction('onClick')}
    />
  ))
  .add('SectorChooser (evens only)', () => (
    <Grid
      grid={grid}
      canClickSector={(sector) => sector % 2 === 0}
      onClickSector={action('onClickSector')}
    />
  ));
