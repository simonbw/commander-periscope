import { CircularProgress } from "@mui/material";
import style from "../../../styles/SurfacedPage.module.css";
import FloatingText from "../FloatingText";

const SurfacedPage = () => (
  <div id="surface-page" className={style.SurfacedPage}>
    <FloatingText>
      <h1>Surfacing...</h1>
    </FloatingText>
    <FloatingCircularProgress />
  </div>
);

const FloatingCircularProgress = () => (
  <CircularProgress
    size={80}
    thickness={8}
    sx={{
      color: "#FFFFFF",
      // TODO: Pull shadow from theme
      filter: "drop-shadow(0 1px 5px rgba(0, 0, 0, 0.2)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.14))",
    }}
  />
);

export default SurfacedPage;
