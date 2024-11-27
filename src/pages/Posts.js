import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { Link } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (currentPage) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/posts?page=${currentPage}`);
      if (!response.ok) {
        throw new Error(`HTTP error! (${response.status})`);
      }
      const data = await response.json();

      if (!Array.isArray(data.data)) {
        throw new Error("La réponse de l'API n'a pas de tableau 'data'.");
      }

      setPosts(data.data);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
      setError(error.message || "Impossible de charger les articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  const renderPagination = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <nav>
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageClick(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
          </li>
          {pageNumbers.map((num) => (
            <li
              key={num}
              className={`page-item ${page === num ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageClick(num)}
              >
                {num}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageClick(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">
        Liste des Articles{" "}
        <Link to="/posts/create" className="btn btn-success m-2 float-end">
          Créer un nouvel article
        </Link>
      </h1>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Author</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <th scope="row">{post.id}</th>
              <td>{post.title}</td>
              <td>{post.owner?.name || "Inconnu"}</td>
              <td>
                <Link
                  to={`/posts/${post.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
};

export default Posts;
