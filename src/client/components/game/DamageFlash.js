import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { State } from 'statty';
import styles from '../../../../styles/DamageFlash.css';
import { HIT_POINTS } from '../../../common/fields/GameFields';
import { GAME } from '../../../common/fields/StateFields';

export class UnconnectedDamageFlash extends Component {
  static propTypes = {
    hitPoints: PropTypes.number.isRequired
  };
  
  constructor(props) {
    super(props);
    this.state = {
      changing: false
    }
  }
  
  componentWillReceiveProps(props) {
    if (props.hitPoints !== this.props.hitPoints) {
      this.setState({ changing: true });
      setTimeout(() => this.setState({ changing: false }), 100);
    }
  }
  
  render() {
    return (
      <div className={classnames(styles.DamageFlash, { [styles.open]: this.state.changing })}/>
    );
  }
}

const DamageFlash = () => (
  <State
    select={(state) => ({
      hitPoints: state.getIn([GAME, HIT_POINTS])
    })}
    render={(hitPoints) => (
      <UnconnectedDamageFlash hitPoints={hitPoints}/>
    )}
  />
);

export default DamageFlash;