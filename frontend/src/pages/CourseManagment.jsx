import { useState } from "react";
import EditCourse from "./EditCourse";
// import PublishCourse from "./PublishCourse";
// import AddResources from "./AddResources";
import AddLecture from "./AddLecture";
// import CourseAnalytics from "./CourseAnalytics";
// import CommentsFeedback from "./CommentsFeedback";

const CourseManagment = () => {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");

  const lectures = [
    { id: 1, title: "Introduction to React" },
    { id: 2, title: "State Management" },
    { id: 3, title: "React Hooks" },
  ];

  const tabs = [
    { key: "edit", label: "Edit Course" },
    { key: "publish", label: "Publish Course" },
    { key: "resources", label: "Add Resources" },
    { key: "lecture", label: "Add Lecture" },
    { key: "analytics", label: "Course Analytics" },
    { key: "feedback", label: "Comments & Feedback" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "edit":
        return <EditCourse />;
      case "publish":
        return <PublishCourse />;
      case "resources":
        return <AddResources />;
      case "lecture":
        return <AddLecture />;
      case "analytics":
        return <CourseAnalytics />;
      case "feedback":
        return <CommentsFeedback />;
      default:
        return <EditCourse />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`p-2 mx-2 ${
                activeTab === tab.key
                  ? "border-b-2 border-blue-400"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        <div className="p-4 bg-gray-800 mt-4 rounded">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default CourseManagment;
