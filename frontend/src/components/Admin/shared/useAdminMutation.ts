import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StatusApi } from "./useStatusMessage";

type Options<TVariables> = {
  /** Anropet till servern, t.ex. (id) => api.delete(`/api/movies/${id}`) */
  mutationFn: (variables: TVariables) => Promise<unknown>;
  /** Meddelandehanteraren från useStatusMessage() */
  status: StatusApi;
  /** Texten som visas vid lyckat anrop (kan bero på variablerna) */
  successMessage: string | ((variables: TVariables) => string);
  /** Query-nycklar (från queryKeys) som ska hämtas på nytt efter lyckat anrop */
  invalidate?: readonly (readonly unknown[])[];
  /** Körs efter lyckat anrop, t.ex. för att tömma formuläret */
  onSuccess?: (variables: TVariables) => void;
};

/**
 * Ett vanligt "skriv-anrop" (skapa/ändra/radera) med allt som brukar behövas:
 * visa meddelande, hämta om listorna och låta sidan städa upp efteråt.
 * Fel visas automatiskt med serverns felmeddelande.
 */
export function useAdminMutation<TVariables = void>({
  mutationFn,
  status,
  successMessage,
  invalidate = [],
  onSuccess,
}: Options<TVariables>) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, TVariables>({
    mutationFn,
    onSuccess: (_data, variables) => {
      invalidate.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      );
      status.showSuccess(
        typeof successMessage === "function"
          ? successMessage(variables)
          : successMessage,
      );
      onSuccess?.(variables);
    },
    onError: (error) => status.showError(error.message),
  });
}
