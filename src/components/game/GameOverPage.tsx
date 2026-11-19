import { Button } from "@mui/material";
import styles from "../../../styles/GameOverPage.module.css";
import FloatingText from "../FloatingText";

interface GameOverPageProps {
  isWinner: boolean;
  goToMainMenu: () => void;
}

const GameOverPage = ({ isWinner, goToMainMenu }: GameOverPageProps) => (
  <div className={styles.GameOverPage}>
    <FloatingText>
      <h1>{isWinner ? "WINNER WINNER CHICKEN DINNER" : "BETTER LUCK NEXT TIME"}</h1>
      <Button variant="contained" size="large" onClick={goToMainMenu}>
        Main Menu
      </Button>
    </FloatingText>
  </div>
);

export default GameOverPage;
