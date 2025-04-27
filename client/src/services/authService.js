import axios from "axios";
import { BASE_URL } from "../config";

export const registerUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, userData);
  return response.data;
};
