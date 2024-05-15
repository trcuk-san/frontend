// import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
interface IRegister {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  conPassword: string;
}

interface ILogin {
  email: string;
  password: string;
}

export const register = async (body: IRegister) => {
  const res = await axios.post('/auth/register', body);
  console.log('res register ', res);
  return res;
};

export const login = async (body: ILogin) => {
  const res = await axios.post('/auth/login', body);
  console.log('res login ', res);
  return res;
};
// export const getToken = async () => {
//   const token = await AsyncStorage.getItem('token');
//   return token;
//   // return token.length > 0 ? String(token) : '';
// };

export const getProfile = async () => {
  return await axios.get('/auth/me');
};

// export const test = async () => {
//   const res = await axios.get('/auth/test');
//   return res;
// };

export const test = async () => {
  try {
    const response = await axios.get('http://localhost:4000/auth/test'); // Update with your actual API endpoint
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};