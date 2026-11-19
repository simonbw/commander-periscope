import { Snackbar } from "@mui/material";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { getErrorMessage } from "../lib/errors";

type ReportError = (error: unknown) => void;

const ErrorReporterContext = createContext<ReportError>((error) => console.error(error));

/** Report a failed action to the player (shown as a toast). */
export function useReportError(): ReportError {
  return useContext(ErrorReporterContext);
}

/**
 * Shows errors from failed mutations. The old socket app silently dropped
 * these; now that game rules throw ConvexErrors with readable messages
 * ("That system isn't charged"), show them.
 */
export function ErrorReporterProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const report = useCallback<ReportError>((error) => {
    console.error(error);
    setMessage(getErrorMessage(error));
  }, []);
  return (
    <ErrorReporterContext.Provider value={report}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={4000}
        message={message}
        onClose={() => setMessage(null)}
        open={message !== null}
      />
    </ErrorReporterContext.Provider>
  );
}
