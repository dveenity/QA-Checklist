import { useQuery } from "react-query";
import PageLoader from "../../../Animations/PageLoader";
import { fetchChecklists, fetchUser } from "../../../Hooks/useFetch";
import { Link } from "react-router-dom";
import NotifAnim from "../../../Animations/NotifAnim";
import ChecklistAnim from "../../../Animations/ChecklistAnim";
import { GiAlarmClock } from "react-icons/gi";

const ManageChecklist = () => {
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery("user", fetchUser);
  const {
    data: checklistsData,
    isLoading: isChecklistsDataLoading,
    isError: isChecklistsDataError,
  } = useQuery("checklists", fetchChecklists);

  if (userError || isChecklistsDataError) {
    return <div>Failed to fetch data</div>;
  }
  if (userLoading || isChecklistsDataLoading) return <PageLoader />;

  // Extract role
  const { role } = userData;

  // Render either the list of checklists or "No checklists available" message
  const hasChecklist = checklistsData?.length > 0;

  return (
    <div className="checklist-management">
      <div>
        <h1>Checklists {role === "admin" && <span>Management</span>}</h1>
        {role === "admin" && (
          <Link to="/createChecklist">Add New Checklist</Link>
        )}
      </div>
      <div>
        {hasChecklist ? (
          <ul>
            {checklistsData.map((checklist) => {
              let time = new Date(checklist.createdAt).toLocaleDateString();

              return (
                <li key={checklist._id}>
                  <Link to={`/checklist/${checklist._id}`}>
                    <div>
                      <h3>{checklist.checklistName}</h3>
                      <div>
                        <GiAlarmClock />
                        {time}
                      </div>
                    </div>
                    <ChecklistAnim />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="checklist-none">
            <div>No checklists created yet</div>
            <NotifAnim />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageChecklist;
