import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getPosts } from "../services/postService";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const data = await getPosts();
        const filteredPosts = data.posts.filter(
          (post) => post.author._id === user._id
        );
        setUserPosts(filteredPosts);
      } catch (err) {
        console.error("Failed to load user's posts", err);
      }
    };
    fetchUserPosts();
  }, [user]);

  return (
    <div className="profile-container">
      <h2>{user?.name}'s Profile</h2>
      <h3>Your Posts</h3>
      {userPosts.length ? (
        <div className="posts-grid">
          {userPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts created yet.</p>
      )}
    </div>
  );
};

export default Profile;
