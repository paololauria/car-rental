import axios from "axios";
import { UserDto } from "../../model/user/UserDto";

const API_URL = "http://localhost:3001/users";

export const getUserById = async (userId: number): Promise<UserDto> => {
  try {
    const response = await axios.get<UserDto>(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Errore recupero utente:", error);
    throw new Error("Errore recupero utente");
  }
}

export const getAllUsers = async (): Promise<UserDto[]> => {
  try {
    const response = await axios.get<UserDto[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Errore recupero utenti:", error);
    return [];
  }
};

export const addUser = async (newUser: UserDto): Promise<UserDto> => {
  try {
    const response = await axios.post<UserDto>(API_URL, newUser);
    return response.data;
  } catch (error) {
    console.error("Errore aggiunta utente: ", error);
    throw new Error("Errore aggiunta utente");
  }
};

export const editUser = async (
  userId: number,
  updatedUser: UserDto
): Promise<UserDto> => {
  try {
    const response = await axios.put<UserDto>(`${API_URL}/${userId}`, updatedUser);
    return response.data;
  } catch (error) {
    console.error("Errore modifica utente: ", error);
    throw new Error("Errore modifica utente");
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${userId}`);
  } catch (error) {
    console.error("Errore eliminazione utente: ", error);
    throw new Error("Errore eliminazione utente");
  }
};
