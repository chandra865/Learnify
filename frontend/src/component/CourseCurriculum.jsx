import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const CourseCurriculum = () => {
  const [sections, setSections] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const [sectionTitle, setSectionTitle] = useState("");
  const [lectureTitle, setLectureTitle] = useState("");
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [newSection, setNewSection] = useState({ title: "" });
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [showcontent, setShowContent] = useState();
  const [fileUpload, setFileUpload] = useState(false);

  const [editingLectureId, setEditingLectureId] = useState(null);
  const [editedLectureTitle, setEditedLectureTitle] = useState("");
  const [expandedLectureId, setExpandedLectureId] = useState(null);
  const [fileUploadFor, setFileUploadFor] = useState(null);

  const [lectureForms, setLectureForms] = useState({
    title: "",
    isFree: false,
  });
  const [showLectureForm, setShowLectureForm] = useState({});
  const [disable, setDisable] = useState(false);

  const videoInputRef = useRef(null);
  const progressRef = useRef(0);
  const navigate = useNavigate();

  const courseId = useSelector((state) => state.course.selectedCourse._id);


  const fetchSection = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/section/get-section-by-course/${courseId}`,
        {
          withCredentials: true,
        }
      );
      setSections(response.data.data);
      
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Error fetching course sections"
      );
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchSection();
    }
  }, [courseId]);

  const addSection = async () => {
    if (!sectionTitle) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/section/add-section`,
        {
          title: sectionTitle,
          courseId,
        },
        {
          withCredentials: true,
        }
      );

      fetchSection();
      setSectionTitle("");
      setShowNewSectionForm(false);
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Error adding section"
      );
    }
  };

  const handleUpdateSection = async (sectionId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/section/update-section/${sectionId}`,
        {
          title: editedTitle,
        },
        {
          withCredentials: true,
        }
      );

      setEditingSectionId(null);
      setEditedTitle("");
      fetchSection();
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Error updating section"
      );
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/section/delete-section/${sectionId}`,
        {
          withCredentials: true,
        }
      );
      fetchSection();
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Error deleting section"
      );
    }
  };

  const handleFileUpload = async (e, lectureId, sectionId) => {
    const file = e.target.files[0];
    let duration = 0;
    if (!file) {
      alert("file not found");
      return;
    }
    if (!file.type.startsWith("video/")) {
      videoInputRef.current.value = null;
      alert("Please select a valid video file");
      return;
    }

    const maxSizeInMB = 15; // set your limit (e.g. 10MB)
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      alert(`File size exceeds ${maxSizeInMB}MB limit.`);
      e.target.value = ""; // reset the input
      return;
    }
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src); // Clean up URL
      // duration in seconds
      duration = video.duration;
    };
    video.src = URL.createObjectURL(file);
    const originalFileName = file.name;
    const dashFileName = originalFileName.replace(/\s+/g, "-"); 
    try {
      // Step 1: Request signed URL from the backend
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/lecture/upload-signed-aws-url`,
        {
          courseId,
          sectionId,
          lectureId,
          contentType: file.type,
          fileName: dashFileName,
        },
        {
          withCredentials: true,
        }
      );
     
      const { uploadUrl, key } = response.data.data;
      
      // Step 2: Upload video to S3 using the signed URL
      const uploadRes = await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({
            ...prev,
            [lectureId]: progress,
          }));
        },
      });

      if (uploadRes.status === 200) {
        setUploadProgress((prev) => ({
          ...prev,
          [lectureId]: 0,
        }));
        toast.success("Video uploaded successfully!");
        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/v1/lecture/add-video-lecture`,
            {
              videoFileName: file.name,
              duration,
              courseId,
              sectionId,
              lectureId,
            },
            {
              withCredentials: true,
            }
          );
          console.log(response);
        } catch (error) {
          console.log(error);
        }
        setExpandedLectureId((prev) => (prev === lectureId ? null : lectureId));
        setFileUploadFor(false);
      } else {
        toast.error("Error uploading video!");
      }
      fetchSection();
    } catch (error) {
     toast.error(
        error?.response?.data.message || "Error uploading video" 
     );
    } finally {
      videoInputRef.current.value = null;
    }
  };

  const addLecture = async (sectionId) => {
    
    if (!lectureForms.title) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("title", lectureForms.title);
    formData.append("sectionId", sectionId);
    formData.append("isFree", lectureForms.isFree || false);
    try {
      const response = await axios.post(
       `${API_BASE_URL}/api/v1/lecture/add-lecture`,
        formData,
        {
          withCredentials: true,
        }
      );
      
      if (videoInputRef.current) videoInputRef.current.value = "";
      setLectureForms({
        title: "",
        isFree: false,
      });
      fetchSection();
      setShowLectureForm({ ...showLectureForm, [sectionId]: false });
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Error adding lecture"
      );
    }
  };

  const handleUpdateLecture = async (lectureId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/lecture/update-lecture/${lectureId}`,
        {
          title: editedLectureTitle,
        },
        {
          withCredentials: true,
        }
      );
      setEditingLectureId(null);
      setEditedLectureTitle("");
      fetchSection();
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Error updating lecture"
      );
    }
  };

  const handleDeleteLecture = async (lectureId, sectionId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/lecture/delete-lecture`,
        {
          params: {
            lectureId,
            sectionId,
            courseId,
          },
          withCredentials: true,
        }
      );
      fetchSection();
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Error deleting lecture"
      );
    }
  };

  const handleFileDelete = async (lectureId, sectionId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/lecture/delete-video`,
        {
          params: {
            lectureId,
            sectionId,
            courseId,
          },
          withCredentials: true,
        }
      );
      fetchSection();
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Error deleting video"
      );
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-4">
      {/*map on sections */}
      {sections.map((section, sectionIndex) => (
        <div
          key={section._id}
          className="border border-gray-300 rounded mb-4 bg-gray-700"
        >
          <div className="flex flex-col justify-between p-4 space-y-2">
            <div className="text-white">
              <span className="font-gl font-bold">
                Section {section.order}:
              </span>
              <span> {section.title}</span>
              <span className="mx-2">
                <button
                  onClick={() => {
                    setEditingSectionId(section._id);
                    setEditedTitle(section.title);
                  }}
                >
                  <FiEdit className="w-4 h-4 text-white cursor-pointer" />
                </button>
              </span>

              <span>
                <button onClick={() => handleDeleteSection(section._id)}>
                  <FiTrash2 className="w-4 h-4 text-white cursor-pointer" />
                </button>
              </span>
              {/* section edit form */}
              {editingSectionId === section._id && (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-400 rounded bg-gray-600 text-white focus:outline-none"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      onClick={() => {
                        setEditingSectionId(null);
                        setEditedTitle("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => handleUpdateSection(section._id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/*map on lecture */}
          <div className="ml-6 mr-2 p-4 flex flex-col space-y-4">
            {section.lectures.map((lecture, lectureIndex) => (
              <div
                key={lecture.id}
                className="bg-gray-900 text-white p-2 flex justify-between items-center border-1"
              >
                <div className="flex flex-col w-full space-y-2">
                  <div className="flex flex-row justify-between">
                    <div>
                      <span>Lecture {lecture.order}: </span>
                      <span className="font-semibold">{lecture.title}</span>
                      <span className="mx-2">
                        <button
                          onClick={() => {
                            setEditingLectureId(lecture._id);
                            setEditedLectureTitle(lecture.title);
                          }}
                        >
                          <FiEdit className="w-4 h-h text-gray-500 cursor-pointer" />
                        </button>
                      </span>

                      <span>
                        <button
                          onClick={() =>
                            handleDeleteLecture(lecture._id, section._id)
                          }
                        >
                          <FiTrash2 className="w-4 h-4 text-gray-500 cursor-pointer" />
                        </button>
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setExpandedLectureId((prev) =>
                              prev === lecture._id ? null : lecture._id
                            );
                            setFileUploadFor(null);
                          }}
                          className="text-gl px-3 py-1 cursor-pointer rounded hover:bg-gray-600 text-blue-500"
                        >
                          +Content
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedLectureId === lecture._id && (
                    <div className="bg-gray-700 p-6 flex flex-col justify-center items-center gap-2">
                      {lecture.videoFileName ? (
                        <div className="flex flex-row justify-between w-full bg-gray-800 p-2">
                          <p>{lecture.videoFileName}</p>
                          <button
                            onClick={() =>
                              handleFileDelete(lecture._id, section._id)
                            }
                            className="bg-blue-500 px-2"
                          >
                            x
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setFileUploadFor(lecture._id);
                            setExpandedLectureId((prev) =>
                              prev === lecture._id ? null : lecture._id
                            );
                          }}
                          className="text-gl px-3 py-1 cursor-pointer rounded hover:bg-gray-600 text-blue-500"
                        >
                          +upload video
                        </button>
                      )}

                      <button
                        onClick={() =>
                          window.open(`/lecturemanage/${lecture._id}`, "_blank")
                        }
                        className="text-gl px-3 py-1 cursor-pointer rounded hover:bg-gray-600 text-blue-500"
                      >
                        +quiz
                      </button>
                    </div>
                  )}

                  {fileUploadFor === lecture._id && (
                    <>
                    <input
                      type="file"
                      name="videoFile"
                      accept="video/*"
                      onChange={(e) =>
                        handleFileUpload(e, lecture._id, section._id)
                      }
                      className="w-full p-2 border border-gray-400 bg-gray-700 text-white"
                      ref={videoInputRef}
                    />
                    <p className="text-sm text-gray-400">Max size: 15MB</p>
                    </>
                  )}

                  {uploadProgress[lecture._id] > 0 && (
                    <div className="w-full bg-gray-200 rounded-full mt-2">
                      <div
                        className="bg-blue-500 text-xs font-medium text-white text-center p-1 leading-none rounded-full"
                        style={{ width: `${uploadProgress[lecture._id]}%` }}
                      >
                        {uploadProgress[lecture._id]}%
                      </div>
                    </div>
                  )}

                  {/* lecture edit form */}
                  {editingLectureId === lecture._id && (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-400 rounded bg-gray-600 text-white focus:outline-none"
                        value={editedLectureTitle}
                        onChange={(e) => setEditedLectureTitle(e.target.value)}
                        required
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                          onClick={() => {
                            setEditingLectureId(null);
                            setEditedLectureTitle("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                          onClick={() => handleUpdateLecture(lecture._id)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Show Lecture Form only if toggled */}
            {showLectureForm[section._id] && (
              <div className="bg-gray-800 p-4 text-white rounded space-y-3">
                <p className="font-bold text-sm">Add New Lecture</p>
                <input
                  type="text"
                  placeholder="Lecture Title"
                  className="w-full p-2 border border-gray-400 focus:outline-none focus:border-white bg-gray-700 text-white"
                  value={lectureForms.title}
                  onChange={(e) =>
                    setLectureForms({
                      ...lectureForms,
                      title: e.target.value,
                    })
                  }
                  required
                  maxLength={30}
                />
                {/* Character counter */}
                <p className="text-sm text-gray-400">
                  {lectureForms.title.length}/30 characters
                </p>

                {/* Minimum length warning */}
                {lectureForms.title.length > 0 &&
                  lectureForms.title.length < 5 && (
                    <p className="text-sm text-red-400">
                      Title must be at least 5 characters long.
                    </p>
                  )}
                {/* Checkbox for Free/Paid Lecture */}
                <label className="flex items-center cursor-pointer mb-3">
                  <span className="mr-2 text-white">Mark as Free Lecture</span>
                  <div
                    className={`relative w-12 h-6 rounded-full transition ${
                      lectureForms.isFree ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    onClick={() =>
                      setLectureForms((prev) => ({
                        ...prev,
                        isFree: !prev.isFree,
                      }))
                    }
                  >
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full shadow-md top-0.5 transition-all ${
                        lectureForms.isFree ? "left-7" : "left-0.5"
                      }`}
                    ></div>
                  </div>
                </label>

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 text-gl bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                    onClick={() =>
                      setShowLectureForm({
                        ...showLectureForm,
                        [section._id]: false,
                      })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white text-gl cursor-pointer"
                    onClick={() => addLecture(section._id)}
                  >
                    Add Lecture
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="text-gl rounded text-white px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 w-fit ml-4 mb-4"
            onClick={() =>
              setShowLectureForm((prev) => ({
                ...prev,
                [section._id]: !prev[section._id],
              }))
            }
          >
            + Curriculum Item
          </button>
        </div>
      ))}

      {/* New Section Form */}
      {showNewSectionForm ? (
        <div className="bg-gray-700 text-white p-6 space-y-3 mb-4">
          <div className="flex flex-row gap-2">
            <label className=" w-1/4 font-bold text-xl">New Section:</label>
            <div className=" w-full">
              <input
                type="text"
                placeholder="Enter a Title"
                className="w-full p-2 border border-gray-400 hover:border-white focus:outline-none focus:border-white bg-gray-600 text-white"
                value={sectionTitle}
                onChange={
                  (e) => setSectionTitle(e.target.value)
                  // setNewSection({ ...newSection, title: e.target.value })
                }
                maxLength={30}
              />

              {/* Live character counter */}
              <p className="text-sm text-gray-300 mt-1">
                {sectionTitle.length}/30 characters
              </p>

              {/* Optional minimum length warning */}
              {sectionTitle.length > 0 && sectionTitle.length < 5 && (
                <p className="text-sm text-red-400 mt-1">
                  Section title must be at least 5 characters long.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="text-gl bg-blue-500 px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
              onClick={() => setShowNewSectionForm(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white text-gl px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
              onClick={addSection}
            >
              Add Section
            </button>
          </div>
        </div>
      ) : (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          onClick={() => setShowNewSectionForm(true)}
        >
          + Section
        </button>
      )}
    </div>
  );
};

export default CourseCurriculum;
