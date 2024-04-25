import { Link } from "react-router-dom";
import {
  MdList,
  MdTouchApp,
  MdAssignment,
  MdBuild,
  MdAttachFile,
  MdNotificationsActive,
  MdAssessment,
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import Marquee from "react-fast-marquee";

const Genesis = () => {
  const companyName = "Hedged";

  // create an array of features and map into list to display in the dom
  const features = [
    {
      name: "Flexible Checklist Creation",
      icon: <MdList />,
      description:
        "Easily create custom checklists tailored to your specific quality criteria. Add, remove, or modify checklist items as needed.",
    },
    {
      name: "Intuitive User Interface",
      icon: <MdTouchApp />,
      description:
        "User-friendly interface designed for seamless navigation and efficient management of quality assurance tasks.",
    },
    {
      name: "Collaborative Teamwork",
      icon: <FaUsers />,
      description:
        "Efficiently collaborate with team members to ensure thorough quality checks and streamline the QA process.",
    },
    {
      name: "Task Assignment and Tracking",
      icon: <MdAssignment />,
      description:
        "Assign tasks to team members, track progress in real-time, and receive notifications on task completion or delays.",
    },
    {
      name: "Document Attachment",
      icon: <MdAttachFile />,
      description:
        "Attach relevant documents, images, or notes to checklist items for reference or documentation purposes.",
    },
    {
      name: "Customizable Notifications",
      icon: <MdNotificationsActive />,
      description:
        "Customize notifications to receive alerts on upcoming tasks, changes in checklist status, or other important updates.",
    },
    {
      name: "Comprehensive Reporting",
      icon: <MdAssessment />,
      description:
        "Generate detailed reports and analytics to track quality trends, identify areas for improvement, and ensure compliance with standards.",
    },
    {
      name: "Integration with Other Tools",
      icon: <MdBuild />,
      description:
        "Seamlessly integrate with other tools and systems used by your organization, such as project management or CRM software.",
    },
  ];

  const featuresOutput = features.map((feature, i) => (
    <li key={i}>
      <div>
        <h4>{feature.name}</h4>
        <span>{feature.icon}</span>
      </div>
      <p>{feature.description}</p>
    </li>
  ));

  return (
    <div className="genesis">
      <div className="spacer layer1"></div>
      <div>
        <h1>
          Welcome to <span>{companyName} Inc</span> <br />
          Quality Checklist Interface
        </h1>
        <div>
          <h2>
            Start Managing your Quality Assurance Process with Ease and
            Efficiency
          </h2>
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
      <div>
        <h3>Walkthrough</h3>
        <Marquee className="marquee">
          <ul>{featuresOutput}</ul>
        </Marquee>
      </div>
      <div className="spacer2 layer2"></div>
    </div>
  );
};

export default Genesis;
