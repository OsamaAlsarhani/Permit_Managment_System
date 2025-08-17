// src/Service/authService.js
import api, { setBasicAuthHeader, clearAuthHeader } from './axiosInstance';

// When you call getUser, set the auth header on axios instance so subsequent calls use it automatically
export const getUser = async (username, password) => {
  setBasicAuthHeader(username, password);  // sets header globally
  const token = btoa(`${username}:${password}`);
  setAuthToken(token);
  try {
    const response = await api.get('/auth/get-user', {
      params: { username },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const register = async (username, password) => {
  try {
    const response = await api.post('/auth/register', {
      username,
      password,
      role: 'ROLE_USER',
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Basic ${token}`;
    localStorage.setItem('authToken', token); // Store token
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken'); // Remove token
  }
};
export const permitUserAll = () => {
  return api.get('/user/permit/get-all-permit', {
    headers: {
      'Cache-Control': 'no-store',
      'Authorization': `Basic ${localStorage.getItem('authToken')}`
    },
    signal: new AbortController().signal,
  }).then(res => res.data);
};

export const createPermit = async (permit, filesURL) => {
  const query = filesURL.map(url => `filesURL=${encodeURIComponent(url)}`).join("&");
  return await api.post(`/user/permit/create-permit?${query}`, permit, {
    headers: {
      Authorization: `Basic ${localStorage.getItem("authToken")}`,
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("files", file);

  try {
    const response = await api.post(`/user/permit/upload-files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Basic ${localStorage.getItem('authToken')}`,
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Uploading ${file.name}: ${percent}%`);
        // You can update UI progress here if needed
      }
    });
    return response.data; // Returns the file URL
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

export const generateFileURL = async (objectName) => {
  const encoded = encodeURIComponent(objectName);
  const response = await api.get(`/auth/generate-file-URL?objectName=${encoded}`, {
    headers: {
      'Authorization': `Basic ${localStorage.getItem('authToken')}`,
    },
  });
  return response.data;
};




export const downloadFile = async (objectName) => {
  const response = await api.get(
    `/api/auth/download?objectName=${encodeURIComponent(objectName)}`,
    {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authToken")}`,
      },
      responseType: "blob", 
    }
  );
  return response.data;
};



export const updatePermit = async (permitId, formData) => {
  try {
    const response = await api.put(`/user/permit/update-permit/${permitId}`, formData, {
      headers: {
        'Cache-Control': 'no-store',
        'Authorization': `Basic ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating permit:', error);
    throw error;
  }
};

export const deletePermit = async (permitId) => {
  try {
    const response = await api.delete(`/user/permit/delete-permit?id=${permitId}`, {
      headers: {
        'Cache-Control': 'no-store',
        'Authorization': `Basic ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting permit:', error);
    throw error;
  }     
};
export const reportSummary = async () => {
  try {
    const response = await api.get('/admin/permit/summary-report', {
      headers: {
        'Cache-Control': 'no-store',
        'Authorization': `Basic ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching report summary:', error);
    throw error;
  }
};
export const getPermitForAllUsers = async () => {
  try {
    const response = await api.get('/admin/permit/get-all-permit', {
      headers: {
        'Cache-Control': 'no-store',
        'Authorization': `Basic ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching permits for all users:', error);
    throw error;
  }
};
export const updateStatus = async (permitId, formData) => {
  try {
    const response = await api.put(`/admin/permit/update-status/${permitId}`, formData, {
      headers: {
        'Cache-Control': 'no-store',
          'Authorization': `Basic ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating permit status:', error);
      throw error;
    }
  };  
  export const deletePermitAsAdmin = async (permitId) => {
    try {
      const response = await api.delete(`/admin/permit/delete-permit?id=${permitId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Authorization': `Basic ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting permit:', error);
      throw error;
    }
  };
 
 