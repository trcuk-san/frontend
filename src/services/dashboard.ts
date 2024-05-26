import axios from 'axios';
import { IOrder, IInvoice, IVehicle, IMember, IReceipt } from './types';

const API_BASE_URL = process.env.REACT_APP_APIBASEURL;

export const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const [receipts, orders, invoices, vehicles, users] = await Promise.all([
      axios.get<IReceipt[]>(`${API_BASE_URL}/receipt/listReceipts`),
      axios.get<IOrder[]>(`${API_BASE_URL}/order/listOrder`),
      axios.get<IInvoice[]>(`${API_BASE_URL}/invoice/listInvoice`),
      axios.get<IVehicle[]>(`${API_BASE_URL}/vehicle/listVehicle`),
      axios.get<IMember[]>(`${API_BASE_URL}/auth/users`)
    ]);

    return {
      receipts: receipts.data,
      orders: orders.data,
      invoices: invoices.data,
      vehicles: vehicles.data,
      users: users.data,
    };
  } catch (error) {
    console.error('Error fetching dashboard data', error);
    throw error;
  }
};
