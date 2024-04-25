import { useQuery } from "react-query";
import PageLoader from "../../Animations/PageLoader";
import {
  fetchChecklists,
  fetchUser,
  fetchUserEntry,
} from "../../Hooks/useFetch";
import Logout from "../../Custom/Logout";
import { FaMedal } from "react-icons/fa";
import pic from "../../../assets/images/pic.png";

const Profile = () => {
  const { data, isLoading, isError } = useQuery("user", fetchUser);
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

  if (isLoading || isChecklistsDataLoading || isUserEntryDataLoading) {
    return <PageLoader />;
  }

  if (isError || isChecklistsDataError || isUserEntryDataError) {
    return <div>Failed to fetch data</div>;
  }

  // extract from data
  const { name, position, email } = data;

  // get total numbers of checklist
  const totalChecklist = checklistsData?.length;

  // get total of user entries from userEntryData
  const { totalCount } = userEntryData;

  return (
    <div className="profile">
      <div className="spacer layer1"></div>
      <div>
        <div>
          <h1>{name}</h1>
          <h3>
            <FaMedal />
            <span>{position}</span>
          </h3>
        </div>
        <img alt="profile-img" src={pic} />
      </div>
      <ul>
        <li>
          <div>Checklists</div>
          <div>{totalChecklist}</div>
        </li>
        <li>
          <div>My Entries</div>
          <div>{totalCount}</div>
        </li>
      </ul>
      <ul>
        <li>Email: {email}</li>
      </ul>
      <Logout />
      <div className="spacer2 layer2"></div>
    </div>
  );
};

export default Profile;
