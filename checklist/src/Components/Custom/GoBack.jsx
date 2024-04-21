import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const GoBack = () => {
  const navigate = useNavigate();

  // This function will go back to the previous page
  const goBack = () => {
    navigate(-1);
  };
  return (
    <button className="goBack" onClick={goBack}>
      <IoArrowBackCircleOutline />
    </button>
  );
};

export default GoBack;
