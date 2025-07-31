const API_URL = 'http://localhost:3001/api';

interface AuthFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string | null;
}

/**
 * A wrapper around fetch for making authenticated API calls.
 * Automatically adds Content-Type and Authorization headers.
 * Throws an error with the server message on failure.
 * @param endpoint - The API endpoint (e.g., '/posts')
 * @param options - Fetch options including method, body, and token.
 * @returns The JSON response from the server.
 */
export const authFetch = async (endpoint: string, options: AuthFetchOptions = {}) => {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  const contentType = response.headers.get("content-type");
  if (!response.ok) {
    let errorMessage = 'API 요청 중 오류가 발생했습니다.';
    if (contentType && contentType.indexOf("application/json") !== -1) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore if response is not valid JSON
      }
    }
    throw new Error(errorMessage);
  }
  
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }

  return true; // For successful responses without a body (e.g., 204 No Content)
};
