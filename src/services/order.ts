import axios from 'axios';

interface IOrder {
  date: String;
  time: string;
  vehicle: string;
  driver: string;
  pick_up: string;
  drop_off:[string];
  consumer: string;
  remark: string;
}
interface IUpdateOrder {
  _id: string;
  date: String;
  time: string;
  vehicle: string;
  driver: string;
  pick_up: string;
  drop_off:[string];
  consumer: string;
  remark: string;
}
export const createOrder = async (body: IOrder) => {
  const res = await axios.post('/order/createOrder', body);
  console.log('res createOrder ', res);
  return res;
};

export const listOrder = async () => {
  const res = await axios.get('/order/listOrder');
  // console.log('res', res);
  return res;
};

export const getorder = async (orderId: any) => {
  const res = await axios.get('/toilet/getOrder', {params: {_id: orderId},});
  return res;
};

export const updateOrder = async (body: IUpdateOrder) => {
  const res = await axios.put('/order/updateOrder', body);
  console.log('res  updateOrder ', res);
  return res;
};

export const deleteOrder = async (orderId: any) => {
  const res = await axios.delete('/order/deleteOrder', {params: {_id: orderId}});
  return res;
};