import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_APIBASEURL;


export interface ICreateReceiptPayload {
  receiptId: string;
  customer: string;
  address: string;
  listinvoice: string[];
  amount: number;
}



export const createReceipt = async (payload: ICreateReceiptPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/receipt/createReceipt`, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating receipt:', error);
    throw error;
  }
};

export const listReceipt = async () => {
  return await axios.get(`${API_BASE_URL}/receipt/listReceipts`);
};

export const getReceipt = async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/receipt/getReceipt/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateReceipt = async (id: string, data: any) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_BASE_URL}/receipt/updateReceipt/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteReceipt = async (id: string) => {
  const res = await axios.delete(`${API_BASE_URL}/receipt/deleteReceipt/${id}`);
  return res;
};


export const getInvoice = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/invoice/getInvoice/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };
  
  export const fetchReceipts = async (year: string, month: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/receipt/listReceiptsByYearMonth?year=${year}&month=${month}`);
      console.log("Fetched Receipts Data:", response.data); // Add this line for debugging
      return response.data; // Adjusted to match the structure of the response
    } catch (error) {
      console.error("Error fetching receipts", error);
      throw error;
    }
  };