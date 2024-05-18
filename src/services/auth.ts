import axios from 'axios';

interface IRegister {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
}

interface ILogin {
  email: string;
  password: string;
}

interface IMember {
  _id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  profile_picture: string;
}

const API_BASE_URL = 'http://localhost:4000';

export const register = async (body: IRegister) => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, body);
  console.log('res register ', res);
  return res;
};

export const login = async (body: ILogin) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, body);
  console.log('res login ', res);
  return res;
};

export const setAuthorization = (token: string) => {
  console.log("Setting token:", token); // Debugging
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getProfile = async (userId: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/auth/profile/${userId}`);
    console.log("Profile response:", res); // Debugging
    return res.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error.response); // Debugging
    throw error;
  }
};

export const listUser = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/auth/users`);
    console.log('res listUser', res.data);
    return res.data.data;  // Ensure returning the actual data
  } catch (error: any) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error deleting user: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, data: Partial<IMember>) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error updating user: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
