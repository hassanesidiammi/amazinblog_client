import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { fetchWithAuth } from "../services/AuthInterceptor";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // Correction du nom de l'état
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Le titre et le contenu sont obligatoires");
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la création du post : ${response.status}`
        );
      }

      // Récupérer la réponse et extraire l'ID du post créé
      const post = await response.json();
      const postId = post.id;

      // Rediriger vers la page du post créé
      navigate(`/posts/${postId}`);
    } catch (error) {
      setError("Impossible de créer le post.");
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Créer un nouveau post</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Titre
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Créer le post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
