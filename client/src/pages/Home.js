import { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      console.log(data);
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="home-container">
      <h2>Recent Posts</h2>
      <div className="posts-grid">
        {posts?.length ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
};

export default Home;
