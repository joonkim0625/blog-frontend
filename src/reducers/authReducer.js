export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        // action.<variableName> must be the same as in the dispatch object.
        // ex, { type: "LOGIN", payload: data } <-- this payload has to match the variable name that comes after action.<>
        data: action.payload,
      };

    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        data: {},
      };

    default:
      return state;
  }
};
