export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("jwt");

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`, // Ajouter le token JWT
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    throw new Error("Non autorisé : Veuillez vous reconnecter.");
  }

  return response;
};
