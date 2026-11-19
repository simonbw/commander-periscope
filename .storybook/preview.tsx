import type { Decorator, Preview } from "@storybook/react-vite";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { MemoryRouter } from "react-router";
import { ErrorReporterProvider } from "../src/components/ErrorReporter";
import ThemeProvider from "../src/components/ThemeProvider";
import "../styles/main.css";

// Stories render presentational components with fake data, but some connected
// children call Convex hooks (useMutation etc.), which need a client. This one
// points at a dummy deployment and never connects: the client only opens its
// websocket on first use, so mutations and actions are stubbed to fail fast
// (the ErrorReporter toast shows the message) instead of reaching the network.
const convex = new ConvexReactClient("https://example.convex.cloud");
const offline = () => Promise.reject(new Error("Storybook has no Convex backend"));
convex.mutation = offline as ConvexReactClient["mutation"];
convex.action = offline as ConvexReactClient["action"];

/** The app's provider stack (see src/main.tsx), minus the real backend. */
const withProviders: Decorator = (Story) => (
  <ConvexProvider client={convex}>
    <ThemeProvider>
      <ErrorReporterProvider>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </ErrorReporterProvider>
    </ThemeProvider>
  </ConvexProvider>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    layout: "fullscreen",
  },
};

export default preview;
