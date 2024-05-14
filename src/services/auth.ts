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