const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7084';

const publicEndpoints = [
  'api/Auth/login',
  'api/Auth/register',
  'api/Auth/email-reset-password',
];

async function client<T>(endpoint: string, {
  data,
  headers: customHeaders,
  ...customConfig
}: RequestInit & { data?: unknown } = {}): Promise<T> {

  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': data ? 'application/json' : ''
  };

  if (token && !publicEndpoints.includes(endpoint)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      ...headers,
      ...customHeaders,
    },
    ...customConfig,
  };


  const response = await fetch(`${BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    const error = await response.text();
    return Promise.reject(new Error(`API Error: ${response.status} ${response.statusText} - ${error}`));
  }

  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return undefined as T;
  }

  return await response.json();
}

export default client;