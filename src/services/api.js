const BASE_URL = '/api';

// Helper to get headers
const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // Login
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data?.detail || data?.non_field_errors?.[0] || 'Invalid credentials. Please check your email and password.';
        return { success: false, error: errorMsg };
      }
      return { success: true, token: data.access, user: { username: email.split('@')[0], email, role: 'student' } };
    } catch (err) {
      console.warn("API Server not responding. Falling back to local authentication.", err);
      return { success: false, error: err.message };
    }
  },

  adminLogin: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.detail || "Invalid credentials",
        };
      }

      const profile = await apiService.getProfile(data.access);

      if (profile.role !== "admin") {
        return {
          success: false,
          error: "You are not an admin.",
        };
      }

      return {
        success: true,
        token: data.access,
        user: profile,
      };

    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  },
  // Register
  register: async (dataOrUsername, email, phone, password) => {
    try {
      const bodyData = typeof dataOrUsername === 'object'
        ? dataOrUsername
        : { username: dataOrUsername, email, phone, password };
      const res = await fetch(`${BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      if (!res.ok) {
        let errorMsg = 'Registration failed';
        if (data) {
          if (data.username) errorMsg = `Username: ${Array.isArray(data.username) ? data.username.join(' ') : data.username}`;
          else if (data.email) errorMsg = `Email: ${Array.isArray(data.email) ? data.email.join(' ') : data.email}`;
          else if (data.password) errorMsg = `Password: ${Array.isArray(data.password) ? data.password.join(' ') : data.password}`;
          else if (data.detail) errorMsg = data.detail;
          else if (data.non_field_errors) errorMsg = Array.isArray(data.non_field_errors) ? data.non_field_errors.join(' ') : data.non_field_errors;
        }
        return { success: false, error: errorMsg };
      }
      return { success: true, data };
    } catch (err) {
      console.warn("API Server error:", err);
      return { success: false, error: err.message || 'Registration failed' };
    }
  },


  // Fetch profile
  getProfile: async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/profile/`, {
        headers: getHeaders(token),
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Menu operations
  getMenu: async () => {
    try {
      const res = await fetch(`${BASE_URL}/menu/`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch menu');
      return await res.json();
    } catch (err) {
      console.warn("API Server not responding. Using static menu data.");
      return null;
    }
  },

  addMenuItem: async (item, token) => {
    try {
      const res = await fetch(`${BASE_URL}/menu/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed to add item');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  updateMenuItem: async (item, token) => {
    try {
      const res = await fetch(`${BASE_URL}/menu/${item.id}/`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed to update item');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  deleteMenuItem: async (itemId, token) => {
    try {
      const res = await fetch(`${BASE_URL}/menu/${itemId}/`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  // Order operations
  getOrders: async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/`, {
        headers: getHeaders(token),
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  createOrder: async (orderData, token) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({
          items_json: orderData.items,
          subtotal: orderData.subtotal,
          gst: orderData.gst,
          grand_total: orderData.grand_total,
        }),
      });
      if (!res.ok) throw new Error('Failed to place order');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  updateOrderStatus: async (orderId, status, token) => {
    try {
      console.log("PATCH Order:", orderId, status);

      const res = await fetch(`${BASE_URL}/orders/${orderId}/`, {
        method: "PATCH",
        headers: getHeaders(token),
        body: JSON.stringify({ status }),
      });

      console.log("HTTP Status:", res.status);

      const data = await res.json();
      console.log("Response:", data);

      return data;

    } catch (err) {
      console.error(err);
      return null;
    }
  },
  // Admin stats
  getAdminStats: async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats/`, {
        headers: getHeaders(token),
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (err) {
      return null;
    }
  }
};

export default apiService;

