import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { fetchWithAuth } from "../services/AuthInterceptor";
import LoadingSpinner from "../components/LoadingSpinner";

const Post = (props) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/posts/${id}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP! (${response.status})`);
        }
        const data = await response.json();
        setPost(data);
        setFormData({
          title: data.title,
          content: data.content || "",
        });
      } catch (error) {
        setError("Impossible de charger l'article.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP! (${response.status})`);
      }
      const updatedPost = await response.json();
      setPost(updatedPost);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des modifications :", error);
      setError("Impossible de sauvegarder les modifications.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>{isEditing ? "Modifier l'Article" : "Détails de l'Article"}</h1>
      {post && (
        <div>
          {isEditing ? (
            <form onSubmit={handleSaveChanges}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Titre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label">
                  Contenu
                </label>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  rows="4"
                  value={formData.content}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Sauvegarder
              </button>
            </form>
          ) : (
            <div>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>
                <strong>Auteur:</strong> {post.owner?.name || "Inconnu"}
              </p>
              <button className="btn btn-warning" onClick={handleEditToggle}>
                Modifier
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
