import { useQuery } from "react-query";
import PageLoader from "../../../../Animations/PageLoader";
import { fetchUsers } from "../../../../Hooks/useFetch";
import { useState } from "react";
import axios from "axios";
import HeaderGoBack from "../../../../Custom/HeaderGoBack";
import ButtonLoad from "../../../../Animations/ButtonLoad";

const serVer = `http://localhost:7722`;

const Approved = () => {
  const [position, setPosition] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const [updatePositionButtonStates, setUpdatePositionButtonStates] = useState(
    {}
  );
  const [deleteButtonStates, setDeleteButtonStates] = useState({});

  const { data, isLoading, isError, refetch } = useQuery("users", fetchUsers);

  if (isError) {
    return <div>Failed to fetch data</div>;
  }
  if (isLoading) return <PageLoader />;

  // update position
  const updatePosition = async (approvedUser) => {
    setUpdatePositionButtonStates((prevStates) => ({
      ...prevStates,
      [approvedUser._id]: "loading",
    }));

    try {
      await axios.put(`${serVer}/approve/${approvedUser._id}`, {
        position: position[approvedUser._id],
      });

      setResultMsg("Position Updated");

      refetch();
    } catch (error) {
      setResultMsg(error.response.data.error);
    } finally {
      setUpdatePositionButtonStates((prevStates) => ({
        ...prevStates,
        [approvedUser._id]: "Update Position",
      }));

      setTimeout(() => {
        setResultMsg("");
      }, 3000);
    }
  };

  // delete user
  const deleteUser = async (approvedUser) => {
    setDeleteButtonStates((prevStates) => ({
      ...prevStates,
      [approvedUser._id]: "loading",
    }));

    try {
      await axios.delete(`${serVer}/deleteUser/${approvedUser._id}`);

      setResultMsg("Success");

      refetch();
    } catch (error) {
      setResultMsg("Failed! Try again");
    } finally {
      setDeleteButtonStates((prevStates) => ({
        ...prevStates,
        [approvedUser._id]: "delete",
      }));

      setTimeout(() => {
        setResultMsg("");
      }, 3000);
    }
  };

  // Filter approved users
  const approvedUsers = data.filter(
    (user) => user.approved && user.role !== "admin"
  );

  // Check if there are any approved users
  const hasApprovedUsers = approvedUsers.length > 0;

  // Render either the list of approved users or "No approved users" message
  return (
    <div className="new-users">
      <HeaderGoBack h1="Approved Users" />
      <div>
        {hasApprovedUsers ? (
          <ul>
            {approvedUsers.map((approvedUser) => (
              <li key={approvedUser._id}>
                <div>
                  <h4>
                    name: <span>{approvedUser.name}</span>
                  </h4>
                  <h4>
                    Email: <span>{approvedUser.email}</span>
                  </h4>
                  <h4>
                    Position: <span>{approvedUser.position}</span>
                  </h4>
                </div>

                <input
                  value={position[approvedUser._id] || ""}
                  placeholder="Position"
                  type="text"
                  onChange={(e) =>
                    setPosition({
                      ...position,
                      [approvedUser._id]: e.target.value,
                    })
                  }
                  required
                />
                <div>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      updatePosition(approvedUser);
                    }}
                    disabled={
                      updatePositionButtonStates[approvedUser._id] === "loading"
                    }>
                    {updatePositionButtonStates[approvedUser._id] ===
                    "loading" ? (
                      <ButtonLoad />
                    ) : (
                      "Update Position"
                    )}
                  </button>
                  <button
                    onClick={() => deleteUser(approvedUser)}
                    disabled={
                      deleteButtonStates[approvedUser._id] === "loading"
                    }>
                    {deleteButtonStates[approvedUser._id] === "loading" ? (
                      <ButtonLoad />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No approved users</div>
        )}
      </div>
      <p className="results-display">{resultMsg}</p>
    </div>
  );
};

export default Approved;
