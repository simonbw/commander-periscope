import classnames from 'classnames';
import Immutable from 'immutable';
import React from 'react';
import styles from '../../../../styles/Grid.css';
import { LAND_TILE, WATER_TILE } from '../../../common/Grid';
import { noop } from '../../../common/util/FunctionUtil';
import { createRange } from '../../../common/util/ImmutableUtil';

const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// TODO: sectors
// TODO: Paths, sub locations, mines, etc.

const Grid = ({ grid, subLocation, path, canClick = noop, onClick = noop, canClickSector = noop, onClickSector = noop }) => (
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
            onClick={canClick([x, y], tile)
              ? () => onClick([x, y], tile)
              : undefined}
            isSubLocation={Immutable.List([x, y]).equals(subLocation)}
          />
        ))}
      </div>
    ))}
  </div>
);

const Cell = ({ tile, onClick, isSubLocation }) => (
  <div
    className={classnames(
      'Cell', // for testing
      styles.Cell,
      { [styles.clickable]: Boolean(onClick) },
      getTileClass(tile))}
    onClick={onClick}
  >{isSubLocation && (<span>◉</span>)}</div>
);

const SectorsOverlay = ({ canClickSector, onClickSector }) => (
  <div className={styles.SectorsOverlay}>
    {createRange(1, 10).map((i) => (
      <div
        key={i}
        className={classnames(styles.Sector, { [styles.clickable]: canClickSector(i) })}
        onClick={canClickSector(i) && (() => onClickSector(i))}
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

// TODO: show paths/current location

export default Grid;