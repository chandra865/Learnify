import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EditCourse = () => {
  const navigte = useNavigate();
  const { courseId } = useParams();
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState([]);
  const [courseIncludes, setCourseIncludes] = useState([]);
  const [language, setLanguage] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [disable, setDisable] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const TITLE_LIMIT = 50;
  const DESCRIPTION_LIMIT = 80;
  const CATEGORY_LIMIT = 20;

  const userId = useSelector((state) => state.user.userData?._id);

  useEffect(() => {
    const fetchCreatedCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/course/fetchcourse/${courseId}`,
          { withCredentials: true }
        );
        //   console.log(response.data.data);
        const courseData = response.data.data;
        setCourses(courseData);

        // Update state with fetched data
        setTitle(courseData.title);
        setDescription(courseData.description);
        setCategory(courseData.category);
        setPrice(courseData.price);
        setWhatYouWillLearn(courseData.whatYouWillLearn || []);
        setCourseIncludes(courseData.courseIncludes || []);
        setLanguage(courseData.language);
        // setThumbnail(courseData.thumbnail);
        setImgPreview(courseData.thumbnail.url);
        // setVideoFile(courseData.preview);

        setVideoPreview(courseData.preview.url);
      } catch (err) {
        setError("Failed to fetch created courses");
        console.error(err);
      }
    };
    fetchCreatedCourses();
  }, [courseId]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleDynamicFieldChange = (setter, index, value) => {
    setter((prev) => {
      const newArray = [...prev]; // Copy the existing array
      newArray[index] = value; // Update the specific index
      return newArray; // Return the new state
    });
  };
  const addField = (setter) => setter((prev) => [...prev, ""]);
  const removeField = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e) => {
    setDisable(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append(
        "category",
        category === "Other" ? customCategory : category
      );
      formData.append("price", price);
      formData.append("language", language);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      formData.append("whatYouWillLearn", whatYouWillLearn.join(","));
      formData.append("courseIncludes", courseIncludes.join(","));
      formData.append("videoFile", videoFile);
      const response = await axios.patch(
        `http://localhost:8000/api/v1/course/update-course/${courseId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(response.data);
      alert("Course Updated Successfully!");

      setTitle("");
      setDescription("");
      setCategory("");
      setCustomCategory("");
      setPrice(0);
      setThumbnail(null);
      setPreview(null);
      setWhatYouWillLearn([""]);
      setCourseIncludes([""]);
      setLanguage("");
      setVideoFile(null);
      setDisable(false);

      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    } catch (error) {
      setDisable(false);
      console.error("Error creating course", error.response.data);
      alert("Failed to create course.");
    }
  };

  return (
    <div className="bg-gray-900  text-white p-6 rounded shadow-lg mx-auto w-3/5">
      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="block font-bold">
          Course Title ({TITLE_LIMIT - title?.length} chars left)
        </label>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= TITLE_LIMIT) {
              setTitle(e.target.value);
            }
          }}
          className="block w-full p-2 border rounded mb-2"
          required
        />

        <label className="block font-bold">
          Course Description ({DESCRIPTION_LIMIT - description?.length} chars
          left)
        </label>
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= DESCRIPTION_LIMIT) {
              setDescription(e.target.value);
            }
          }}
          className="block w-full p-2 border rounded mb-2"
          required
        />

        <label className="block font-bold">Course Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full p-2 border rounded mb-2 bg-gray-900 text-white"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          <optgroup label="Development">
            <option value="Web Development">Web Development</option>
            <option value="Programming Language">Programming Language</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Game Development">Game Development</option>
            <option value="Database Design & Development">
              Database Design & Development
            </option>
            <option value="Software Testing">Software Testing</option>
          </optgroup>
          <optgroup label="Design">
            <option value="Game Design">Game Design</option>
            <option value="Graphics Design">Graphics Design</option>
            <option value="User Experience Design">
              User Experience Design
            </option>
            <option value="Web Design">Web Design</option>
          </optgroup>
          <optgroup label="Health & Fitness">
            <option value="Fitness">Fitness</option>
            <option value="General Health">General Health</option>
            <option value="Sports">Sports</option>
            <option value="Yoga">Yoga</option>
            <option value="Mental Health">Mental Health</option>
          </optgroup>
          <optgroup label="Marketing">
            <option value="Social Media Marketing">
              Social Media Marketing
            </option>
            <option value="Search Engine Optimization">
              Search Engine Optimization
            </option>
            <option value="Branding">Branding</option>
            <option value="Marketing Fundamentals">
              Marketing Fundamentals
            </option>
          </optgroup>
          <option value="Other">Other</option>
        </select>

        {category === "Other" && (
          <>
            <label className="block font-bold">
              Custom Category ({CATEGORY_LIMIT - customCategory?.length} chars
              left)
            </label>
            <input
              type="text"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => {
                if (e.target.value.length <= CATEGORY_LIMIT) {
                  setCustomCategory(e.target.value);
                } else {
                  setCustomCategory(e.target.value.slice(0, CATEGORY_LIMIT)); // Trim excess characters
                }
              }}
              className="block w-full p-2 border rounded mb-2"
              required
            />
          </>
        )}
        <label className="block font-bold">Price</label>
        <input
          type="number"
          placeholder="Course Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
          min="0"
          required
        />

        <div>
          <label className="block font-semibold text-white mt-4">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border rounded-md  bg-gray-900 text-white"
            required
          >
            <option value="" disabled>
              Select a language
            </option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-white mt-4">
            What You Will Learn
          </label>
          {whatYouWillLearn?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Learning Outcome"
                value={item}
                onChange={(e) =>
                  handleDynamicFieldChange(
                    setWhatYouWillLearn,
                    index,
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded-md mt-2"
                required
              />
              <button
                type="button"
                onClick={() => removeField(setWhatYouWillLearn, index)}
                className="text-red-500"
              >
                ✖
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setWhatYouWillLearn)}
            className="text-blue-500 mt-1"
          >
            + Add
          </button>
        </div>

        <div>
          <label className="block font-semibold text-white mt-4">
            Course Includes
          </label>
          {courseIncludes?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Feature"
                value={item}
                onChange={(e) =>
                  handleDynamicFieldChange(
                    setCourseIncludes,
                    index,
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded-md mt-2"
                required
              />
              <button
                type="button"
                onClick={() => removeField(setCourseIncludes, index)}
                className="text-red-500"
              >
                ✖
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setCourseIncludes)}
            className="text-blue-500 mt-1"
          >
            + Add
          </button>
        </div>
        <label className="block font-bold mt-4">Add Course Preview:</label>
        <input
          type="file"
          name="videoFile"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded mb-3"
          ref={videoInputRef}
          required
        />

        {videoPreview && (
            <video
              src={videoPreview}
              controls
              className="mt-2 h-50 object-cover rounded"
            />
        )}

        <label className="block font-bold mt-4">Upload Course Thumbnail:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="block w-full p-2 border rounded mb-2"
          ref={imageInputRef}
        />
        {imgPreview && (
          <img
            src={imgPreview}
            alt="Thumbnail Preview"
            className="mt-2 w-80 h-full object-cover rounded"
          />
        )}
        <div className="flex justify-center gap-4">
        <button
            type="submit"
            className="
                bg-blue-500 hover:bg-blue-600 cursor-pointer
        text-white px-6   mt-4 rounded "
            onClick={()=>navigte(`/Dashboard/created`)}
          >
            Back
          </button>
          <button
            type="submit"
            className={`${
              disable
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            } text-white p-2 rounded mt-4 `}
            disabled={disable}
          >
            Update Course
          </button>

          
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
