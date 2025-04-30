import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const Expertise = () => {
  const [expertise, setExpertise] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [customExpertise, setCustomExpertise] = useState("");

  const expertiseOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "CSS",
    "HTML",
    "Other",
  ];

  const fetchExpertise = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/user/get-expertise",
        { withCredentials: true }
      );
      setExpertise(response.data.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching expertise");
    }
  };

  useEffect(() => {
    fetchExpertise();
  }, []);

  const addExpertise = async () => {
    const expertiseToAdd = selectedExpertise === "Other" ? customExpertise.trim() : selectedExpertise;

    if (expertiseToAdd && !expertise.includes(expertiseToAdd)) {
      const formData = new FormData();
      formData.append("expertise", expertiseToAdd);

      try {
        await axios.post(
          "http://localhost:8000/api/v1/user/add-expertise",
          formData,
          { withCredentials: true }
        );
        setExpertise([...expertise, expertiseToAdd]);
        setSelectedExpertise("");
        setCustomExpertise("");
        fetchExpertise();
      } catch (error) {
        console.error(error.response?.data?.message || "Error adding expertise");
      }
    }
  };

  const removeExpertise = async (expertiseItem) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/user/delete-expertise?expertise=${expertiseItem}`,
        { withCredentials: true }
      );
      setExpertise(expertise.filter((e) => e !== expertiseItem));
      fetchExpertise();
    } catch (error) {
      console.error(error.response?.data?.message || "Error removing expertise");
    }
  };

  return (
    <div className="p-4 w-full rounded-lg shadow-md bg-gray-800 my-2 text-white">
      <h2 className="text-2xl font-bold mb-4">Manage Expertise</h2>

      {/* Dropdown */}
      <div className="flex flex-row gap-2 mb-4">
        <select
          className="border rounded p-2 bg-gray-700 text-white"
          value={selectedExpertise}
          onChange={(e) => setSelectedExpertise(e.target.value)}
        >
          <option value="">Select an expertise</option>
          {expertiseOptions.map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </select>

        {/* If "Other" is selected, show input */}
        {selectedExpertise === "Other" && (
          <input
            type="text"
            className="border rounded p-2 bg-gray-700 text-white"
            placeholder="Enter your expertise"
            value={customExpertise}
            onChange={(e) => setCustomExpertise(e.target.value)}
          />
        )}

        <button
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
          onClick={addExpertise}
        >
          Add Expertise
        </button>
      </div>

      {/* Expertise List */}
      <div className="flex flex-wrap gap-2 text-white">
        {expertise.map((exp) => (
          <div
            key={exp}
            className="flex items-center bg-gray-700 px-5 py-3 rounded-full"
          >
            {exp}
            <button
              onClick={() => removeExpertise(exp)}
              className="ml-2 text-red-500"
            >
              <X className="text-white" size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expertise;
