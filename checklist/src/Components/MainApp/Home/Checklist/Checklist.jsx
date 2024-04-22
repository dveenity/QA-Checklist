import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useState } from "react";
import PageLoader from "../../../Animations/PageLoader";
import { fetchUser } from "../../../Hooks/useFetch";
import { IoIosArrowDown, IoIosArrowUp, IoIosCreate } from "react-icons/io";
import { FaReadme } from "react-icons/fa6";

//import react hook form for handling the form
import { useForm } from "react-hook-form";

//axios to post form data
import axios from "axios";
import ButtonLoad from "../../../Animations/ButtonLoad";
import HeaderGoBack from "../../../Custom/HeaderGoBack";

const serVer = `http://localhost:7722`;

const Checklist = () => {
  // navigation
  const navigate = useNavigate();

  // store data in states
  const [description, setDescription] = useState(null);
  const [checklistDetails, setChecklistDetails] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expandedForm, setExpandedForm] = useState(null);
  const [deleteButton, setDeleteButton] = useState("Delete Entry");
  const [deleteChecklistButton, setDeleteChecklistButton] =
    useState("Delete Checklist");
  const [updateChecklistButton, setUpdateChecklistButton] = useState("Submit");
  const [checklistEntryMessage, setChecklistEntryMessage] = useState(null);
  const [checklistItemId, setChecklistItemId] = useState(null);
  const [send, setSend] = useState("Submit");
  // State to store and display result data
  const [resultMessage, setResultMessage] = useState("");

  // react form
  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting } = formState;

  // get clicked checklist id from params and fetch from db
  const { checklistId } = useParams();

  // fetch checklist with react query hook
  const {
    data: checklist,
    isLoading,
    isError,
    refetch,
  } = useQuery("checklist", () => FetchChecklist(checklistId));

  // fetch user with react query hook
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery("user", fetchUser);

  // get role from data
  const { role, name } = userData;

  if (isError || userError) {
    <div>Failed to fetch data</div>;
  }
  if (isLoading || userLoading) return <PageLoader />;

  // map checklist sub items into list dom
  const checklistItems = checklist.checklistItems;

  const checklistItemsOutput = checklistItems.map((checklistItem) => {
    // Function to toggle checklist Information for mobile users
    const toggleChecklistInfo = (checklistItem) => {
      // If the clicked checklist item is already expanded, collapse it
      if (expandedIndex === checklistItem) {
        setExpandedIndex(null);
      } else {
        // If a different checklist item is clicked, expand it
        setExpandedIndex(checklistItem);
      }
    };

    // Function for admin to delete checklist entry item
    const deleteChecklistEntry = async (checklistItemId) => {
      try {
        setDeleteButton(<ButtonLoad />);
        await axios.delete(
          `${serVer}/deleteChecklistItem/${checklistItemId}`, // Update endpoint
          { data: { checklistId } } // Send checklistItemId in the request body
        );

        // Reload page
        await refetch();
      } catch (error) {
        console.log(error);
      } finally {
        setDeleteButton("Delete Checklist");
      }
    };

    // function for toggle update form
    const toggleUpdateForm = (checklistItemId) => {
      // If the clicked checklist item is already expanded, collapse it
      if (expandedForm === checklistItemId) {
        setExpandedForm(null);
      } else {
        // If a different checklist item is clicked, expand it
        setExpandedForm(checklistItemId);
      }
    };

    // function to update checklist entry
    const updateChecklistEntry = async (data) => {
      const { taskName, status, stage1, stage2, stage3, qualityScore } = data;
      try {
        setUpdateChecklistButton(<ButtonLoad />);

        const response = await axios.post(
          `${serVer}/updateEntry/${checklistId}/${checklistItemId}`,
          {
            taskName,
            status,
            stage1,
            stage2,
            stage3,
            qualityScore,
          }
        );

        // reload to update
        await refetch();

        // rest entries
        reset();

        // close opened form
        setExpandedForm(null);

        console.log(response);
      } catch (error) {
        console.error(error);
      } finally {
        setUpdateChecklistButton("Submit");
      }
    };

    // on error
    // handle form error
    const onError = () => {
      setChecklistEntryMessage("Failed to submit, check inputs and try again");

      // Hide the message after 2 seconds
      setTimeout(() => {
        setChecklistEntryMessage("");
      }, 2000);
    };

    // convert date
    let date = new Date(checklistItem.date).toLocaleDateString();

    return (
      <ul key={checklistItem._id} className="checklist-entry-output">
        <div>
          <li>{date}</li>
          <li>{checklistItem.taskName}</li>
          <li>{checklistItem.performedBy}</li>
          <li>{checklistItem.status}</li>
          <button
            onClick={() => {
              toggleChecklistInfo(checklistItem._id);
              setChecklistItemId(checklistItem._id);
            }}>
            {expandedIndex === checklistItem._id ? (
              <IoIosArrowUp /> // If expanded, show arrow up icon
            ) : (
              <IoIosArrowDown /> // Otherwise, show arrow down icon
            )}
          </button>
        </div>
        {/* DISPLAY CHECKLIST INFO ON BUTTON CLICK */}
        {expandedIndex === checklistItem._id && (
          <div className="checklist-sub-more">
            <ul>
              <li>
                <span>Stage 1:</span>
                <span>{checklistItem.stage1}</span>
              </li>
              <li>
                <span>Stage 2:</span>
                <span>{checklistItem.stage2}</span>
              </li>
              <li>
                <span>Stage 3:</span>
                <span>{checklistItem.stage3}</span>
              </li>
              <li>
                <span>Quality Score:</span>
                <span>{checklistItem.score}</span>
              </li>
            </ul>
            <div>
              {role === "admin" && (
                <button onClick={() => deleteChecklistEntry(checklistItem._id)}>
                  {deleteButton}
                </button>
              )}
              {name === checklistItem.performedBy && (
                <button onClick={() => toggleUpdateForm(checklistItem._id)}>
                  Update Checklist
                </button>
              )}
            </div>
            {/* FORM TO UPDATE CHECKLIST ENTRY */}
            {expandedForm === checklistItem._id && (
              <div className="overlay entryBox">
                <form
                  onSubmit={handleSubmit(updateChecklistEntry, onError)}
                  noValidate>
                  <div className="inputBox">
                    <input
                      placeholder="Task Name"
                      required
                      type="text"
                      id="name"
                      {...register("taskName", {
                        required: "Task is required",
                      })}
                    />
                    <p>{errors.task?.message}</p>
                  </div>
                  <div className="inputBox">
                    <select
                      id="status"
                      {...register("status", {
                        required: "Status is required",
                      })}>
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="in progress">In Progress</option>
                    </select>
                    <p>{errors.status?.message}</p>
                  </div>
                  <div className="inputBox">
                    <select
                      id="stage1"
                      {...register("stage1", {
                        required: "Stage 1 is required",
                      })}>
                      <option value="">Select Stage 1</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                    </select>
                    <p>{errors.stage1?.message}</p>
                  </div>
                  <div className="inputBox">
                    <select
                      id="stage2"
                      {...register("stage2", {
                        required: "Stage 2 is required",
                      })}>
                      <option value="">Select Stage 2</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                    </select>
                    <p>{errors.stage2?.message}</p>
                  </div>
                  <div className="inputBox">
                    <select
                      id="stage3"
                      {...register("stage3", {
                        required: "Stage 3 is required",
                      })}>
                      <option value="">Select Stage 3</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                    </select>
                    <p>{errors.stage3?.message}</p>
                  </div>
                  <div className="inputBox">
                    <select
                      id="qualityScore"
                      {...register("qualityScore", {
                        required: "Quality Score is required",
                      })}>
                      <option value="">Select Quality Score</option>
                      <option value="10%">10%</option>
                      <option value="20%">20%</option>
                      <option value="30%">30%</option>
                      <option value="40%">40%</option>
                      <option value="50%">50%</option>
                      <option value="60%">60%</option>
                      <option value="70%">70%</option>
                      <option value="80%">80%</option>
                      <option value="90%">90%</option>
                      <option value="100%">100%</option>
                    </select>
                    <p>{errors.qualityScore?.message}</p>
                  </div>
                  <div>
                    <button type="submit" disabled={isSubmitting || isLoading}>
                      {updateChecklistButton}
                    </button>
                    <button onClick={toggleUpdateForm}>Close</button>
                  </div>
                </form>
                <p className="results-display">{checklistEntryMessage}</p>
              </div>
            )}
          </div>
        )}
      </ul>
    );
  });

  // function to toggle description
  const toggleDescription = () => {
    setDescription((prevView) => !prevView);
  };

  // function to toggle checklist fill
  const toggleChecklistDetails = () => {
    setChecklistDetails((prevView) => !prevView);
  };

  // function to add user new checklist
  const onSubmit = async (data) => {
    const { taskName, status, stage1, stage2, stage3, qualityScore } = data;
    const token = localStorage.getItem("qc-users");

    try {
      setSend(<ButtonLoad />);
      const response = await axios.post(
        `${serVer}/checklistFormUpdate`,
        { taskName, status, stage1, stage2, stage3, qualityScore, checklistId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // clear the form
      reset();

      // reload the page
      await refetch();

      // close the form
      setChecklistDetails(null);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setSend("Submit");
    }
  };

  // handle form error
  const onError = () => {
    setResultMessage("Failed to submit, check inputs and try again");

    // Hide the message after 2 seconds
    setTimeout(() => {
      setResultMessage("");
    }, 2000);
  };

  // Function to delete checklist
  const deleteChecklist = async () => {
    try {
      setDeleteChecklistButton(<ButtonLoad />);
      await axios.delete(
        `${serVer}/deleteChecklist/${checklistId}` // Send checklistItemId in the request body
      );

      // go back after successful delete
      navigate(-1);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteChecklistButton("Delete Checklist");
    }
  };

  return (
    <div className="checklist">
      <HeaderGoBack h1={checklist.checklistName} />
      <div>
        <h2>
          <IoIosCreate />
          <div>{checklist.author}</div>
        </h2>
        <button onClick={toggleDescription}>
          <FaReadme />
        </button>
      </div>
      {description && (
        <div className="overlay description">
          <h3>Project Description</h3>
          <p>{checklist.description}</p>
        </div>
      )}
      <div className="checklist-display">
        <ul>
          <li>Date</li>
          <li>Task</li>
          <li>Performed By</li>
          <li>Status</li>
        </ul>
        {checklistItemsOutput}
      </div>
      <div className="action-center">
        <button onClick={toggleChecklistDetails}>New Entry</button>
        {role === "admin" && (
          <button onClick={deleteChecklist}>{deleteChecklistButton}</button>
        )}
      </div>
      {/* FORM TO ENTER CHECKLIST DATA */}
      {checklistDetails && (
        <div className="overlay entryBox">
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <div className="inputBox">
              <input
                placeholder="Task"
                required
                type="text"
                id="name"
                {...register("taskName", { required: "Task is required" })}
              />
              <p>{errors.task?.message}</p>
            </div>
            <div className="inputBox">
              <select
                id="status"
                {...register("status", { required: "Status is required" })}>
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
              </select>
              <p>{errors.status?.message}</p>
            </div>
            <div className="inputBox">
              <select
                id="stage1"
                {...register("stage1", { required: "Stage 1 is required" })}>
                <option value="">Select Stage 1</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
              <p>{errors.stage1?.message}</p>
            </div>
            <div className="inputBox">
              <select
                id="stage2"
                {...register("stage2", { required: "Stage 2 is required" })}>
                <option value="">Select Stage 2</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
              <p>{errors.stage2?.message}</p>
            </div>
            <div className="inputBox">
              <select
                id="stage3"
                {...register("stage3", { required: "Stage 3 is required" })}>
                <option value="">Select Stage 3</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
              <p>{errors.stage3?.message}</p>
            </div>
            <div className="inputBox">
              <select
                id="qualityScore"
                {...register("qualityScore", {
                  required: "Quality Score is required",
                })}>
                <option value="">Select Quality Score</option>
                <option value="10%">10%</option>
                <option value="20%">20%</option>
                <option value="30%">30%</option>
                <option value="40%">40%</option>
                <option value="50%">50%</option>
                <option value="60%">60%</option>
                <option value="70%">70%</option>
                <option value="80%">80%</option>
                <option value="90%">90%</option>
                <option value="100%">100%</option>
              </select>
              <p>{errors.qualityScore?.message}</p>
            </div>
            <div>
              <button type="submit" disabled={isSubmitting || isLoading}>
                {send}
              </button>
              <button onClick={toggleChecklistDetails}>Close</button>
            </div>
          </form>
          <p className="results-display">{resultMessage}</p>
        </div>
      )}
    </div>
  );
};

// fetch checklist hook
export const FetchChecklist = async (checklistId) => {
  const response = await fetch(`${serVer}/fetchChecklist/${checklistId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export default Checklist;
