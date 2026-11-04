/**
 * ENDA stället där adminsidorna pratar med servern.
 *  - Vanliga objekt skickas som JSON.
 *  - FormData (t.ex. bilduppladdning) skickas som den är.
 *  - Om servern svarar med ett fel kastas ett Error med serverns felmeddelande.
 */
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function request<T = unknown>(
  url: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body; // webbläsaren sätter Content-Type själv
  } else if (body !== undefined) {
    requestBody = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, { method, headers, body: requestBody });

  if (!response.ok) {
    let message = "Något gick fel. Försök igen.";
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      /* svaret var inte JSON */
    }
    throw new Error(message);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

// Korta varianter att använda i resten av koden
export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T = unknown>(url: string, body?: unknown) =>
    request<T>(url, { method: "POST", body }),
  put: <T = unknown>(url: string, body?: unknown) =>
    request<T>(url, { method: "PUT", body }),
  delete: <T = unknown>(url: string) => request<T>(url, { method: "DELETE" }),
};
