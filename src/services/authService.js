import http from "../httpCommon";

const register = (username, email, password) => {
  return http.post("/auth/signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return http
    .post("/auth/signin", {
      username,
      password,
    })
    .then((res) => {
      if (res.data.accessToken) {
      }
      return res.data;
    });
};

export default {
  register,
  login,
};
