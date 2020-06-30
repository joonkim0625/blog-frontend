import http from "../httpCommon";

const getAllFromMyPosts = (params) => {
  return http.get("/myposts", { params });
};

const getAll = (params) => {
  return http.get("/posts", { params });
};

const get = (id) => {
  return http.get(`/post/${id}`);
};

const create = (data) => {
  return http.post("/posts", data);
};

const update = (id, data) => {
  return http.put(`/post/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/post/${id}`);
};

const removeAll = () => {
  return http.delete(`/posts`);
};

const createComment = (data) => {
  return http.post("/comments", data);
};

const getAllComments = (postId) => {
  return http.get(`/postComments/${postId}`);
};

const createNestedComment = (commentId, data) => {
  return http.post(`/comment/${commentId}`, data);
};

const updateComment = (commentId, data) => {
  return http.put(`/comment/${commentId}`, data);
};

const deleteComment = (commentId) => {
  return http.delete(`/comment/${commentId}`);
};

const getComment = (commentId) => {
  return http.get(`/comment/${commentId}`, commentId);
};

const search = (text) => {
  return http.get(`/search?tsquery=${text}`);
};

export default {
  getAll,
  getAllFromMyPosts,
  get,
  create,
  update,
  remove,
  removeAll,
  createComment,
  getAllComments,
  createNestedComment,
  updateComment,
  deleteComment,
  getComment,
  search,
};
