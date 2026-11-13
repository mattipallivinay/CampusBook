
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await authApi.post("/login", {
    email,
    password,
  });

  const { token } = response.data;

  if (!token) {
    throw new Error("Login token was not received.");
  }

  localStorage.setItem("token", token);

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};
