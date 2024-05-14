import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { CarDto } from '../../model/car/CarDto';

const API_URL = "http://localhost:3001";

export const useCarById = (id: number) => {
  return useQuery<CarDto | null>(['car', id], async () => {
    const response = await axios.get(`${API_URL}/cars/${id}`);
    return response.data;
  });
};

export const useAllCars = () => {
  return useQuery<CarDto[]>('cars', async () => {
    const response = await axios.get(`${API_URL}/cars`);
    return response.data;
  });
};

export const useAddCar = () => {
  return useMutation((newCar: CarDto) => axios.post(`${API_URL}/cars`, newCar));
};

export const useEditCar = () => {
  return useMutation((updatedCar: CarDto) => {
    const { id, ...data } = updatedCar;
    return axios.put(`${API_URL}/cars/${id}`, data);
  });
};

export const useDeleteCar = () => {
  return useMutation((id: number) => axios.delete(`${API_URL}/cars/${id}`));
};
