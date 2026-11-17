import type { UserBookingHistoryResponse } from "../types/types";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  credentials?: RequestCredentials;
};

export async function request<T = unknown>(
  url: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Origin: "http://localhost:5173" };
  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    requestBody = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: requestBody,
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Något gick fel. Försök igen.";
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

export const api = {
  get: <T>(url: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(url, { ...options, method: "GET" }),

  getById: <T>(url: string, id: string | number) => request<T>(`${url}/${id}`),

  post: <T = unknown, B = unknown>(url: string, body?: B) =>
    request<T>(url, { method: "POST", body }),

  put: <T = unknown, B = unknown>(url: string, body?: B) =>
    request<T>(url, { method: "PUT", body }),

  delete: <T = void>(url: string) => request<T>(url, { method: "DELETE" }),

  getUserBookings: (userId: string, offset = 0) =>
    request<UserBookingHistoryResponse>(
      `http://localhost:3000/api/users/${userId}/bookings?offset=${offset}`,
    ),
};
