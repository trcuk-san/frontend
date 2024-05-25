import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_APIBASEURL;

export const setAuthorization = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export interface IOrder {
  datePickUp: string;
  timePickUp: string;
  dateDropOff: string;
  timeDropOff: string;
  vehicle: string;
  driver: string;
  pick_up: string;
  drop_off: string[]; // Array of strings for drop off locations
  consumer: string;
  income: number;
  oilFee: number;
  tollwayFee: number;
  otherFee: number;
  orderStatus: string;
  invoiced: boolean;
  remark: string;
}


export const createOrder = async (body: IOrder) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/order/createOrder`, body);
    console.log('res createOrder', res);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating order:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const listOrder = async () => {
  const res = await axios.get(`${API_BASE_URL}/order/listOrder`);
  console.log('res', res);
  return res;
};

export const getOrder = async (orderId: string) => {
  const res = await axios.get(`${API_BASE_URL}/order/getOrder`, { params: { _id: orderId } });
  return res;
};

export const updateOrder = async (body: IOrder) => {
  const res = await axios.put(`${API_BASE_URL}/order/updateOrder`, body);
  console.log('res updateOrder ', res);
  return res;
};

export const updateOrderInvoices = async (orderId: string, updateData: Partial<IOrder>) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await axios.put(`${API_BASE_URL}/order/updateOrder/${orderId}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteOrder = async (orderId: string) => {
  const res = await axios.delete(`${API_BASE_URL}/order/deleteOrder`, { params: { _id: orderId } });
  return res;
};

export const fetchFinishedOrders = async (year: string, month: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/order/listFinishedOrders`, {
      params: {
        year,
        month
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching finished orders:', error);
    throw error;
  }
};
