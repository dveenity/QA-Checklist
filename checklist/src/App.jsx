import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Genesis from "./Components/Genesis/Genesis";
import { useAuthContext } from "./Components/Hooks/useAuthContext";
import Navigation from "./Components/Custom/Navigation";
import PageLoader from "./Components/Animations/PageLoader";

const SignUpLazy = lazy(() => import("./Components/Authentication/SignUp"));
const LoginLazy = lazy(() => import("./Components/Authentication/Login"));
const HomeLazy = lazy(() => import("./Components/MainApp/Home/Home"));
const NewUsersLazy = lazy(() =>
  import("./Components/MainApp/Home/Admin/Dashboard/NewUsers")
);
const ApprovedUsersLazy = lazy(() =>
  import("./Components/MainApp/Home/Admin/Dashboard/Approved")
);
const ProfileLazy = lazy(() => import("./Components/MainApp/Profile/Profile"));
const CreateChecklistLazy = lazy(() =>
  import("./Components/MainApp/Home/Checklist/CreateChecklist")
);
const ManageChecklistLazy = lazy(() =>
  import("./Components/MainApp/Home/Checklist/ManageChecklist")
);
const ChecklistLazy = lazy(() =>
  import("./Components/MainApp/Home/Checklist/Checklist")
);
const NotificationsLazy = lazy(() =>
  import("./Components/MainApp/Home/Notifications")
);

const showNavigationRoutes = ["/home", "/profile", "/manageChecklist"];

function App() {
  const { user } = useAuthContext();
  const location = useLocation();

  const showNavigation =
    showNavigationRoutes.includes(location.pathname) && user;

  return (
    <>
      {showNavigation && <Navigation />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={!user ? <Genesis /> : <Navigate to="/home" />}
          />
          {/* AUTHENTICATION ROUTES */}
          <Route
            path="/signup"
            element={!user ? <SignUpLazy /> : <Navigate to="/home" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginLazy /> : <Navigate to="/home" />}
          />
          <>
            {/* HOME ROUTES */}
            <Route
              path="/home"
              element={user ? <HomeLazy /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <ProfileLazy /> : <Navigate to="/login" />}
            />
            <Route
              path="/manageChecklist"
              element={
                user ? <ManageChecklistLazy /> : <Navigate to="/login" />
              }
            />
          </>
          <Route
            path="/createChecklist"
            element={user ? <CreateChecklistLazy /> : <Navigate to="/login" />}
          />
          <Route
            path="/checklist/:checklistId"
            element={user ? <ChecklistLazy /> : <Navigate to="/login" />}
          />
          {/* NOTIFICATIONS ROUTE */}
          <Route
            path="/notifications"
            element={user ? <NotificationsLazy /> : <Navigate to="/login" />}
          />
          <Route
            path="/newUsers"
            element={user ? <NewUsersLazy /> : <Navigate to="/login" />}
          />
          <Route
            path="/approved"
            element={user ? <ApprovedUsersLazy /> : <Navigate to="/login" />}
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
