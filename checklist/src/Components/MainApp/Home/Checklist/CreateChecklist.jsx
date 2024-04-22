import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ButtonLoad from "../../../Animations/ButtonLoad";
import axios from "axios";
import HeaderGoBack from "../../../Custom/HeaderGoBack";

const serVer = `https://checklist-app-backend.vercel.app`;

const token = localStorage.getItem("qc-users");

const CreateChecklist = () => {
  const [resultMessage, setResultMessage] = useState("");
  const [createBtn, setCreateBtn] = useState("Create");

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
      setCreateBtn("Create");
    }
  };

  const onError = () => {
    setResultMessage("Failed to submit, check inputs and try again");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setResultMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [resultMessage]);

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
              required: "Description is required",
            })}
          />
          <p>{errors.description?.message}</p>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {createBtn}
        </button>
      </form>
      <p className={`error-display ${resultMessage ? "show" : ""}`}>
        {resultMessage}
      </p>
    </div>
  );
};

export default CreateChecklist;
