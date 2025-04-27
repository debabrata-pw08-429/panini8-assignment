import axios from "axios";
import { BASE_URL } from "../config";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

export const createPost = async (postData) => {
  const token = getToken();
  const response = await axios.post(`${BASE_URL}/posts`, postData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPosts = async () => {
  const response = await axios.get(`${BASE_URL}/posts`);
  return response.data;
};

export const getSinglePost = async (id) => {
  const response = await axios.get(`${BASE_URL}/posts/${id}`);
  console.log(response);
  return response.data;
};

export const updatePost = async (id, updatedData) => {
  const token = getToken();
  const response = await axios.put(`${BASE_URL}/posts/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletePost = async (id) => {
  const token = getToken();
  const response = await axios.delete(`${BASE_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const likePost = (postId) => axios.patch(`/posts/${postId}/like`);

export const addComment = (postId, text) =>
  axios.post(`/posts/${postId}/comment`, { text });
