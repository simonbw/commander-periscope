import { Button } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../../styles/GameOverPage.css';
import FloatingText from '../FloatingText';

const GameOverPage = ({ isWinner, goToMainMenu }) => (
  <div className={styles.GameOverPage}>
    <FloatingText>
      <h1>
        {isWinner ? 'WINNER WINNER CHICKEN DINNER' : 'BETTER LUCK NEXT TIME'}
      </h1>
      <Button variant="raised" size="large" onClick={goToMainMenu}>Main Menu</Button>
    </FloatingText>
  </div>
);

GameOverPage.propTypes = {
  isWinner: PropTypes.bool.isRequired,
  goToMainMenu: PropTypes.func.isRequired,
};

export default GameOverPage;