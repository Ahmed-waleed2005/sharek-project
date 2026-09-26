// ==========================================================
// طبقة الاتصال بالـ API الخلفي (NestJS)
// ==========================================================
const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('sharek_token');
}
function setSession(token, user) {
  localStorage.setItem('sharek_token', token);
  localStorage.setItem('sharek_user', JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem('sharek_token');
  localStorage.removeItem('sharek_user');
}
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('sharek_user') || 'null');
  } catch {
    return null;
  }
}

async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || 'حدث خطأ غير متوقع';
    throw new Error(Array.isArray(message) ? message.join('، ') : message);
  }
  return data;
}

const api = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload }),
  me: () => apiRequest('/users/me', { auth: true }),
  updateMe: (payload) => apiRequest('/users/me', { method: 'PATCH', body: payload, auth: true }),

  categories: () => apiRequest('/categories'),

  initiatives: (queryString = '') => apiRequest(`/initiatives${queryString}`),
  initiative: (id) => apiRequest(`/initiatives/${id}`),
  initiativesForMap: () => apiRequest('/initiatives/map'),
  createInitiative: (payload) =>
    apiRequest('/initiatives', { method: 'POST', body: payload, auth: true }),
  updateInitiative: (id, payload) =>
    apiRequest(`/initiatives/${id}`, { method: 'PATCH', body: payload, auth: true }),
  deleteInitiative: (id) => apiRequest(`/initiatives/${id}`, { method: 'DELETE', auth: true }),

  joinInitiative: (id) => apiRequest(`/initiatives/${id}/join`, { method: 'POST', auth: true }),
  leaveInitiative: (id) => apiRequest(`/initiatives/${id}/join`, { method: 'DELETE', auth: true }),
  myInitiatives: () => apiRequest('/users/me/initiatives', { auth: true }),
};
