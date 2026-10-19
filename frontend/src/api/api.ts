export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Handle 204 No Content response
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// GET
export function get<T>(url: string): Promise<T> {
  return request<T>(url);
}

// GET by ID
export function getById<T>(
  url: string,
  id: string | number
): Promise<T> {
  return request<T>(`${url}/${id}`);
}

// POST
export function post<T, B>(
  url: string,
  body: B
): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

// PUT
export function put<T, B>(
  url: string,
  body: B
): Promise<T> {
  return request<T>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

// DELETE
export function del<T = void>(url: string): Promise<T> {
  return request<T>(url, {
    method: 'DELETE'
  });
}
