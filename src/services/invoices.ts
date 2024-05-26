import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_APIBASEURL;

 interface IInvoice {
  invoiceId: string;
  customer: string;
  address: string;
  listorderId: string[];
  amount: number;
  invoicestatus: boolean;
}

interface IUpdateInvoice {
  _id: string;
  customer: string;
  address: string;
  listorderId: string[];
}

export const createInvoice = async (body: IInvoice) => {
  const res = await axios.post(`${API_BASE_URL}/invoice/createInvoice`, body);
  console.log('res createInvoice ', res);
  return res;
};

export const listInvoice = async () => {
  const res = await axios.get(`${API_BASE_URL}/invoice/listInvoice`);
  console.log('Fetched Invoices:', res.data);
  return res;
};

export const getInvoice = async (invoiceId: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/invoice/getInvoice/${invoiceId}`);
    console.log('Fetched Invoice:', res.data); // Log the response data
    return res.data; // Correctly return the data
  } catch (error) {
    console.error('Error fetching invoice:', error); // Log the error
    throw new Error('Failed to fetch invoice');
  }
};

export const updateInvoice = async (id: string, data: Partial<IInvoice>) => {
  return await axios.put(`${API_BASE_URL}/invoice/updateInvoice/${id}`, data); 
};

export const deleteInvoice = async (invoiceId: string) => {
  const res = await axios.delete(`${API_BASE_URL}/invoice/deleteInvoice/${invoiceId}`);
  return res;
};

export const getOrder = async (orderId: string) => {
  try {
    console.log(`Fetching Order with ID: ${orderId}`);
    const res = await axios.get(`${API_BASE_URL}/order/getOrder/${orderId}`);
    console.log('Response:', res); // Log the entire response
    console.log('Response status:', res.status);
    console.log('Response data:', res.data);
    console.log('Fetched Order:', res.data); // Log the response data
    return res.data; // Correctly return the data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching order with ID ${orderId}:`, error.response?.data || error.message); // Log the error
    } else {
      console.error(`Error fetching order with ID ${orderId}:`, error);
    }
    return null; // Return null if there is an error
  }
};
