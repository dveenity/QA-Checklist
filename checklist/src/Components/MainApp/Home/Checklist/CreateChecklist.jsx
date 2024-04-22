// import react hook form for handling the form
import { useForm } from "react-hook-form";
import ButtonLoad from "../../../Animations/ButtonLoad";

// axios to post form data
import axios from "axios";
import { useState } from "react";
import HeaderGoBack from "../../../Custom/HeaderGoBack";

const serVer = `https://checklist-app-backend.vercel.app`;

const token = localStorage.getItem("qc-users");

const CreateChecklist = () => {
  const [resultMessage, setResultMessage] = useState("");
  const [createBtn, setCreateBtn] = useState("Create");

  // react form
  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data) => {
    setCreateBtn(<ButtonLoad />);
    const { checklistName, description } = data;

    try {
      const response = await axios.post(
        `${serVer}/createChecklist`,
        { checklistName, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      reset();

      setResultMessage(response.data);
    } catch (error) {
      setResultMessage(error.response.data);
    } finally {
      setTimeout(() => {
        setResultMessage("");
      }, 3000);

      setCreateBtn("Create");
    }
  };

  const onError = () => {
    setResultMessage("Failed to submit, check inputs and try again");

    // Hide the message after 2 seconds
    setTimeout(() => {
      setResultMessage("");
    }, 2000);
  };

  return (
    <div className="createChecklist">
      <HeaderGoBack h1="Create New Checklist" />
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div>
          <label htmlFor="name">Checklist Name</label>
          <input
            type="text"
            id="name"
            {...register("checklistName", { required: "Name is required" })}
          />
          <p>{errors.checklistName?.message}</p>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register("description", {
              required: "description is required",
            })}
          />
          <p>{errors.description?.message}</p>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {createBtn}
        </button>
      </form>
      <p className="error-display">{resultMessage}</p>
    </div>
  );
};

export default CreateChecklist;
