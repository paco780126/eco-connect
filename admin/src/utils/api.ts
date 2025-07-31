const API_URL = 'http://localhost:3001/api';

interface AuthFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string | null;
}

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
  const responseText = await response.text();

  if (!response.ok) {
    let errorMessage = 'API 요청 중 오류가 발생했습니다.';
    try {
      // Try to parse the error response as JSON
      const errorData = JSON.parse(responseText);
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Error response was not JSON, use the generic message
    }
    throw new Error(errorMessage);
  }

  // Handle successful responses
  try {
    return responseText ? JSON.parse(responseText) : true;
  } catch (e) {
    console.error("Failed to parse successful JSON response:", responseText, e);
    throw new Error("서버로부터 받은 응답을 처리할 수 없습니다.");
  }
};
