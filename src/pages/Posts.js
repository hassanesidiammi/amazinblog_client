import React, { useEffect, useState } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts([
      { id: 1, title: "Article 1", owner: "me" },
      { id: 2, title: "Article 2", owner: "me" },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Liste des Articles</h1>
      <ul className="list-group">
        {posts.map((post) => (
          <li key={post.id} className="list-group-item">
            {post.id}
            {post.title}
            {post.owner}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
