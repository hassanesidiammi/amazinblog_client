import { API_BASE_URL } from "../config";

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: email, password }),
  });

  if (!response.ok) {
    throw new Error("Échec de la connexion");
  }

  const data = await response.json();
  localStorage.setItem("jwt", data.token);
  return data;
};

export const logout = () => {
  localStorage.removeItem("jwt");
};

export const getToken = () => {
  return localStorage.getItem("jwt");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("jwt");
};
