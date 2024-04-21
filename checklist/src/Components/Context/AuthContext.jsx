import { createContext, useReducer, useEffect } from "react";
import PropsTypes from "prop-types";
import { authReducer } from "./authReducer";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  AuthContextProvider.propTypes = {
    children: PropsTypes.node.isRequired,
  };

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = localStorage.getItem("qc-users");

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  // console.log("AuthContext state: ", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
