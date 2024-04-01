import axios from 'axios';

export const getTest = async () => {
  return await axios.get('/test//hello');
};