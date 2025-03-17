import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit } from "react-icons/fa";
import Profile from "../component/Profile";
import Education from "../component/Education";
import Experience from "../component/Experience";
import Expertise from "../component/Expertise";

const InstructorProfile = () => {
  const instructor = useSelector((state) => state.user.userData);
  const [activeTab, setActiveTab] = useState("courses");
  const [experience, setExperience] = useState([]);
  const [showExperienceForm, setShowExperienceForm] = useState(false);

  const [eduData, setEduData] = useState({
    college: "",
    course: "",
    duration: "",
    location: "",
    cgpa: "",
  });

  const [expData, setExpData] = useState({
    company: "",
    duration: "",
    workDescription: "",
  });

  const handleAddEducation = () => {
    setEducation([...education, eduData]);
    setEduData({
      college: "",
      course: "",
      duration: "",
      location: "",
      cgpa: "",
    });
    setShowEducationForm(false);
  };

  const handleAddExperience = () => {
    setExperience([...experience, expData]);
    setExpData({ company: "", duration: "", workDescription: "" });
    setShowExperienceForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Profile />
      <Expertise/>
      <Experience/>
      <Education/>
    </div>
  );
};

export default InstructorProfile;
