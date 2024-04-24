import { Link } from "react-router-dom";
import { GoChecklist } from "react-icons/go";
import { MdCheckBoxOutlineBlank, MdChecklist } from "react-icons/md";
import { useQuery } from "react-query";
import { fetchChecklists, fetchUserEntry } from "../../../Hooks/useFetch";
import PageLoader from "../../../Animations/PageLoader";
import ManageChecklistAnim from "../../../Animations/ManageChecklistAnim";

const Users = () => {
  const {
    data: checklistsData,
    isLoading: isChecklistsDataLoading,
    isError: isChecklistsDataError,
  } = useQuery("checklists", fetchChecklists);

  const {
    data: userEntryData,
    isLoading: isUserEntryDataLoading,
    isError: isUserEntryDataError,
  } = useQuery("checklistEntry", fetchUserEntry);

  if (isChecklistsDataLoading || isUserEntryDataLoading) {
    return <PageLoader />;
  }

  if (isChecklistsDataError || isUserEntryDataError) {
    return <div>Failed to fetch data</div>;
  }

  // get total numbers of checklist
  const totalChecklist = checklistsData?.length;

  // get total of user entries from userEntryData
  const { totalCount } = userEntryData;

  return (
    <div className="admin-home">
      <ul>
        <li>
          <Link to="/manageChecklist">
            <div>
              <h4>Checklists</h4>
              <GoChecklist />
            </div>
            <div>{totalChecklist}</div>
          </Link>
        </li>
        <li>
          <Link to="/manageChecklist">
            <div>
              <h4>My Entry</h4>
              <MdChecklist />
            </div>
            <div>{totalCount}</div>
          </Link>
        </li>
      </ul>
      <div>
        <h3>QA Checklist</h3>
        <ul>
          <li>
            <Link to="/manageChecklist">
              <ManageChecklistAnim />
              <div>View All Checklist</div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Users;
