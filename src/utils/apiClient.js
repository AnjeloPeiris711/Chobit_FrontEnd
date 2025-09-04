const apiClient = {
  async request(method, endpoint, token, data = null, params = {}) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const url = new URL(`${baseUrl}/api${endpoint}`);

    // Append query parameters
    if (params && Object.keys(params).length > 0) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Only set Content-Type for non-FormData payloads
      ...(data && !(data instanceof FormData) && { 'Content-Type': 'application/json' }),
    };

    const config = {
      method,
      headers,
      ...(data && { body: data instanceof FormData ? data : JSON.stringify(data) }),
    };

    try {
      const response = await fetch(url.toString(), config);
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let responseData;
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        const errorMessage = typeof responseData === 'object' && responseData.message
          ? responseData.message
          : `${method} request failed: ${response.status} - ${responseData}`;
        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error) {
      console.error(`API ${method} error at ${endpoint}:`, error.message);
      throw error;
    }
  },

  get(endpoint, token, params = {}) {
    return this.request('GET', endpoint, token, null, params);
  },

  post(endpoint, data, token) {
    return this.request('POST', endpoint, token, data);
  },

  put(endpoint, data, token) {
    return this.request('PUT', endpoint, token, data);
  },

  delete(endpoint, token) {
    return this.request('DELETE', endpoint, token);
  },
};

export default apiClient;