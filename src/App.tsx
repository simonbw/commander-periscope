import { Route, Routes } from "react-router";
import ConnectionWarner from "./components/ConnectionWarner";
import MainMenu from "./components/menu/MainMenu";
import { LOBBY_PATH, MENU_PATH } from "./lib/routes";
import LobbyRoute from "./routes/LobbyRoute";
import MessagePage from "./components/MessagePage";

/** The top level component for Commander Periscope. */
export default function App() {
  return (
    <>
      <ConnectionWarner />
      <Routes>
        <Route path={MENU_PATH} element={<MainMenu />} />
        <Route path={LOBBY_PATH} element={<LobbyRoute />} />
        <Route path="*" element={<MessagePage title="Page not found" />} />
      </Routes>
    </>
  );
}
