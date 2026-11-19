import { CircularProgress } from "@mui/material";
import styles from "../../styles/LoadingPage.module.css";
import FloatingText from "./FloatingText";

const LoadingPage = () => (
  <div className={styles.LoadingPage}>
    <FloatingText>
      <h1>Loading...</h1>
    </FloatingText>
    <CircularProgress
      size={80}
      thickness={8}
      sx={{
        color: "#FFFFFF",
        filter: "drop-shadow(0 1px 5px rgba(0, 0, 0, 0.2)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.14))",
      }}
    />
  </div>
);

export default LoadingPage;
