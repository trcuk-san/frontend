import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';
interface Iinvoice {
  customer: string,
  address: string,
  listorderId: string[],
}

interface IUpdateinvoice {
  _id: string;
  customer: string,
  address: string,
  listorderId: string[],
}

export const createInvoice = async (body: Iinvoice) => {
  const res = await axios.post('/invoice/createInvoice', body);
  console.log('res createVehicle ', res);
  return res;
};

export const listInvoice = async () => {
  const res = await axios.get('/invoice/listInvoice');
  // console.log('res', res);
  return res;
};

export const getInvoice = async (vehicleId: any) => {
  const res = await axios.get('/invoice/getInvoice', {params: {_id: vehicleId},});
  return res;
};

export const updateInvoice = async (body: IUpdateinvoice) => {
  const res = await axios.put('/invoice/updateInvoice', body);
  console.log('res  updateVehicle ', res);
  return res;
};

export const deleteInvoice = async (vehicleId: any) => {
  const res = await axios.delete('/invoice/deleteInvoice', {params: {_id: vehicleId}});
  return res;
};
