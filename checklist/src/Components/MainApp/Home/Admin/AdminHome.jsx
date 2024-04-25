import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchUsers } from "../../../Hooks/useFetch";
import PageLoader from "../../../Animations/PageLoader";
import { FaRegNewspaper } from "react-icons/fa";
import CreateChecklistAnim from "../../../Animations/CreateChecklistAnim";
import ManageChecklistAnim from "../../../Animations/ManageChecklistAnim";

const AdminHome = () => {
  const { data, isLoading, isError } = useQuery("users", fetchUsers);

  if (isError) {
    return <div>Failed to fetch data</div>;
  }

  if (isLoading || !data) {
    return <PageLoader />;
  }

  // Ensure data is an array before filtering
  if (!Array.isArray(data)) {
    return; // Or handle this case as appropriate
  }

  // Filter unapproved users
  const unapprovedUsers = data.filter((user) => !user.approved);
  const unapprovedUsersLength = unapprovedUsers.length;

  // Filter approved users
  const approvedUsers = data.filter(
    (user) => user.approved && user.role !== "admin"
  );
  const approvedUsersLength = approvedUsers.length;

  // create an admin dashboard array and map into dom
  const dashboard = [
    {
      name: "New Staff",
      icon: <FaRegNewspaper />,
      link: "/newUsers",
      count: unapprovedUsersLength,
    },
    {
      name: "Approved",
      icon: <FaRegNewspaper />,
      link: "/approved",
      count: approvedUsersLength,
    },
  ];

  const dashboardOutput = dashboard.map((dash, i) => (
    <li key={i}>
      <Link to={dash.link}>
        <div>
          <h4>{dash.name}</h4>
          <div>{dash.icon}</div>
        </div>
        <div>{dash.count}</div>
      </Link>
    </li>
  ));

  return (
    <div className="admin-home">
      <ul>{dashboardOutput}</ul>
      <div>
        <h3>QA Checklist</h3>
        <ul>
          <li>
            <Link to="/createChecklist">
              <CreateChecklistAnim />
              <div>Create New Checklist</div>
            </Link>
          </li>
          <li>
            <Link to="/manageChecklist">
              <ManageChecklistAnim />
              <div>Manage All Checklist</div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHome;
