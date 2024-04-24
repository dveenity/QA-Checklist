import { useQuery } from "react-query";
import PageLoader from "../../Animations/PageLoader";
import { fetchNotifications, fetchUser } from "../../Hooks/useFetch";
import { Link } from "react-router-dom";
import { IoAlarmOutline } from "react-icons/io5";
import HeaderGoBack from "../../Custom/HeaderGoBack";
import NotifNull from "../../Animations/NotifNull";

const Notifications = () => {
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery("user", fetchUser);

  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQuery("notifications", fetchNotifications);

  if (userError || notificationsError) {
    return <div>Failed to fetch data</div>;
  }
  if (userLoading || notificationsLoading) return <PageLoader />;

  // Extract role and name from user data
  const { role, name } = userData;

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

  // Check if there are any notifications
  const hasNotifications = filteredNonSelfNotifications.length > 0;

  return (
    <div className="notifications">
      <HeaderGoBack h1="New Notifications" />
      <div className="notifications-body">
        {hasNotifications ? (
          <ul className="notifications-list">
            {filteredNonSelfNotifications.map((notification) => {
              let time = new Date(notification.createdAt).toLocaleDateString();

              return (
                <li key={notification._id}>
                  <Link to="/manageChecklist">
                    <h2>
                      Hi {name}! {notification.message}
                    </h2>
                    <p>
                      <IoAlarmOutline />
                      {time}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="Null">
            <div>No notifications yet</div>
            <NotifNull />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
