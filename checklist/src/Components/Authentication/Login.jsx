import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../Hooks/useAuthContext";

//import react hook form for handling the form
import { useForm } from "react-hook-form";

//axios to post form data
import axios from "axios";

import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import ButtonLoad from "../Animations/ButtonLoad";
import { FaArrowRight } from "react-icons/fa6";

const serVer = `https://checklist-app-backend.vercel.app`;

const Login = () => {
  // react form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  const [send, setSend] = useState(<FaArrowRight />);
  // State to store and display result data
  const [resultMessage, setResultMessage] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const onSubmit = async (data) => {
    const url = `${serVer}/login`;

    try {
      // Reset error messages
      setResultMessage("");

      setIsLoading(true);
      setSend(<ButtonLoad />);

      const { email, password } = data;

      await axios
        .post(url, {
          email,
          password,
        })
        .then((result) => {
          if (result.status === 200) {
            // save the user to local storage
            localStorage.setItem("qc-users", result.data);

            //update the auth Context
            dispatch({ type: "LOGIN", payload: result });
          } else {
            // Handle other scenarios or display the actual error message received from the server
            setResultMessage("invalid server response, please try again");

            // Hide the message after 2 seconds
            setTimeout(() => {
              setResultMessage("");
            }, 3000);
          }
        })
        .catch((error) => {
          setResultMessage(error.response.data);

          setTimeout(() => {
            setResultMessage("");
          }, 3000);
        });
    } catch (error) {
      setResultMessage("cant connect to server, try again later");

      // Hide the message after 2 seconds
      setTimeout(() => {
        setResultMessage("");
      }, 5000);
    } finally {
      setIsLoading(false);
      setSend(<FaArrowRight />);
    }
  };

  const onError = () => {
    setResultMessage("Failed to submit, check inputs and try again");

    // Hide the message after 2 seconds
    setTimeout(() => {
      setResultMessage("");
    }, 2000);
  };

  //password
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="authentication">
      <div className="spacer layer1"></div>
      <div className="authentication-container">
        <div>
          <h2>Hello</h2>
          <h3>Log in to your account</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div className="inputBox">
            <input
              placeholder="Email"
              required
              type="email"
              id="email"
              {...register("email", { required: "Email is required" })}
            />
            <p>{errors.email?.message}</p>
          </div>
          {/* Password input */}
          <div className="inputBox">
            <input
              placeholder="Password"
              required
              type={passwordVisible ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {/* Toggle password visibility button */}
            <div
              className="toggle"
              type="button"
              onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaRegEyeSlash /> : <FaEye />}
            </div>
            <p>{errors.password?.message}</p>
          </div>
          <div>
            <button type="submit" disabled={isSubmitting || isLoading}>
              <div>Log in</div>
              {send}
            </button>
          </div>
        </form>
        <p className="result">{resultMessage}</p>
        <div className="sign-log">
          <p>New Here?</p>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
      <div className="spacer2 layer2"></div>
    </div>
  );
};

export default Login;
