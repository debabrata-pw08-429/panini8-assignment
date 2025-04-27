import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <Link to={`/post/${post._id}`}>
        <h3>{post.title}</h3>
        <p>{post.content.slice(0, 100)}...</p>
        <p>
          <small>{new Date(post.createdAt).toLocaleDateString()}</small>
        </p>
      </Link>
    </div>
  );
};

export default PostCard;
