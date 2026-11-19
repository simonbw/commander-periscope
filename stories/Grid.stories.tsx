import { Fade, FormControlLabel, Paper, Radio, RadioGroup, Switch } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { getMoveOptions } from "../shared/gameUtils";
import { createAlphaGrid, createBravoGrid, createCharlieGrid, createEmptyGrid } from "../shared/grids";
import GridBackground from "../src/components/grid/GridBackground";
import GridContainer from "../src/components/grid/GridContainer";
import GridCrosshairs from "../src/components/grid/GridCrosshairs";
import GridLabels from "../src/components/grid/GridLabels";
import GridMines from "../src/components/grid/GridMines";
import GridMoveChooser from "../src/components/grid/GridMoveChooser";
import GridPath from "../src/components/grid/GridPath";
import GridSectors from "../src/components/grid/GridSectors";
import GridSectorSelect from "../src/components/grid/GridSectorSelect";
import GridTiles from "../src/components/grid/GridTiles";
import GridTileSelect from "../src/components/grid/GridTileSelect";
import SubMarker from "../src/components/grid/SubMarker";
import { mockMines, mockPath } from "./mocks";

const LAYERS = [
  "background",
  "sectors",
  "tiles",
  "labels",
  "path",
  "mines",
  "sectorSelect",
  "tileSelect",
  "moveChooser",
  "subLocation",
] as const;

type Layer = (typeof LAYERS)[number];
type Layers = Record<Layer, boolean>;

const GRIDS = [createEmptyGrid(), createAlphaGrid(), createBravoGrid(), createCharlieGrid()];
const GRID_NAMES = ["Empty", "Alpha", "Bravo", "Charlie"];

// Layer toggles are remembered across reloads.
const storageKey = (layer: Layer) => `layerToggle-${layer}`;

function loadSavedLayers(): Layers {
  const layers = {} as Layers;
  for (const layer of LAYERS) {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(storageKey(layer));
    } catch {
      // storage unavailable; default to on
    }
    layers[layer] = saved !== "false";
  }
  return layers;
}

const capitalize = (s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

const LayerToggles = ({ layers, toggleLayer }: { layers: Layers; toggleLayer: (layer: Layer) => void }) => (
  <Paper style={{ display: "flex", flexFlow: "column nowrap", margin: "10px", padding: "10px" }}>
    <h3>Layers</h3>
    {LAYERS.map((layer) => (
      <FormControlLabel
        key={layer}
        control={<Switch checked={layers[layer]} onChange={() => toggleLayer(layer)} />}
        label={capitalize(layer)}
      />
    ))}
  </Paper>
);

const GridToggle = ({ gridIndex, setGridIndex }: { gridIndex: number; setGridIndex: (index: number) => void }) => (
  <Paper style={{ display: "flex", flexFlow: "column nowrap", margin: "10px", padding: "10px" }}>
    <RadioGroup value={String(gridIndex)} onChange={(_, value) => setGridIndex(Number(value))}>
      {GRIDS.map((_, i) => (
        <FormControlLabel control={<Radio />} key={i} label={GRID_NAMES[i]} value={String(i)} />
      ))}
    </RadioGroup>
  </Paper>
);

/** Every grid layer stacked up, with switches to toggle each one and a map picker. */
const GridDemo = () => {
  const [gridIndex, setGridIndex] = useState(2);
  const [layers, setLayers] = useState(loadSavedLayers);
  const [{ path, subLocation }] = useState(() => {
    const fullPath = mockPath();
    return { path: fullPath.slice(0, -1), subLocation: fullPath[fullPath.length - 1] };
  });
  const [mines] = useState(mockMines);
  const grid = GRIDS[gridIndex];

  const toggleLayer = (layer: Layer) => {
    try {
      localStorage.setItem(storageKey(layer), String(!layers[layer]));
    } catch {
      // ignore
    }
    setLayers({ ...layers, [layer]: !layers[layer] });
  };

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row wrap",
        padding: "10px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LayerToggles toggleLayer={toggleLayer} layers={layers} />
      <GridContainer style={{ margin: "10px" }}>
        <Fade in={layers.background}>
          <g>
            <GridBackground height={15} width={15} />
          </g>
        </Fade>
        <Fade in={layers.sectors}>
          <g>
            <GridSectors />
          </g>
        </Fade>
        <Fade in={layers.tiles}>
          <g>
            <GridTiles grid={grid} />
          </g>
        </Fade>
        <Fade in={layers.path}>
          <g>
            <GridPath path={[...path, subLocation]} />
          </g>
        </Fade>
        <Fade in={layers.mines}>
          <g>
            <GridMines mines={mines} />
          </g>
        </Fade>
        <GridSectorSelect>
          {(sector) => (
            <Fade in={layers.sectorSelect}>
              <g>
                <GridSectors selected={sector} />
              </g>
            </Fade>
          )}
        </GridSectorSelect>
        <GridTileSelect>
          {(tile) => (
            <>
              <Fade in={layers.labels}>
                <g>
                  <GridLabels
                    width={15}
                    height={15}
                    selectedX={tile && layers.tileSelect ? tile[0] : undefined}
                    selectedY={tile && layers.tileSelect ? tile[1] : undefined}
                  />
                </g>
              </Fade>
              <Fade in={layers.tileSelect}>
                <g>
                  <GridCrosshairs tile={tile} />
                </g>
              </Fade>
              <Fade in={layers.moveChooser}>
                <g>
                  <GridMoveChooser
                    subLocation={subLocation}
                    mouseTile={tile}
                    moveOptions={getMoveOptions(subLocation, grid, path, mines)}
                  />
                </g>
              </Fade>
              <Fade in={layers.subLocation}>
                <g>
                  <SubMarker location={subLocation} />
                </g>
              </Fade>
            </>
          )}
        </GridTileSelect>
      </GridContainer>

      <GridToggle gridIndex={gridIndex} setGridIndex={setGridIndex} />
    </div>
  );
};

const meta = {
  title: "Components/Grid",
  component: GridDemo,
} satisfies Meta<typeof GridDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Grid: Story = {};
