import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    startYear: new Date(),
    endYear: new Date(),
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/user/get-experience",
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data);
      setExperience(response.data.data);
    } catch (error) {
      alert(error.response.data.message || "Error fetching experience");
    }
  };

  const handleAddOrUpdateExperience = async () => {
    try {
      const url = editingId
        ? `http://localhost:8000/api/v1/user/update-experience/${editingId}`
        : "http://localhost:8000/api/v1/user/add-experience";

      const payload = { 
        ...formData,
        startYear: formData.startYear.getFullYear(),
        endYear: formData.endYear ? formData.endYear.getFullYear() : null,
      };

      await axios.post(url, payload, {
        withCredentials: true,
      });

      fetchExperience();
      setIsFormVisible(false);
      setEditingId(null);
      setFormData({
        jobTitle: "",
        company: "",
        startYear: new Date(),
        endYear: new Date(),
        description: "",
      });
    } catch (error) {
      console.error(error.response.data.message || "Error saving experience:");
    }
  };

  const handleEditClick = (exp) => {
    setFormData({
      ...exp,
      startYear: new Date(exp.startYear, 0, 1),
      endYear: exp.endYear ? new Date(exp.endYear, 0, 1) : null,
    });
    setEditingId(exp._id);
    setIsFormVisible(true);
  };

  const handleDelete = async (expId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/user/delete-experience/${expId}`,
        {
          withCredentials: true,
        }
      );
      fetchExperience();
    } catch (error) {
      alert(error.response.data.message || "Failed while deleting experience");
    }
  };

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 my-3">
      <h2 className="text-2xl font-bold mb-4">Experience</h2>

      {experience.map((exp) => (
        <div
          key={exp._id}
          className="bg-gray-700 py-8 px-5 rounded-md mb-3 relative"
        >
          <div className="flex justify-between">
            <p className="text-xl font-semibold">{exp.company}</p>
            <p className="text-sm font-semibold text-white">
              {exp.startYear} - {exp.endYear || "Present"}
            </p>
          </div>
          <p className="text-gray-400">
            <strong>Job Title:</strong> {exp.jobTitle}
          </p>
          <p className="text-gray-400">
            <strong>Description:</strong> {exp.description}
          </p>
          <button
            className="absolute top-2 right-10 hover:text-blue-300 cursor-pointer"
            onClick={() => handleDelete(exp._id)}
          >
            <FaTrash size={18} />
          </button>
          <button
            onClick={() => handleEditClick(exp)}
            className="absolute top-2 right-2 hover:text-blue-300 cursor-pointer"
          >
            <FaEdit size={18} />
          </button>
        </div>
      ))}

      {isFormVisible && (
        <div className="bg-gray-700 p-4 rounded-md mt-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Job Title"
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Company"
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />

            {/* Year Picker for Start Year */}
            <DatePicker
              selected={formData.startYear}
              onChange={(date) => setFormData({ ...formData, startYear: date })}
              showYearPicker
              dateFormat="yyyy"
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md w-full"
              placeholderText="Start Year"
            />

            {/* Year Picker for End Year */}
            <DatePicker
              selected={formData.endYear}
              onChange={(date) => setFormData({ ...formData, endYear: date })}
              showYearPicker
              dateFormat="yyyy"
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md w-full"
              placeholderText="End Year (Leave empty if present)"
            />

            <textarea
              placeholder="Description"
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md col-span-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleAddOrUpdateExperience}
            className="bg-green-500 text-white px-4 py-2 mt-3 rounded-md"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      )}

      {!isFormVisible && (
        <button
          onClick={() => setIsFormVisible(true)}
          className="text-blue-400 flex items-center gap-2 mt-2"
        >
          <FaPlus size={18} /> Add Experience
        </button>
      )}
    </div>
  );
};

export default Experience;
