import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import React from 'react';
import { StartLocationChooser } from '../src/client/components/game/CaptainPage';
import Grid from '../src/client/components/game/GridView';
import { createGrid, LAND_TILE } from '../src/common/Grid';
import '../styles/main.css';

const grid = createGrid()
  .setIn([5, 2], LAND_TILE)
  .setIn([5, 3], LAND_TILE)
  .setIn([6, 3], LAND_TILE)
  .setIn([7, 3], LAND_TILE)
  .setIn([8, 3], LAND_TILE)
  .setIn([3, 9], LAND_TILE)
  .setIn([3, 10], LAND_TILE)
  .setIn([4, 10], LAND_TILE)
  .setIn([4, 11], LAND_TILE)
  .setIn([4, 12], LAND_TILE)
;

storiesOf('Grid', module)
  .add('Basic Grid', () => (
    <Grid grid={grid}/>
  ))
  .add('Clickable Grid (water only)', () => (
    <Grid
      grid={grid}
      canClick={([x, y], tile) => tile !== LAND_TILE}
      onClick={action('onClick')}
    />
  ))
  .add('StartLocationChooser', () => (
    <StartLocationChooser
      grid={grid}
      subLocation={Immutable.List([8, 5])}
      setStartLocation={action('setStartLocation')}
    />
  ))
  .add('SectorChooser (evens only)', () => (
    <Grid
      grid={grid}
      canClickSector={(sector) => sector % 1 === 0}
      onClickSector={action('onClickSector')}
    />
  ));
