import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/profile") // Remplacez par l'URL correcte
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement du profil :", error)
      );
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Profil</h1>
      <p>
        <strong>Nom : </strong>
        {profile.name}
      </p>
      <p>
        <strong>Email : </strong>
        {profile.email}
      </p>
    </div>
  );
};

export default Profile;
