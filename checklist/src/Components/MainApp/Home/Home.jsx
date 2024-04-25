import Logout from "../../Custom/Logout";
import { useQuery } from "react-query";
import PageLoader from "../../Animations/PageLoader";
import AdminHome from "./Admin/AdminHome";
import UserHome from "./Users/UserHome";
import { useEffect } from "react";
import { IoMdNotifications } from "react-icons/io";
import { VscChecklist } from "react-icons/vsc";

// import fetch hook
import { fetchNotifications, fetchUser } from "../../Hooks/useFetch";
import { useLogout } from "../../Hooks/useLogout";
import { Link } from "react-router-dom";

const Home = () => {
  const { logout } = useLogout();
  const { data, isLoading, isError } = useQuery("user", fetchUser);

  //fetch notification
  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQuery("notifications", fetchNotifications);

  useEffect(() => {
    if (data && !data.approved) {
      // logout if account not approved or not data found
      return (
        <div className="fetch-error">
          Account not approved yet! <Logout /> and check again
        </div>
      );
    }
  }, [data, logout]);

  if (isError || notificationsError) {
    // logout if error
    return (
      <div className="fetch-error">
        Error fetching data <Logout /> and try again
      </div>
    );
  }

  if (isLoading || notificationsLoading) return <PageLoader />;

  // extract data from user data
  const { role, name, position } = data;

  // Filter notifications based on user role
  const filteredNotifications =
    role === "admin"
      ? notifications.filter((notification) =>
          notification.message.toLowerCase().includes("created a new entry")
        )
      : notifications.filter((notification) =>
          notification.message.toLowerCase().includes("created a new checklist")
        );

  // Filter notifications that don't include your name to avoid sending notifications to the user that created it
  const filteredNonSelfNotifications = filteredNotifications.filter(
    (notification) =>
      !notification.message.toLowerCase().includes(name.toLowerCase())
  );

  const countNotification = filteredNonSelfNotifications.length;

  return (
    <div className="home">
      <div className="spacer layer1"></div>
      <div className="home-header">
        <VscChecklist />
        <Link to="/notifications">
          <IoMdNotifications />
          <div>{countNotification}</div>
        </Link>
      </div>
      <div className="home-body">
        <div>
          <h1>Welcome {name}</h1>
          <h2>{position}</h2>
        </div>
        {role === "user" && <UserHome />}
        {role === "admin" && <AdminHome />}
      </div>
      <div className="spacer2 layer2"></div>
    </div>
  );
};

export default Home;
