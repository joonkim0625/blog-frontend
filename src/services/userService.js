import http from "../httpCommon";
import authHeader from "./authHeader";

const getPublicContent = () => {
  return http.get("/test/all");
};

const getUserBoard = () => {
  return http.get("/test/user", {
    headers: authHeader(),
  });
};

const getModeratorBoard = () => {
  return http.get("/test/mod", {
    headers: authHeader(),
  });
};

const getAdminBoard = () => {
  return http.get("/test/admin", {
    headers: authHeader(),
  });
};

export default {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};
