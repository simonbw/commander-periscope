import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../../../styles/RadioOperatorPage.css';
import { GRID, NOTIFICATIONS, TEAM } from '../../../../common/fields/GameFields';
import { GAME } from '../../../../common/fields/StateFields';
import GridBackground from '../../grid/GridBackground';
import GridContainer from '../../grid/GridContainer';
import GridLabels from '../../grid/GridLabels';
import GridSectors from '../../grid/GridSectors';
import GridTiles from '../../grid/GridTiles';
import NotificationList from './NotificationList';

export const UnconnectedRadioOperatorPage = ({ grid, notifications, team }) => (
  <div id="radio-operator-page" className={styles.RadioOperatorPage}>
    <div className={styles.GridBox}>
      <GridContainer>
        <GridBackground height={15} width={15}/> {/* TODO: Don't hard code*/}
        <GridSectors/>
        <GridTiles grid={grid}/>
        <GridLabels height={15} width={15}/>
      </GridContainer>
    </div>
    <NotificationList notifications={notifications} team={team}/>
  </div>
);

export default connect(
  (state) => ({
    grid: state.getIn([GAME, GRID]),
    notifications: state.getIn([GAME, NOTIFICATIONS]),
    team: state.getIn([GAME, TEAM])
  }),
  (dispatch) => ({})
)(UnconnectedRadioOperatorPage);