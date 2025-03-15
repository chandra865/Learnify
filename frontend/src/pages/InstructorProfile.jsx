import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit } from "react-icons/fa";
import Profile from "../component/Profile";

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

      {/* Experience Section */}
      <div className="bg-gray-800 text-white rounded-lg shadow-md my-4 p-6">
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        {experience.map((exp, index) => (
          <div key={index} className="bg-gray-700 p-3 rounded-md mb-2">
            <p>
              <strong>Company:</strong> {exp.company}
            </p>
            <p>
              <strong>Duration:</strong> {exp.duration}
            </p>
            <p>
              <strong>Work:</strong> {exp.workDescription}
            </p>
          </div>
        ))}
        {showExperienceForm ? (
          <div>
            <input
              type="text"
              placeholder="Company Name"
              className="input"
              onChange={(e) =>
                setExpData({ ...expData, company: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Duration"
              className="input"
              onChange={(e) =>
                setExpData({ ...expData, duration: e.target.value })
              }
            />
            <textarea
              placeholder="Work Description"
              className="input"
              onChange={(e) =>
                setExpData({ ...expData, workDescription: e.target.value })
              }
            ></textarea>
            <button
              onClick={handleAddExperience}
              className="bg-green-500 text-white px-4 py-2 mt-2"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowExperienceForm(true)}
            className="text-blue-400 flex items-center gap-2"
          >
           Add Experience
          </button>
        )}
      </div>
    </div>
  );
};

export default InstructorProfile;
