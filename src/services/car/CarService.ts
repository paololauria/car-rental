import { CarDto } from "../../model/car/CarDto";
import axios from "axios";

const API_URL = 'http://localhost:3001';

export const getCarById = async (id: number): Promise<CarDto | null> => {
  try {
    const response = await axios.get(`${API_URL}/cars/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching car:', error);
    return null;
  }
}

export const getAllCars = async (): Promise<CarDto[]> => {
  try {
    const response = await axios.get(`${API_URL}/cars`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
};

export const addCar = async (newCar: CarDto): Promise<CarDto> => {
  try {
    const response = await axios.post(`${API_URL}/cars`, newCar);
    return response.data;
  } catch (error) {
    console.error('Error adding car:', error);
    throw new Error('Error adding car');
  }
};

export const editCar = async (updatedCar: CarDto): Promise<CarDto> => {
  try {
    const response = await axios.put(`${API_URL}/cars/${updatedCar.id}`, updatedCar);
    return response.data;
  } catch (error) {
    console.error('Error editing car:', error);
    throw new Error('Error editing car');
  }
};

export const deleteCar = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/cars/${id}`);
  } catch (error) {
    console.error('Error deleting car:', error);
    throw new Error('Error deleting car');
  }
};
