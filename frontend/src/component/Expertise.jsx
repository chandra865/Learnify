import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const Expertise = () => {
  const [expertise, setExpertise] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState("");

  const expertiseOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "CSS",
    "HTML",
  ];
  const fetchExpertise = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/user/get-expertise",
        {
          withCredentials: true,
        }
      );

      setExpertise(response.data.data || []);
    } catch (error) {
      alert("Error fetching expertise" || error.response.data.message);
    }
  };
  useEffect(() => {
    // Fetch expertise from backend
    fetchExpertise();
  }, []);

  const addExpertise = async () => {
    if (selectedExpertise && !expertise.includes(selectedExpertise)) {
        const formData = new FormData();
        formData.append("expertise",selectedExpertise)
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/user/add-expertise",
          formData,
          {
            withCredentials: true,
          }
        );
        setExpertise([...expertise, selectedExpertise]);
        setSelectedExpertise("");
        fetchExpertise();
      } catch (error) {
        console.error(
          error.response?.data?.message || "error in adding expertise"
        );
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
      console.error(
        error.response?.data?.message || "Error removing expertise"
      );
    }
  };

  return (
    <div className="p-4 w-full rounded-lg shadow-md bg-gray-800 my-2 text-white">
      <h2 className="text-2xl font-bold mb-4">Manage Expertise</h2>
      <div className="flex gap-2 mb-4 w-1/2">
        <select
          className="border rounded w-full h-1/2 p-1 "
          value={selectedExpertise}
          onChange={(e) => setSelectedExpertise(e.target.value)}
        >
          <option className="bg-gray-800 text-white" value="">
            Select an expertise
          </option>
          {expertiseOptions.map((exp) => (
            <option className="bg-gray-800 text-white" key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-2 py-1 w-[100px] h-1/2 rounded"
          onClick={addExpertise}
        >
          Add
        </button>
      </div>
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
              <X className=" text-white" size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expertise;
