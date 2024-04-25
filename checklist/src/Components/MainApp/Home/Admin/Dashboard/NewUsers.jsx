import { useQuery } from "react-query";
import { fetchUsers } from "../../../../Hooks/useFetch";
import PageLoader from "../../../../Animations/PageLoader";
import axios from "axios";
import { useEffect, useState } from "react";
import HeaderGoBack from "../../../../Custom/HeaderGoBack";
import ButtonLoad from "../../../../Animations/ButtonLoad";
import NewUsersAnim from "../../../../Animations/NewUsersAnim";
import Null from "../../../../Animations/Null";

const serVer = `https://checklist-app-backend.vercel.app`;
const NewUsers = () => {
  const [position, setPosition] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const [approvedButtonStates, setApprovedButtonStates] = useState({});
  const [deleteButtonStates, setDeleteButtonStates] = useState({});
  const { data, isLoading, isError, refetch } = useQuery("users", fetchUsers);

  useEffect(() => {
    if (resultMsg) {
      const timeoutId = setTimeout(() => {
        setResultMsg(""); // Clear the message after 3 seconds
      }, 3000);

      // Cleanup function to clear the timeout when the component unmounts or resultMsg changes
      return () => clearTimeout(timeoutId);
    }
  }, [resultMsg]);

  if (isError) {
    <div>Failed to fetch data</div>;
  }
  if (isLoading) return <PageLoader />;

  // approve user function
  const acceptUser = async (unapprovedUser) => {
    setApprovedButtonStates((prevStates) => ({
      ...prevStates,
      [unapprovedUser._id]: "loading",
    }));

    try {
      const res = await axios.put(`${serVer}/approve/${unapprovedUser._id}`, {
        position: position[unapprovedUser._id],
      });

      setResultMsg(res.data);

      refetch();
    } catch (error) {
      setResultMsg(error.response.data.error);
    } finally {
      setApprovedButtonStates((prevStates) => ({
        ...prevStates,
        [unapprovedUser._id]: "approve",
      }));

      setTimeout(() => {
        setResultMsg("");
      }, 3000);
    }
  };

  // disapprove || delete user
  const deleteUser = async (unapprovedUser) => {
    setDeleteButtonStates((prevStates) => ({
      ...prevStates,
      [unapprovedUser._id]: "loading",
    }));

    try {
      const res = await axios.delete(
        `${serVer}/deleteUser/${unapprovedUser._id}`
      );

      refetch();
      setResultMsg(res.data);
    } catch (error) {
      setResultMsg("Failed! Try again");
    } finally {
      setDeleteButtonStates((prevStates) => ({
        ...prevStates,
        [unapprovedUser._id]: "delete",
      }));
    }
  };

  // Filter unapproved users
  const unapprovedUsers = data.filter((user) => !user.approved);

  // Check if there are any unapproved users
  const hasUnapprovedUsers = unapprovedUsers.length > 0;

  return (
    <div className="new-users">
      <HeaderGoBack h1="New Users" />
      <div>
        {hasUnapprovedUsers ? (
          <ul>
            {unapprovedUsers.map((unapprovedUser) => (
              <li key={unapprovedUser._id}>
                <NewUsersAnim />
                <div>
                  <h4>
                    Name: <span>{unapprovedUser.name}</span>
                  </h4>
                  <h4>
                    Email: <span>{unapprovedUser.email}</span>
                  </h4>
                </div>

                <input
                  value={position[unapprovedUser._id] || ""}
                  placeholder="Position"
                  type="text"
                  onChange={(e) =>
                    setPosition({
                      ...position,
                      [unapprovedUser._id]: e.target.value,
                    })
                  }
                  required
                />
                <div>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      acceptUser(unapprovedUser);
                    }}
                    disabled={
                      approvedButtonStates[unapprovedUser._id] === "loading"
                    }>
                    {approvedButtonStates[unapprovedUser._id] === "loading" ? (
                      <ButtonLoad />
                    ) : (
                      "Approve"
                    )}
                  </button>
                  <button
                    onClick={() => deleteUser(unapprovedUser)}
                    disabled={
                      deleteButtonStates[unapprovedUser._id] === "loading"
                    }>
                    {deleteButtonStates[unapprovedUser._id] === "loading" ? (
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
          <div className="Null">
            <div>No new users yet</div>
            <Null />
          </div>
        )}
      </div>
      <p className={`error-display ${resultMsg ? "show" : ""}`}>{resultMsg}</p>
      <div className="spacer2 layer2"></div>
    </div>
  );
};

export default NewUsers;
