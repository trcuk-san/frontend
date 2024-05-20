import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';
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
  const res = await axios.post('/vehicle/createVehicle', body);
  console.log('res createVehicle ', res);
  return res;
};

// export const listVehicle = async () => {
//   try {
//     const res = await axios.get('/vehicle/listVehicle');
//     console.log('res listVehicle', res.data);
//     return res.data.data;  // Ensure returning the actual data
//   } catch (error: any) {  // Explicitly type error as any
//     console.error('Error fetching vehicles:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

export const listVehicle = async () => {
  const res = await axios.get('/vehicle/listVehicle');
  // console.log('res', res);
  return res;
};

// export const listVehicle = async () => {
//   try {
//     const res = await axios.get('/vehicle/listVehicle');
//     console.log('res listVehicle', res.data);
//     return res.data.data;  // Ensure returning the actual data
//   } catch (error: any) {  // Explicitly type error as any
//     console.error('Error fetching vehicles:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

export const getVehicle = async (id: string) => {
  const response = await axios.get(`/vehicle/getVehicle`, {
    params: { _id: id },
  });
  return response.data;
};

export const getVehicleOrders = async (id: string) => {
  const response = await axios.get(`/vehicle/getVehicleOrders/${id}`);
  return response.data;
};

export const updateVehicle = async (body: IUpdatevehicle) => {
  const res = await axios.put('/vehicle/updateVehicle', body);
  console.log('res  updateVehicle ', res);
  return res;
};

export const deleteVehicle = async (vehicleId: any) => {
  const res = await axios.delete('/vehicle/deleteVehicle', {params: {_id: vehicleId}});
  return res;
};