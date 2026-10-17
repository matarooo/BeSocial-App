import axios from "axios";
import type { RegisterResponseType, UserDataType } from "./register.interface";

export async function userRegister(userData: UserDataType): Promise<string> {
  try {
    const { data } = await axios.post<RegisterResponseType>(
      `${import.meta.env.VITE_BASE_URL}/users/signup`,
      userData,
    );
    localStorage.setItem("token", data.data.token);
    return data.message;


  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message);
      
    }

    throw new Error("NetWork Error");
  }
}
