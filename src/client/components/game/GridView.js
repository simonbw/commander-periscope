import classnames from 'classnames';
import Immutable from 'immutable';
import React from 'react';
import styles from '../../../../styles/Grid.css';
import { LAND_TILE, WATER_TILE } from '../../../common/Grid';

const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// TODO Should this be an SVG?
// TODO: Document these props
// TODO: Make this whole file less painful to read
const Grid = ({ grid, subLocation, subPath, canClick = () => false, onClick = () => null, canClickSector = () => false, onClickSector = () => null }) => (
  <div className={styles.Grid}>
    <SectorsOverlay {...{ grid, canClickSector, onClickSector }}/>
    <div className={styles.Column}>
      <span className={styles.RowLabel}/>
      {grid.get(0).map((cell, y) => (
        <span key={y} className={styles.RowLabel}>{ROW_LABELS[y]}</span>
      ))}
    </div>
    {grid.map((column, x) => (
      <div className={styles.Column} key={x}>
        <span className={styles.ColumnLabel}>{x + 1}</span>
        {column.map((tile, y) => (
          <Cell
            key={y}
            tile={tile}
            onClick={canClick(Immutable.List([x, y]))
              ? () => onClick(Immutable.List([x, y]))
              : undefined}
            isSubLocation={Immutable.List([x, y]).equals(subLocation)}
            isSubPath={subPath && subPath.includes(Immutable.List([x, y]))}
          />
        ))}
      </div>
    ))}
  </div>
);

const Cell = ({ tile, onClick, isSubLocation, isSubPath }) => (
  <div
    className={classnames(
      'Cell', // for testing
      styles.Cell,
      { [styles.clickable]: Boolean(onClick) },
      getTileClass(tile))}
    onClick={onClick}
  >
    {isSubLocation && (<span>◉</span>)}
    {isSubPath && (<span>╳</span>)}
  </div>
);

const SectorsOverlay = ({ canClickSector, onClickSector }) => (
  <div className={styles.SectorsOverlay}>
    {Immutable.Range(1, 10).map((i) => (
      <div
        key={i}
        className={classnames(styles.Sector, { [styles.clickable]: canClickSector(i) })}
        onClick={canClickSector(i) ? (() => onClickSector(i)) : undefined}
      >
        {i}
      </div>
    ))}
  </div>
);

const getTileClass = (tile) => {
  switch (tile) {
    case WATER_TILE:
      return styles.water;
    case LAND_TILE:
      return styles.land;
    default:
      throw new Error(`Unknown tile: ${tile}`);
  }
};

// TODO: Paths, sub locations, mines, etc.

export default Grid;