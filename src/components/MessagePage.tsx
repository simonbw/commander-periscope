import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import styles from "../../styles/LoadingPage.module.css";
import { MENU_PATH } from "../lib/routes";
import FloatingText from "./FloatingText";

/** A full-page message (lobby not found, etc.) with a way back to the menu. */
const MessagePage = ({ title, body }: { title: string; body?: string }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.LoadingPage} id="message-page">
      <FloatingText>
        <h1>{title}</h1>
        {body && <p>{body}</p>}
      </FloatingText>
      <Button variant="contained" onClick={() => navigate(MENU_PATH)}>
        Main Menu
      </Button>
    </div>
  );
};

export default MessagePage;
