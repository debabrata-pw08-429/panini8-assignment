import { likePost, addComment, getSinglePost } from "../services/postService";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { updatePost, deletePost } from "../services/postService";
import { useNavigate } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const fetchPost = useCallback(async () => {
    try {
      const data = await getSinglePost(id);
      console.log("data => ", data);
      setPost(data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [id, fetchPost]);

  // Fetch post and check if the user is the owner
  const isOwner = user && post?.author?._id === user?._id;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id);
      navigate("/"); // Go back to home after delete
    } catch (err) {
      setError("Failed to delete post");
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  };

  const handleSaveEdit = async () => {
    try {
      await updatePost(id, { title: editedTitle, content: editedContent });
      setEditMode(false);
      fetchPost(); // Refresh post
    } catch (err) {
      setError("Failed to update post");
    }
  };

  const handleLike = async () => {
    try {
      await likePost(id);
      fetchPost(); // Refresh post
    } catch (err) {
      setError("Failed to like/unlike post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await addComment(id, comment);
      setComment("");
      fetchPost(); // Refresh comments
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-details-container">
      {editMode ? (
        <>
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            required
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="5"
            required
          />
          <button onClick={handleSaveEdit}>Save Changes</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <div className="post-tags">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <button onClick={handleLike}>
            ❤️ {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
          </button>
        </>
      )}

      {/* Show Edit/Delete only if user is the owner */}
      {isOwner && !editMode && (
        <div className="post-actions">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} style={{ color: "red" }}>
            Delete
          </button>
        </div>
      )}

      <div className="comment-section">
        <h3>Comments</h3>
        {post.comments.length > 0 ? (
          post.comments.map((c, idx) => (
            <div key={idx} className="comment">
              <p>{c.text}</p>
              <small>{new Date(c.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>

      {user && (
        <form onSubmit={handleComment} className="comment-form">
          <textarea
            rows="3"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          <button type="submit">Add Comment</button>
        </form>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PostDetails;
