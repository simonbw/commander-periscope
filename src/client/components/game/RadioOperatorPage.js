import classnames from 'classnames';
import { Avatar, Collapse, Divider, Fade, List, ListItem, ListItemText, ListSubheader, Paper } from 'material-ui';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/RadioOperatorPage.css';
import { getDirectionArrow } from '../../../common/Grid';
import {
  ACTION_ID,
  ACTION_TYPE,
  DIRECTION_MOVED,
  GAME,
  GRID,
  OPPONENT_ACTIONS,
  SYSTEM_USED
} from '../../../common/StateFields';
import { getIconForSystem } from '../SystemIcons';
import Grid from './GridView';

const MAX_VISIBLE_ACTIONS = 10;

export const UnconnectedRadioOperatorPage = ({ grid, opponentActions }) => (
  <div id="radio-operator-page" className={styles.RadioOperatorPage}>
    <div className={styles.GridContainer}>
      <Grid grid={grid}/>
    </div>
    <Paper className={styles.RecentMovesPaper}>
      <List
        classes={{ root: styles.RecentMovesList }}
        subheader={<div/>}
      >
        <ListSubheader>Opponent Actions</ListSubheader>
        <Divider/>
        {opponentActions.take(MAX_VISIBLE_ACTIONS + 1).map((action, i) => ( //last one isn't visible
          <ActionInfo action={action} key={action.get(ACTION_ID)} i={i}/>
        ))}
      </List>
    </Paper>
  </div>
);

class ActionInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { hasBeenAdded: false };
    setTimeout(() => this.setState({ hasBeenAdded: true }), 5);
  }
  
  render() {
    const { action, i } = this.props;
    const { hasBeenAdded } = this.state;
    return (
      <Fragment>
        <Collapse in={hasBeenAdded}>
          <Fade in={i < MAX_VISIBLE_ACTIONS}>
            <ListItem
              dense
              className={classnames(
                styles.ActionInfo,
                { [styles.first]: i === 0 },
                { [styles.last]: i >= MAX_VISIBLE_ACTIONS },
              )}
            >
              {(() => {
                switch (action.get(ACTION_TYPE)) {
                  case 'move':
                    return (
                      <Fragment>
                        <Avatar className={styles.ActionAvatar}>
                          {getDirectionArrow(action.get(DIRECTION_MOVED))}
                        </Avatar>
                        <ListItemText primary={action.get(DIRECTION_MOVED)}/>
                      </Fragment>
                    );
                  case 'useSystem':
                    const system = action.get(SYSTEM_USED);
                    return (
                      <Fragment>
                        {getIconForSystem(system)}
                        <ListItemText primary={system}/>
                      </Fragment>
                    );
                  default:
                    return (
                      <ListItemText primary={JSON.stringify(action)}/>
                    );
                }
              })()}
            </ListItem>
          </Fade>
        </Collapse>
        <Divider/>
      </Fragment>
    );
  }
}

export default connect(
  (state) => ({
    grid: state.getIn([GAME, GRID]),
    opponentActions: state.getIn([GAME, OPPONENT_ACTIONS])
  }),
  (dispatch) => ({})
)(UnconnectedRadioOperatorPage);