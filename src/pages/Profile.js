import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fetchWithAuth } from "../services/AuthInterceptor";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);

  const availableRoles = [
    { key: "ROLE_USER", label: "Utilisateur" },
    { key: "ROLE_EDITOR", label: "Editeur" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/profile`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du profil.");
        }
        const data = await response.json();
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
        setRoles(data.roles || []);
        setLoading(false);
      } catch (error) {
        setError("Impossible de charger le profil.");
        console.error("Erreur:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleRoleChange = (role) => {
    setRoles((prevRoles) =>
      prevRoles.includes(role.key)
        ? prevRoles.filter((r) => r !== role.key)
        : [...prevRoles, role.key]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      setError("Le nom et l'email sont obligatoires");
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          roles: roles,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil.");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false); // Arrêter l'édition
    } catch (error) {
      setError("Impossible de modifier le profil.");
      console.error("Erreur:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-5">
      <h1>Profil</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {!isEditing ? (
        <>
          <p>
            <strong>Nom : </strong>
            {profile.name}
          </p>
          <p>
            <strong>Email : </strong>
            {profile.email}
          </p>
          <p>
            <strong>Rôles : </strong>
            {profile.roles.join(", ")}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nom
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rôles</label>
            {availableRoles.map((role) => (
              <div key={role.key} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`role-${role.key}`}
                  checked={roles.includes(role.key)}
                  onChange={() => handleRoleChange(role)}
                />
                <label
                  htmlFor={`role-${role.key}`}
                  className="form-check-label"
                >
                  {role.label}
                </label>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary">
            Sauvegarder
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
