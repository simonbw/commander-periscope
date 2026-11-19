import styles from "../../../../styles/CaptainPage.module.css";
import FloatingText from "../../FloatingText";
import { type Mode, PICK_START_LOCATION_MODE } from "./ModeWrapper";

interface MessagesProps {
  mode: Mode;
  waitingForEngineer: boolean;
  waitingForFirstMate: boolean;
}

const Messages = (props: MessagesProps) => (
  <FloatingText className={styles.Messages}>
    {props.mode === PICK_START_LOCATION_MODE ? (
      <div>Choose Start Location</div>
    ) : (
      <>
        {props.waitingForEngineer ? (
          <div className={styles.waiting}>Waiting for Engineer</div>
        ) : (
          <div className={styles.notWaiting}>Engineer has gone</div>
        )}
        {props.waitingForFirstMate ? (
          <div className={styles.waiting}>Waiting for First Mate</div>
        ) : (
          <div className={styles.notWaiting}>First Mate has gone</div>
        )}
      </>
    )}
  </FloatingText>
);

export default Messages;
