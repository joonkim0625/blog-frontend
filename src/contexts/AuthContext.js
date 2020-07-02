import React, { createContext, useReducer, useEffect } from "react";
import { authReducer } from "../reducers/authReducer";

export const AuthContext = createContext();
const initialState = {
  isAuthenticated: false,
  data: {},
};

const AuthContextProvider = (props) => {
  const [data, dispatch] = useReducer(authReducer, {}, () => {
    // this third parameter will let me be able to check  if there is already an user data stored
    // by lazy loading
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(data));
  }, [data]);

  return (
    <AuthContext.Provider value={{ data, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
