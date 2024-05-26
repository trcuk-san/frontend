import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_APIBASEURL;

interface Ivehicle {
  vehicleId: string;
  vehicleStatus: string;
  remarks: string;
}

interface IUpdatevehicle {
  _id: string;
  vehicleId: string;
  vehicleStatus: string;
  remarks: string;
}

export const createVehicle = async (body: Ivehicle) => {
  const res = await axios.post(`${API_BASE_URL}/vehicle/createVehicle`, body);
  console.log('res createVehicle ', res);
  return res;
};

export const listVehicle = async () => {
  const res = await axios.get(`${API_BASE_URL}/vehicle/listVehicle`);
  return res;
};

export const getVehicle = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/vehicle/getVehicle`, {
    params: { _id: id },
  });
  return response.data;
};

export const getVehicleOrders = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/vehicle/getVehicleOrders/${id}`);
  return response.data;
};

export const updateVehicle = async (body: IUpdatevehicle) => {
  const res = await axios.put(`${API_BASE_URL}/vehicle/updateVehicle`, body);
  console.log('res  updateVehicle ', res);
  return res;
};

export const deleteVehicle = async (vehicleId: any) => {
  const res = await axios.delete(`${API_BASE_URL}/vehicle/deleteVehicle`, { params: { _id: vehicleId } });
  return res;
};
