import { useSelector } from "react-redux";
import Profile from "../component/Profile";
import Education from "../component/Education";
import Experience from "../component/Experience";
import Expertise from "../component/Expertise";

const UserProfile = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 pb-32">
      <Profile />
      <Expertise />
      <Experience />
      <Education />
    </div>
  );
};

export default UserProfile;
