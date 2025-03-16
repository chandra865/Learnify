import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Education = () => {
  const [education, setEducation] = useState([]);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    startYear: new Date(),
    endYear: new Date(),
    cgpa: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/user/get-education",
        {
          withCredentials: true,
        }
      );
      const data = response.data.data;
      setEducation(data);
    } catch (error) {
      alert(error.response.data.message || "Error fetching education");
    }
  };

  const handleAddOrUpdateEducation = async () => {
    try {
      const url = editingId
        ? `http://localhost:8000/api/v1/user/update-education/${editingId}`
        : "http://localhost:8000/api/v1/user/add-education";

      const payload = {
        ...formData,
        startYear: formData.startYear.getFullYear(),
        endYear: formData.endYear.getFullYear(),
      };

      const response = await axios.post(url, payload, {
        withCredentials: true,
      });

      fetchEducation();
      setIsFormVisible(false);
      setEditingId(null);
      setFormData({
        institution: "",
        degree: "",
        startYear: new Date(),
        endYear: new Date(),
        cgpa: "",
      });
    } catch (error) {
      console.error(error.response.data.message || "Error saving education:");
    }
  };

  const handleEditClick = (edu) => {
    setFormData({
      ...edu,
      startYear: new Date(edu.startYear, 0, 1),
      endYear: new Date(edu.endYear, 0, 1),
    });
    setEditingId(edu._id);
    setIsFormVisible(true);
  };

  const handleDelete = async (eduId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/user/delete-education/${eduId}`,
        {
          withCredentials: true,
        }
      );

      alert(response.data.message || "Education deleted Successfully");
      fetchEducation();
    } catch (error) {
      alert(error.response.data.message || "Failed while deleting education");
    }
  };
  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 my-3">
      <h2 className="text-2xl font-bold mb-4">Education</h2>

      {education.map((edu) => (
        <div
          key={edu._id}
          className="bg-gray-700 py-8 px-5 rounded-md mb-3 relative"
        >
          <div className="flex justify-between">
            <p className="text-xl font-semibold">{edu.institution}</p>
            <p className="text-sm font-semibold text-white">
              {edu.startYear} - {edu.endYear}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-400"> {edu.degree}</p>
            <p className=" text-gray-400">
              <strong>CGPA:</strong> {edu.cgpa}
            </p>
          </div>
          <button
            className="absolute top-2 right-10 hover:text-blue-300 cursor-pointer"
            onClick={() => handleDelete(edu._id)}
          >
            <FaTrash size={18} />
          </button>
          <button
            onClick={() => handleEditClick(edu)}
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
              placeholder="Institution"
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md"
              value={formData.institution}
              onChange={(e) =>
                setFormData({ ...formData, institution: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Degree"
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md"
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
            />

            {/* Year Picker for Start Year */}
            <DatePicker
              selected={formData.startYear}
              onChange={(date) => setFormData({ ...formData, startYear: date })}
              showYearPicker
              dateFormat="yyyy"
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md w-full"
            />

            {/* Year Picker for End Year */}
            <DatePicker
              selected={formData.endYear}
              onChange={(date) => setFormData({ ...formData, endYear: date })}
              showYearPicker
              dateFormat="yyyy"
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md w-full"
            />

            <input
              type="number"
              step="0.01"
              placeholder="CGPA"
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md"
              value={formData.cgpa}
              onChange={(e) =>
                setFormData({ ...formData, cgpa: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleAddOrUpdateEducation}
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
          <FaPlus size={18} /> Add Education
        </button>
      )}
    </div>
  );
};

export default Education;
