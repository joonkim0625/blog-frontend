import http from "../httpCommon";

const getAll = () => {
  return http.get("/myposts");
};

const getByPage = (page) => {
  return http.get(`/myposts/${page}`);
};

const get = (id) => {
  return http.get(`/mypost/${id}`);
};

const create = (data) => {
  return http.post("/myposts", data);
};

const update = (id, data) => {
  return http.put(`/mypost/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/mypost/${id}`);
};

const createMyPostComment = (data) => {
  return http.post("/mypostcomments", data);
};

const getAllComments = (postId) => {
  return http.get(`/mypostAllComments/${postId}`);
};

const createNestedComment = (commentId, data) => {
  return http.post(`/mypostcomment/${commentId}`, data);
};

const updateComment = (commentId, data) => {
  return http.put(`/mypostcomment/${commentId}`, data);
};

const deleteComment = (commentId) => {
  return http.delete(`/mypostcomment/${commentId}`);
};

const getComment = (commentId) => {
  return http.get(`/mypostcomment/${commentId}`, commentId);
};

export default {
  getAll,
  getByPage,
  get,
  create,
  update,
  remove,
  createMyPostComment,
  getAllComments,
  createNestedComment,
  updateComment,
  deleteComment,
  getComment,
};
