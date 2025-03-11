import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Settings,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Plus,
} from "lucide-react";

const InstructorProfile = () => {
  const instructor = useSelector((state) => state.user.userData);
  const [activeTab, setActiveTab] = useState("courses");
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [showEducationForm, setShowEducationForm] = useState(false);
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
    setEduData({ college: "", course: "", duration: "", location: "", cgpa: "" });
    setShowEducationForm(false);
  };

  const handleAddExperience = () => {
    setExperience([...experience, expData]);
    setExpData({ company: "", duration: "", workDescription: "" });
    setShowExperienceForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Profile Header */}
      <div className="p-6 flex flex-row gap-10 bg-gray-800 text-white rounded-lg shadow-md">
        <img
          src={instructor.profilePicture || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-blue-500"
        />

        <div>
          <h1 className="text-2xl font-bold">{instructor.name}</h1>
          <p className="text-gray-300">{instructor.bio || "No bio available."}</p>
          <div className="mt-2 flex gap-3">
            {instructor.linkedin && (
              <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                <Linkedin size={20} />
              </a>
            )}
            {instructor.twitter && (
              <a href={instructor.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-400">
                <Twitter size={20} />
              </a>
            )}
          </div>
          <div className="mt-2">
            <p className="text-gray-400 flex items-center gap-2"><Mail size={16} /> {instructor.email}</p>
            <p className="text-gray-400 flex items-center gap-2"><Phone size={16} /> {instructor.phone || "Not available"}</p>
          </div>
          <Link to="/instructor/edit-profile" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-3 inline-block">Edit Profile</Link>
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-gray-800 text-white rounded-lg shadow-md my-4 p-6">
        <h2 className="text-xl font-semibold mb-4">Education</h2>
        {education.map((edu, index) => (
          <div key={index} className="bg-gray-700 p-3 rounded-md mb-2">
            <p><strong>College:</strong> {edu.college}</p>
            <p><strong>Course:</strong> {edu.course}</p>
            <p><strong>Duration:</strong> {edu.duration}</p>
            <p><strong>Location:</strong> {edu.location}</p>
            <p><strong>CGPA:</strong> {edu.cgpa}</p>
          </div>
        ))}
        {showEducationForm ? (
          <div>
            <input type="text" placeholder="College Name" className="input" onChange={(e) => setEduData({ ...eduData, college: e.target.value })} />
            <input type="text" placeholder="Course" className="input" onChange={(e) => setEduData({ ...eduData, course: e.target.value })} />
            <input type="text" placeholder="Duration" className="input" onChange={(e) => setEduData({ ...eduData, duration: e.target.value })} />
            <input type="text" placeholder="Location" className="input" onChange={(e) => setEduData({ ...eduData, location: e.target.value })} />
            <input type="text" placeholder="CGPA" className="input" onChange={(e) => setEduData({ ...eduData, cgpa: e.target.value })} />
            <button onClick={handleAddEducation} className="bg-green-500 text-white px-4 py-2 mt-2">Add</button>
          </div>
        ) : (
          <button onClick={() => setShowEducationForm(true)} className="text-blue-400 flex items-center gap-2"><Plus size={18} /> Add Education</button>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-gray-800 text-white rounded-lg shadow-md my-4 p-6">
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        {experience.map((exp, index) => (
          <div key={index} className="bg-gray-700 p-3 rounded-md mb-2">
            <p><strong>Company:</strong> {exp.company}</p>
            <p><strong>Duration:</strong> {exp.duration}</p>
            <p><strong>Work:</strong> {exp.workDescription}</p>
          </div>
        ))}
        {showExperienceForm ? (
          <div>
            <input type="text" placeholder="Company Name" className="input" onChange={(e) => setExpData({ ...expData, company: e.target.value })} />
            <input type="text" placeholder="Duration" className="input" onChange={(e) => setExpData({ ...expData, duration: e.target.value })} />
            <textarea placeholder="Work Description" className="input" onChange={(e) => setExpData({ ...expData, workDescription: e.target.value })}></textarea>
            <button onClick={handleAddExperience} className="bg-green-500 text-white px-4 py-2 mt-2">Add</button>
          </div>
        ) : (
          <button onClick={() => setShowExperienceForm(true)} className="text-blue-400 flex items-center gap-2"><Plus size={18} /> Add Experience</button>
        )}
      </div>
    </div>
  );
};

export default InstructorProfile;
