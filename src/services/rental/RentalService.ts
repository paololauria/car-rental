import { RentalDto } from "../../model/rental/RentalDto";
import axios from "axios";

const API_URL = 'http://localhost:3001';

export const getRentalById = async (id: number): Promise<RentalDto> => {
  try {
    const response = await axios.get(`${API_URL}/rentals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rental:', error);
    throw new Error('Error fetching rental');
  }
}

export const getAllRentals = async (): Promise<RentalDto[]> => {
  try {
    const response = await axios.get(`${API_URL}/rentals`);
    return response.data;
  } catch (error) {
    console.error('Errore recupero Noleggi:', error);
    return [];
  }
};

export const addRental = async (newRental: RentalDto): Promise<RentalDto> => {
  try {
    const response = await axios.post(`${API_URL}/rentals`, newRental);
    return response.data;
  } catch (error) {
    console.error('Error adding car:', error);
    throw new Error('Error adding car');
  }
};

export const editRental = async (updatedRental: RentalDto): Promise<RentalDto> => {
  try {
    const response = await axios.put(`${API_URL}/rentals/${updatedRental.id}`, updatedRental);
    return response.data;
  } catch (error) {
    console.error('Error editing car:', error);
    throw new Error('Error editing car');
  }
};

export const deleteRental = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/rentals/${id}`);
  } catch (error) {
    console.error('Error deleting car:', error);
    throw new Error('Error deleting car');
  }
};


