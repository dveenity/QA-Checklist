import { FaArrowRight } from "react-icons/fa";
import { useLogout } from "../Hooks/useLogout";
import { useQueryClient } from "react-query"; // Import useQueryClient

const Logout = () => {
  const queryClient = useQueryClient(); // Access the queryClient instance
  const { logout } = useLogout();

  const logOut = async () => {
    await queryClient.clear(); // Clear all cached data
    logout();
    window.location.reload(); // reload page
  };

  return (
    <div className="log-out" onClick={logOut}>
      <div>Log Out</div>
      <FaArrowRight />
    </div>
  );
};

export default Logout;
