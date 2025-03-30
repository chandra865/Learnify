import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateCourse = () => {
  const defaultPreview =
    "https://dummyimage.com/300x200/cccccc/000000&text=thubmnail+preview";
  const defaultVideoPreview =
    "https://dummyimage.com/300x200/cccccc/000000&text=course+preview";

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

  const [level, setLevel] = useState("");
  const [price, setPrice] = useState(0);
  const [language, setLanguage] = useState("");
  const [certificateOption, setCertificateOption] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [imgPreview, setImgPreview] = useState(defaultPreview);
  const [videoPreview, setVideoPreview] = useState(defaultVideoPreview);
  const [videoFile, setVideoFile] = useState(null);

  const [whatYouWillLearn, setWhatYouWillLearn] = useState([""]);
  const [courseIncludes, setCourseIncludes] = useState([""]);
  
  
  const [disable, setDisable] = useState(false);
  const [progress, setProgress] = useState(0);
 
  const [uploadInputImg, setUploadInputImg] = useState(false);
  const [uploadInputVideo, setUploadInputVideo] = useState(false);

  const progressRef = useRef(0);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const TITLE_LIMIT = 50;
  const SUBTITLE_LIMIT = 120;
  const DESCRIPTION_LIMIT = 150;
  const CATEGORY_LIMIT = 20;

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
  }, []);

  const handleSubmit = async (e) => {
    setDisable(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("category", selectedCategory);
      formData.append("subcategory", selectedSubcategory);
      formData.append("level", level);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("language", language);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      formData.append("whatYouWillLearn", whatYouWillLearn.join(","));
      formData.append("courseIncludes", courseIncludes.join(","));
      formData.append("videoFile", videoFile);
      formData.append("certificateOption", certificateOption);
      const response = await axios.post(
        "http://localhost:8000/api/v1/course/Add-course",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(response.data.data);
      toast.success(response?.data?.message || "Course Created Successfully");

      setTitle("");
      setDescription("");
      setSubtitle("");
      setSelectedCategory("");
      setSelectedSubcategory("");
      setLevel("");
      setPrice(0);
      setThumbnail(null);
      setWhatYouWillLearn([""]);
      setCourseIncludes([""]);
      setLanguage("");
      setVideoFile(null);
      setDisable(false);
      setImgPreview(null);
      setVideoPreview(null);
      setProgress(0);
      setCertificateOption("");

      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    } catch (error) {
      setDisable(false);
      console.error("Error creating course", error);
      // alert("Failed to create course.");
      toast.error(
        error.response?.data?.message ||
          "Some error occur while creating course"
      );
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

  const uploadMedia = async (file, mediaType) => {
    const formData = new FormData();
    formData.append("media", file); // Attach the file
    formData.append("mediaType", mediaType); // Specify media type ("thumbnail" or "video")

    try {
      setDisable(true);
      if (mediaType === "thumbnail") {
        setUploadInputImg(true);
      } else if (mediaType === "video") {
        setUploadInputVideo(true);
      }

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
      setUploadInputImg(false);
      setUploadInputVideo(false);
      setProgress(0);
      // console.log(`Upload ${mediaType} Success:`, response.data.data);
      toast.success(`${mediaType} Uploaded  Successfully`);
      setProgress(0);
      return response.data.data; // Contains { publicId, url }
    } catch (error) {
      // console.error(`Upload ${mediaType} Failed:`, error.response.data);
      throw error;
    }
  };

  const handleFileChange = async (event, mediaType) => {
    const file = event.target.files[0]; // Get the selected file

    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      const mediaData = await uploadMedia(file, mediaType);
      // console.log(`${mediaType} Uploaded:`, mediaData);

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
            duration: mediaData.video.duration,
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

  const handleCategoryChange = (e) => {
    // console.log("Selected Category:", e.target.value);
    //console.log("Selected Index:", e.target.selectedIndex - 1);
    setSelectedCategoryIndex(e.target.selectedIndex - 1);
    setSelectedCategory(e.target.value);
    setSelectedSubcategory(""); // Reset subcategory when category changes
  };

  return (
    <div className="bg-gray-900  text-white p-6 rounded shadow-lg ">
      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* title */}
        <div>
          <label className="block font-bold">
            Course Title ({TITLE_LIMIT - title.length} chars left)
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
            Course SubTitle ({SUBTITLE_LIMIT - subtitle.length} chars left)
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

        <div className="flex flex-row gap-6">
          {/* thumbnail */}
          <div>
            <label className="block font-bold mt-4">
              Upload Course Thumbnail:
            </label>
            <div>
              <div>
                {imgPreview && (
                  <img
                    src={imgPreview}
                    alt="Thumbnail Preview"
                    className="w-80 h-50 mr-4 object-cover rounded"
                  />
                )}
              </div>
              <div className="mt-2">
                {!uploadInputImg && (
                  <input
                    type="file"
                    name="media"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "thumbnail")}
                    className="p-2 border rounded mb-2"
                    ref={imageInputRef}
                  />
                )}

                {!uploadInputVideo && progress > 0 && (
                  <div className="w-100 bg-gray-200 rounded-full mt-2">
                    <div
                      className="bg-blue-500 text-xs font-medium text-white text-center p-1 leading-none rounded-full"
                      style={{ width: `${progress}%` }}
                      ref={progressRef}
                    >
                      {progress}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* preview */}
          <div>
            <label className="block font-bold mt-4">Add Course Preview:</label>
            <div className="">
              <div>
                {videoPreview && (
                  <video
                    src={videoPreview}
                    controls
                    className="w-80 h-50 mr-4 object-cover rounded"
                  />
                )}
              </div>

              <div className="mt-2">
                {!uploadInputVideo && (
                  <input
                    type="file"
                    name="media"
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, "video")}
                    className="w-full p-2 border rounded mb-3"
                    ref={videoInputRef}
                  />
                )}

                {!uploadInputImg && progress > 0 && (
                  <div className="w-100 bg-gray-200 rounded-full mt-2">
                    <div
                      className="bg-blue-500 text-xs font-medium text-white text-center p-1 leading-none rounded-full"
                      style={{ width: `${progress}%` }}
                      ref={progressRef}
                    >
                      {progress}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* what you will learn and course includes */}
        <div>
          <label className="block font-semibold text-white mt-4">
            What You Will Learn
          </label>
          {whatYouWillLearn.map((item, index) => (
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

        {/* course includes */}
        <div>
          <label className="block font-semibold text-white mt-4">
            Course Includes
          </label>
          {courseIncludes.map((item, index) => (
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

        {/* description */}
        <div>
          <label className="block font-bold">
            Course Description ({DESCRIPTION_LIMIT - description.length} chars
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

        {/* submit button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`${
              disable
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            } text-white p-2 rounded mx-auto mt-4 `}
            disabled={disable}
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
