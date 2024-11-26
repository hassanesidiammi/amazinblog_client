import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfile({
      id: 1,
      name: "Hassane",
      email: "test@test.com",
      roles: ["ROLE_EDITOR"],
    });
    setLoading(false);
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
