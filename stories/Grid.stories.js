import { storiesOf } from '@storybook/react';
import Immutable from 'immutable';
import { Fade, FormControlLabel, Paper, Switch } from 'material-ui';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import GridBackground from '../src/client/components/game/Grid/GridBackground';
import GridContainer from '../src/client/components/game/Grid/GridContainer';
import GridCrosshairs from '../src/client/components/game/Grid/GridCrosshairs';
import GridLabels from '../src/client/components/game/Grid/GridLabels';
import GridMines from '../src/client/components/game/Grid/GridMines';
import GridMoveChooser from '../src/client/components/game/Grid/GridMoveChooser';
import GridPath from '../src/client/components/game/Grid/GridPath';
import GridSectors from '../src/client/components/game/Grid/GridSectors';
import GridSectorSelect from '../src/client/components/game/Grid/GridSectorSelect';
import GridTiles from '../src/client/components/game/Grid/GridTiles';
import GridTileSelect from '../src/client/components/game/Grid/GridTileSelect';
import SubMarker from '../src/client/components/game/Grid/SubMarker';
import { getMoveOptions } from '../src/common/util/GameUtils';
import '../styles/main.css';
import { mockGrid, mockMines, mockPath } from '../test/mocks';
import StoryWrapper from './StoryWrapper';

storiesOf('Components', module)
  .addDecorator(StoryWrapper)
  .add('Grid', () => {
    return (
      <StateWrapper>
        {({ grid, path, subLocation, mines, toggleLayer, layers }) => (
          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              padding: '10px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LayerToggles toggleLayer={toggleLayer} layers={layers}/>
            <GridContainer style={{ margin: '10px' }}>
              <Fragment>
                <Fade in={layers.get('background')}>
                  <GridBackground height={15} width={15}/>
                </Fade>
                <Fade in={layers.get('sectors')}>
                  <GridSectors/>
                </Fade>
                <Fade in={layers.get('tiles')}>
                  <GridTiles grid={grid}/>
                </Fade>
                <Fade in={layers.get('path')}>
                  <GridPath path={path.push(subLocation)}/>
                </Fade>
                <Fade in={layers.get('mines')}>
                  <GridMines mines={mines}/>
                </Fade>
                <GridSectorSelect>
                  {(sector) => (
                    <Fade in={layers.get('sectorSelect')}>
                      <GridSectors selected={sector}/>
                    </Fade>
                  )}
                </GridSectorSelect>
                <GridTileSelect>
                  {(tile) => (
                    <Fragment>
                      <Fade in={layers.get('labels')}>
                        <GridLabels
                          width={15}
                          height={15}
                          selectedX={tile && layers.get('tileSelect') ? tile.get(0) : undefined}
                          selectedY={tile && layers.get('tileSelect') ? tile.get(1) : undefined}
                        />
                      </Fade>
                      <Fade in={layers.get('tileSelect')}>
                        <GridCrosshairs tile={tile}/>
                      </Fade>
                      <Fade in={layers.get('moveChooser')}>
                        <GridMoveChooser
                          subLocation={subLocation}
                          mouseTile={tile}
                          moveOptions={getMoveOptions(subLocation, grid, path, mines)}
                        />
                      </Fade>
                      <Fade in={layers.get('subLocation')}>
                        <SubMarker location={subLocation}/>
                      </Fade>
                    </Fragment>
                  )}
                </GridTileSelect>
              </Fragment>
            </GridContainer>
          </div>
        )}
      </StateWrapper>
    );
  });

const LayerToggles = ({ layers, toggleLayer }) => (
  <Paper
    style={{
      display: 'flex',
      flexFlow: 'column nowrap',
      margin: '10px',
      padding: '10px',
    }}
  >
    <h3>Layers</h3>
    {layers.map((active, layer) => (
      <FormControlLabel
        key={layer}
        control={
          <Switch
            checked={active}
            onChange={() => toggleLayer(layer)}
          />
        }
        label={`${layer.charAt(0).toUpperCase()}${layer.slice(1)}`}
      />
    )).toIndexedSeq()}
  </Paper>
);

LayerToggles.propTypes = {
  layers: PropTypes.instanceOf(Immutable.Map).isRequired,
  toggleLayer: PropTypes.func.isRequired
};

class StateWrapper extends Component {
  constructor(props) {
    super(props);
    const path = mockPath();
    this.state = {
      grid: mockGrid(),
      path: path.butLast(),
      mines: mockMines(),
      subLocation: path.last(),
      layers: Immutable.OrderedMap({
        background: true,
        sectors: true,
        tiles: true,
        labels: true,
        path: true,
        mines: true,
        sectorSelect: true,
        tileSelect: true,
        moveChooser: true,
        subLocation: true,
      }),
    };
  }
  
  componentDidMount() {
    console.log('mounted', this.state.layers.toJS());
    this.setState({ layers: this.state.layers.map((on, layer) => this.loadSavedToggle(layer)) }, () => {
      console.log('loaded', this.state.layers.toJS());
    });
  }
  
  loadSavedToggle(layer) {
    console.log(layer, localStorage.getItem(`layerToggle-${layer}`) !== 'false');
    return localStorage.getItem(`layerToggle-${layer}`) !== 'false';
  }
  
  toggleLayer(layer) {
    localStorage.setItem(`layerToggle-${layer}`, String(!this.state.layers.get(layer)));
    this.setState({ layers: this.state.layers.update(layer, a => !a) })
  }
  
  render() {
    return (
      <Fragment>
        {this.props.children({
          ...this.state,
          toggleLayer: (layer) => this.toggleLayer(layer)
        })}
      </Fragment>
    );
  }
}