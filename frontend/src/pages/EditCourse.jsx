import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import { toast } from "react-toastify";
const EditCourse = () => {
  const [courses, setCourses] = useState([]);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

  const [price, setPrice] = useState(0);
  const [language, setLanguage] = useState("");
  const [certificateOption, setCertificateOption] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [whatYouWillLearn, setWhatYouWillLearn] = useState([]);
  const [courseIncludes, setCourseIncludes] = useState([]);

  const [disable, setDisable] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const courseId = useSelector((state) => state.course.selectedCourse._id);
  const dispatch = useDispatch();
  // console.log("courseId", courseId);

  const TITLE_LIMIT = 50;
  const SUBTITLE_LIMIT = 120;
  const DESCRIPTION_LIMIT = 150;



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/category/get-categories"
        ); // Adjust API endpoint as needed
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [courseId]);

  const fetchCreatedCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/course/fetchcourse/${courseId}`,
        { withCredentials: true }
      );
      //   console.log(response.data.data);
      const courseData = response.data.data;
      setCourses(courseData);
      dispatch(setSelectedCourse(courseData)); // Dispatch the selected course to Redux store

      // Update state with fetched data
      setTitle(courseData.title);
      setSubtitle(courseData.subtitle);
      setLevel(courseData.level);
      setDescription(courseData.description);

      setSelectedCategory(courseData.category);
      setSelectedSubcategory(courseData.subcategory);

      setPrice(courseData.price);
      setLanguage(courseData.language);
      setCertificateOption(courseData.certificateOption);

      setThumbnail(courseData.thumbnail);
      setImgPreview(courseData.thumbnail.url);
      setVideoFile(courseData.preview);
      setVideoPreview(courseData.preview.url);

      setWhatYouWillLearn(courseData.whatYouWillLearn || []);
      setCourseIncludes(courseData.courseIncludes || []);   
      
    } catch (error) {
      // console.log("Failed to fetch created courses");
      // console.error(err);
      alert(
        error.response?.data?.message ||
          "something went worng while fetching course"
      );
    }
  };

  useEffect(() => {
    fetchCreatedCourses();
  }, [courseId]);


  const handleSubmit = async (e) => {
    // console.log("bthumbnail",thumbnail);
    // console.log("bvideo",videoFile);
    setDisable(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("level", level);
      formData.append("description", description);
  
      formData.append("price", price);
      formData.append("language", language);
      formData.append("certificateOption", certificateOption);

      formData.append("category", selectedCategory);
      formData.append("subcategory", selectedSubcategory);

      if (thumbnail) {
        const strThumbnail =
          typeof thumbnail === "string" ? thumbnail : JSON.stringify(thumbnail);
        formData.append("thumbnail", strThumbnail);
        // console.log("thumbnail",strThumbnail);
      }
      if (videoFile) {
        const strVideoFile =
          typeof videoFile === "string" ? videoFile : JSON.stringify(videoFile);

        formData.append("videoFile", strVideoFile);
        // console.log(strVideoFile);
      }

      formData.append("whatYouWillLearn", whatYouWillLearn.join(","));
      formData.append("courseIncludes", courseIncludes.join(","));
      
      const response = await axios.patch(
        `http://localhost:8000/api/v1/course/update-course/${courseId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // console.log(response.data);
      toast.success(response?.data?.message || "Course Updated Successfully!");
      fetchCreatedCourses(); // Refresh the course data after update
      
      // setTitle("");
      // setDescription("");
      // setCategory("");
      // setCustomCategory("");
      // setPrice(0);
      setThumbnail(null);
      // setWhatYouWillLearn([""]);
      // setCourseIncludes([""]);
      // setLanguage("");
      setVideoFile(null);
      setDisable(false);
      // setImgPreview(null);
      // setVideoPreview(null);
      setProgress(0);

      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    } catch (error) {
      setDisable(false);
      // console.error("Error creating course", error.response.data);
      toast.error(error.response?.data?.message || "Failed to create course.");
    }
  };

  const uploadMedia = async (file, mediaType) => {
    const formData = new FormData();
    formData.append("media", file); // Attach the file
    formData.append("mediaType", mediaType); // Specify media type ("thumbnail" or "video")

    try {
      setDisable(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/media/upload-media",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },

          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            // Only update if there's a significant change
            if (progressRef.current !== percent) {
              progressRef.current = percent;
              setProgress(percent);
            }
          },
        }
      );
      setDisable(false);
      setProgress(0);
      // console.log(`Upload ${mediaType} Success:`, response.data.data);
      return response.data.data; // Contains { publicId, url }
    } catch (error) {
      setDisable(false);
      // console.error(`Upload ${mediaType} Failed:`, error.response.data);
      throw error;
    }
  };

  const handleFileChange = async (event, mediaType) => {
    const file = event.target.files[0]; // Get the selected file

    if (!file) {
      alert("No file found");
      return;
    }

    try {
      const mediaData = await uploadMedia(file, mediaType);
      console.log(`${mediaType} Uploaded:`, mediaData);

      // Store publicId & URL in state (for form submission)
      if (mediaType === "thumbnail") {
        setImgPreview(URL.createObjectURL(file));
        setThumbnail(
          JSON.stringify({
            publicId: mediaData.thumbnail.publicId,
            url: mediaData.thumbnail.url,
          })
        );
      } else if (mediaType === "video") {
        setVideoPreview(URL.createObjectURL(file));
        setVideoFile(
          JSON.stringify({
            publicId: mediaData.video.publicId,
            url: mediaData.video.url,
          })
        );
      }

      // console.log("Thumbnail:", thumbnail);
      // console.log("Video:", videoFile);
    } catch (error) {
      // console.error(`Error uploading ${mediaType}:`, error);
      toast.error(`Error while uploading ${mediaType}`);
    }
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

  

  const handleCategoryChange = (e) => {
    // console.log("Selected Category:", e.target.value);
    //console.log("Selected Index:", e.target.selectedIndex - 1);
    setSelectedCategoryIndex(e.target.selectedIndex - 1);
    setSelectedCategory(e.target.value);
    setSelectedSubcategory(""); // Reset subcategory when category changes
  };
  return (
    <div className="bg-gray-900  text-white p-6 rounded shadow-lg mx-auto w-full">
      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* title */}
        <div>
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
        </div>

         {/* subtitle */}
         <div>
          <label className="block font-bold">
            Course SubTitle ({SUBTITLE_LIMIT - subtitle?.length} chars left)
          </label>
          <input
            type="text"
            placeholder="Course subtitle"
            value={subtitle}
            onChange={(e) => {
              if (e.target.value.length <= SUBTITLE_LIMIT) {
                setSubtitle(e.target.value);
              }
            }}
            className="block w-full p-2 border rounded mb-2"
            required
          />
        </div>

        {/* category, sub-category, level */}
        <div className="flex flex-row justify-between gap-2 mb-2">
          {/* category */}
          <div className="w-full">
            <label className="block font-bold">Category</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="block w-full p-2 border rounded bg-gray-900 text-white"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* sub-category */}
          <div className="w-full">
            <label className="block font-bold">Sub-Category</label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="block w-full p-2 border rounded  bg-gray-900 text-white"
              required
            >
              <option value="" disabled>
                Select a sub-category
              </option>
              {categories[selectedCategoryIndex]?.subcategories.map(
                (subcategory, index) => (
                  <option key={index} value={subcategory.name}>
                    {subcategory.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* level */}
          <div className="w-full">
            <label className="block font-bold">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="block w-full p-2 border rounded  bg-gray-900 text-white"
              required
            >
              <option value="" disabled>
                Select a level
              </option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="AllLevels">All Levels</option>
            </select>
          </div>
        </div>

        
        {/* price, language, and certificate option */}
        <div className="flex flex-row justify-between gap-2">
          {/* price */}
          <div className="w-full">
            <label className="block font-bold">Price</label>
            <input
              type="number"
              placeholder="Course Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full p-2 border rounded"
              min="0"
              required
            />
          </div>

          {/* language */}
          <div className="w-full">
            <label className="block font-semibold text-white">Language</label>
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

          {/* certificate option */}
          <div className="w-full">
            <label className="block font-semibold text-white">
              Choose Certificate Type:
            </label>
            <select
              value={certificateOption}
              onChange={(e) => setCertificateOption(e.target.value)}
              className="w-full p-2 border rounded-md  bg-gray-900 text-white"
            >
              <option value="" disabled>
                Select certificate type
              </option>
              <option value="direct">Direct Certificate</option>
              <option value="quiz">Certificate After Quiz</option>
            </select>
          </div>
        </div>

        {/* Thumbnail */}
        <div>
        <label className="block font-bold mt-4">Upload Course Thumbnail:</label>
        <input
          type="file"
          name="media"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "thumbnail")}
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
        </div>

        {/* Video Preview */}
        <div>
        <label className="block font-bold mt-4">Add Course Preview:</label>
        <input
          type="file"
          name="media"
          accept="video/*"
          onChange={(e) => handleFileChange(e, "video")}
          className="w-full p-2 border rounded mb-3"
          ref={videoInputRef}
        />

        {videoPreview && (
          <video
            src={videoPreview}
            controls
            className="mt-2 h-50 object-cover rounded"
          />
        )}
        </div>

        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full mt-2">
            <div
              className="bg-blue-500 text-xs font-medium text-white text-center p-1 leading-none rounded-full"
              style={{ width: `${progress}%` }}
              ref={progressRef}
            >
              {progress}%
            </div>
          </div>
        )}

        {/* what you will learn */}
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

         {/* course includes  */}
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

        {/* Description */}
        <div>
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
        </div>
      
        <div className="flex justify-center gap-4">
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
