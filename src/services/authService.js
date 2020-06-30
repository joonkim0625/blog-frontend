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
        //localStorage.setItem("user", JSON.stringify(res.data));
      }
      return res.data;
    });
};

//const logout = () => {
//localStorage.removeItem("user");
//};

//const getCurrentUser = () => {
//return JSON.parse(localStorage.getItem("user"));
//};

export default {
  register,
  login,
  //logout,
  //getCurrentUser,
};
