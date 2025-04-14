import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const CourseCurriculum = () => {
  const [sections, setSections] = useState([]);
  const [progress, setProgress] = useState(0);
  const [sectionTitle, setSectionTitle] = useState("");
  const [lectureTitle, setLectureTitle] = useState("");
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [newSection, setNewSection] = useState({ title: "" });
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const [editingLectureId, setEditingLectureId] = useState(null);
  const [editedLectureTitle, setEditedLectureTitle] = useState("");

  const [lectureForms, setLectureForms] = useState({
    title: "",
    videoFile: null,
    isFree: false,
  });
  const [showLectureForm, setShowLectureForm] = useState({});
  const [disable, setDisable] = useState(false);

  const videoInputRef = useRef(null);
  const progressRef = useRef(0);
  const navigate = useNavigate();

  const courseId = useSelector((state) => state.course.selectedCourse._id);

  const uploadMedia = async (file, mediaType) => {
    const formData = new FormData();
    formData.append("media", file); // Attach the file
    formData.append("mediaType", mediaType); // Specify media type ("thumbnail" or "video")

    try {
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
      setProgress(0);
      // console.log(`Upload ${mediaType} Success:`, response.data.data);
      alert(`${mediaType} Upload  Successfully`);
      return response.data.data; // Contains { publicId, url }
    } catch (error) {
      //console.error(`Upload ${mediaType} Failed:`, error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong! Please try again later.";
      throw errorMessage;
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
      //console.log(`${mediaType} Uploaded:`, mediaData);

      setLectureForms({
        ...lectureForms,
        videoFile: JSON.stringify({
          publicId: mediaData.video.publicId,
          url: mediaData.video.url,
          duration: mediaData.video.duration,
        }),
      });
    } catch (error) {
      console.error(`Error uploading ${mediaType}:`, error);
      alert(`Error while uploading ${mediaType}:`);
    }
  };

  const fetchSection = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/section//get-section-by-course/${courseId}`,
        {
          withCredentials: true,
        }
      );
      setSections(response.data.data);
      console.log(response);
    } catch (error) {
      console.log(error);
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
        "http://localhost:8000/api/v1/section/add-section",
        {
          title: sectionTitle,
          courseId,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response);
      fetchSection();
      // const sectionId = Date.now();
      // setSections([
      //   ...sections,
      //   {
      //     id: sectionId,
      //     title: newSection.title,
      //     lectures: [],
      //   },
      // ]);
      // setNewSection({ title: "" });
      setSectionTitle("");
      setShowNewSectionForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateSection = async (sectionId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/section/update-section/${sectionId}`,
        {
          title: editedTitle,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response);
      setEditingSectionId(null);
      setEditedTitle("");
      fetchSection();
    } catch (error) {
      console.log(error);
    }
  };
 
  const handleDeleteSection = async (sectionId) =>{
     try{ 
        const response = await axios.delete(
          `http://localhost:8000/api/v1/section/delete-section/${sectionId}`,
          {
            withCredentials:true,
          }
        )
        if(!response.data.data){
          alert(response.data.message);
          return;
        }
        fetchSection();
     }catch(error){
        console.log(error);
     }  
  }

  const addLecture = async (sectionId) => {
    if (!lectureForms.title || !videoInputRef.current?.files[0]) {
      alert("Please fill in all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("title", lectureForms.title);
    formData.append("videoFile", lectureForms.videoFile);
    formData.append("sectionId", sectionId);
    formData.append("isFree", lectureForms.isFree || false);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/lecture/add-lecture",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (videoInputRef.current) videoInputRef.current.value = "";
      setLectureForms({
        title: "",
        videoFile: null,
        sectionId: null,
        isFree: false,
      });
      fetchSection();
      setShowLectureForm({ ...showLectureForm, [sectionId]: false });
    } catch (error) {
      console.log(error);
    }
    // const form = lectureForms[sectionId];
    // if (!form?.title || !form?.videoFile) return;

    // setSections((prev) =>
    //   prev.map((section) =>
    //     section.id === sectionId
    //       ? {
    //           ...section,
    //           lectures: [
    //             ...section.lectures,
    //             {
    //               id: Date.now(),
    //               title: form.title,
    //               videoFile: form.videoFile.name,
    //             },
    //           ],
    //         }
    //       : section
    //   )
    // );

    // setLectureForms({ ...lectureForms, [sectionId]: {} });
    //setShowLectureForm({ ...showLectureForm, [sectionId]: false });
  };

  const handleUpdateLecture = async (lectureId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/lecture/update-lecture/${lectureId}`,
        {
          title:editedLectureTitle,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setEditingLectureId(null);
      setEditedLectureTitle("");
      fetchSection();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLecture = async (lectureId) =>{
    try{

      const response = await axios.delete(
        `http://localhost:8000/api/v1/lecture/delete-lecture/${lectureId}`,
        {
          withCredentials:true,
        }
      )
      fetchSection();
    }catch(error){
      console.log(error);
    }
  }
 

  return (
    <div className="max-w-3xl mx-auto p-4">
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
                          onClick={() => handleDeleteLecture(lecture._id)}
                        >
                          <FiTrash2 className="w-4 h-4 text-gray-500 cursor-pointer" />
                        </button>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                      onClick={()=>
                        navigate(`/lecturemanage/${lecture._id}`)
                      }
                      className="text-gl px-3 py-1 cursor-pointer rounded hover:bg-gray-600 text-blue-500">
                        +quiz
                      </button>
                    </div>
                  </div>

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
            {/* edit lecture form */}

            {/* Show Lecture Form only if toggled */}
            {showLectureForm[section._id] && (
              <div className="bg-gray-800 p-4 text-white rounded space-y-3">
                <p className="font-bold text-sm">Add New Lecture</p>
                <input
                  type="text"
                  placeholder="Lecture Title"
                  className="w-full p-2 border border-gray-400 focus:outline-none focus:border-white bg-gray-700 text-white"
                  value={lectureForms.title}
                  onChange={
                    (e) =>
                      setLectureForms({
                        ...lectureForms,
                        title: e.target.value,
                      })
                    // setLectureForms({
                    //   ...lectureForms,
                    //   [section.id]: {
                    //     ...lectureForms[section.id],
                    //     title: e.target.value,
                    //   },
                    // })
                  }
                  required  
                />
                <input
                  type="file"
                  name="videoFile"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "video")}
                  className="w-full p-2 border border-gray-400 bg-gray-700 text-white"
                  ref={videoInputRef}
                  required
                />
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

                {/* <input
                  type="file"
                  className="w-full p-2 border border-gray-400 bg-gray-700 text-white"
                  onChange={(e) =>
                    setLectureForms({
                      ...lectureForms,
                      [section.id]: {
                        ...lectureForms[section.id],
                        videoFile: e.target.files[0],
                      },
                    })
                  }
                /> */}
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
          <div className="flex flex-row gap-2 items-center">
            <label className="font-bold text-xl w-fit">New Section:</label>
            <input
              type="text"
              placeholder="Enter a Title"
              className="w-4/5 p-2 border border-gray-400 hover:border-white focus:outline-none focus:border-white bg-gray-600 text-white"
              value={sectionTitle}
              onChange={
                (e) => setSectionTitle(e.target.value)
                // setNewSection({ ...newSection, title: e.target.value })
              }
            />
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
