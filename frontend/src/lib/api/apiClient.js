const defaultApiBaseUrl = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl).replace(/\/$/, '')

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')

    return token ? { Authorization: `Bearer ${token}` } : {}
}

const request = async (path, options = {}) => {
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...getAuthHeaders(),
            ...options.headers,
        },
        ...options,
    })

    const contentType = response.headers.get('content-type')
    const data = contentType?.includes('application/json')
        ? await response.json()
        : await response.text()

    if (!response.ok) {
        const error = new Error(typeof data === 'string' ? data : data?.message || 'Request failed')
        error.status = response.status
        error.data = data
        throw error
    }

    return { data }
}
// Simple API client with get, post, put, and delete methods that include auth headers if token exists
const api = {
    get: (path, options) => request(path, {
        method: 'GET',
        ...options,
    }),
    post: (path, body, options) => request(path, {
        method: 'POST',
        body: JSON.stringify(body),
        ...options,
    }),
    upload: (path, body, options) => request(path, {
        method: 'POST',
        body,
        ...options,
    }),
    put: (path, body, options) => request(path, {
        method: 'PUT',
        body: JSON.stringify(body),
        ...options,
    }),
    delete: (path, options) => request(path, {
        method: 'DELETE',
        ...options,
    }),
}

export default api
