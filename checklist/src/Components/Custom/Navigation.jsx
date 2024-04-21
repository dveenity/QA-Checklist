import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <ul className="navigation">
      <li>
        <NavLink exact="true" activeclassname="active" to="/home">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeclassname="active" to="/manageChecklist">
          Checklist
        </NavLink>
      </li>
      <li>
        <NavLink activeclassname="active" to="/profile">
          Profile
        </NavLink>
      </li>
    </ul>
  );
};

export default Navigation;
