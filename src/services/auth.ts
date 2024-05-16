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
