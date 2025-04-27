import Post from "../models/Post.js";

// Create a new Post
export const createPost = async (req, res) => {
  const { title, content, tags } = req.body;

  const post = new Post({
    title,
    content,
    tags,
    author: req.user._id,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
};

// Get all Posts (recent first)
export const getPosts = async (req, res) => {
  const tag = req.query.tag;

  let posts;
  if (tag) {
    posts = await Post.find({ tags: tag })
      .populate("author", "username")
      .sort({ createdAt: -1 });
  } else {
    posts = await Post.find({})
      .populate("author", "username")
      .sort({ createdAt: -1 });
  }

  res.json(posts);
};

// Get a single Post by ID
export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "username"
  );

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
};

// Update Post
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  const userId = req.userId;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized: Not your post" });

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;

    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized: Not your post" });

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a comment to Post
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.userId;

  if (!text)
    return res.status(400).json({ message: "Comment cannot be empty" });

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Like / Unlike a Post
export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((uid) => uid.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
