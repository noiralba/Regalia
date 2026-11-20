import { useState } from "react";
import type { StatusMessage } from "./types";

/**
 * Håller meddelandet ("Filmen har sparats!" / felmeddelande) som visas
 * överst i formulärkortet. Varje sida anropar hooken en gång.
 */
export function useStatusMessage() {
  const [message, setMessage] = useState<StatusMessage | null>(null);

  return {
    message,
    showSuccess: (text: string) => setMessage({ type: "success", text }),
    showError: (text: string) => setMessage({ type: "danger", text }),
    clearMessage: () => setMessage(null),
  };
}

export type StatusApi = ReturnType<typeof useStatusMessage>;
