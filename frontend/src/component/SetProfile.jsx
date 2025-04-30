import { useEffect, useState } from "react";
import StudentProfile from "../pages/StudentProfile";
import InstructorProfile from "../pages/UserProfile";
import { useSelector } from "react-redux";

const SetProfile = ()=>{

  const user = useSelector((state) => state.user.userData);

  if (!user.role) return <p>Loading profile...</p>;

  return user.role === "instructor" ? <InstructorProfile /> : <StudentProfile />;
}

export default SetProfile;