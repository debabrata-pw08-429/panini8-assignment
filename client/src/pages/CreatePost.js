import { useState } from "react";
import { createPost } from "../services/postService";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(",").map((tag) => tag.trim());
    try {
      await createPost({ ...formData, tags: tagsArray });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Post Content"
          rows="8"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
