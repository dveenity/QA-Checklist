import PropTypes from "prop-types";
import GoBack from "./GoBack";

const HeaderGoBack = ({ h1 }) => {
  return (
    <div className="headerGoBack">
      <GoBack />
      <h1>{h1}</h1>
      <div></div>
    </div>
  );
};

HeaderGoBack.propTypes = {
  h1: PropTypes.string.isRequired,
};

export default HeaderGoBack;
