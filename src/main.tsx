import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "../styles/main.css";
import App from "./App";
import { ErrorReporterProvider } from "./components/ErrorReporter";
import ThemeProvider from "./components/ThemeProvider";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not set. Run `npm run dev` (it starts Convex and writes .env.local).");
}
const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <ErrorReporterProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorReporterProvider>
      </ThemeProvider>
    </ConvexProvider>
  </StrictMode>,
);
