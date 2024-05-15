import axios from 'axios';

interface IOrder {
  date: String;
  time: string;
  vehicle: string;
  driver: string;
  pick_up: string;
  drop_off: [string];
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
  drop_off: [string];
  consumer: string;
  remark: string;
}

export const createOrder = async (body: IOrder) => {
  const res = await axios.post('http://localhost:4000/order/createOrder', body);
  console.log('res createOrder ', res);
  return res;
};

export const listOrder = async () => {
  const res = await axios.get('http://localhost:4000/order/listOrder');
  console.log('res', res);
  return res;
};

export const getOrder = async (orderId: string) => {
  const res = await axios.get('http://localhost:4000/order/getOrder', { params: { _id: orderId } });
  return res;
};

export const updateOrder = async (body: IUpdateOrder) => {
  const res = await axios.put('http://localhost:4000/order/updateOrder', body);
  console.log('res updateOrder ', res);
  return res;
};

export const deleteOrder = async (orderId: string) => {
  const res = await axios.delete('http://localhost:4000/order/deleteOrder', { params: { _id: orderId } });
  return res;
};
