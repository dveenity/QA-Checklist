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
    loading: true, // added loading state
  });

  useEffect(() => {
    const user = localStorage.getItem("qc-users");

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    } else {
      dispatch({ type: "LOGOUT" }); // added this line
    }
  }, []);

  // console.log("AuthContext state: ", state);

  return (
    <AuthContext.Provider
      value={{ ...state, dispatch, isLoading: state.loading }}>
      {children}
    </AuthContext.Provider>
  );
};
