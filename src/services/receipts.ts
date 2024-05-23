import axios from 'axios';

const API_URL = 'http://localhost:4000';


interface ICreateReceiptPayload {
  receiptId: string;
  customer: string;
  address: string;
  listinvoice: string[];
  amount: number;
}

export const createReceipt = async (payload: ICreateReceiptPayload) => {
  try {
    const response = await axios.post(`${API_URL}/receipt/createReceipt`, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating receipt:', error);
    throw error;
  }
};

export const listReceipt = async () => {
  return await axios.get('/receipt/listReceipt');
};

export const getReceipt = async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/receipt/getReceipt/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateReceipt = async (id: string, data: any) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/receipt/updateReceipt/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteReceipt = async (id: string) => {
  const res = await axios.delete(`${API_URL}/receipt/deleteReceipt/${id}`);
  return res;
};


export const getInvoice = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/invoice/getInvoice/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };
  