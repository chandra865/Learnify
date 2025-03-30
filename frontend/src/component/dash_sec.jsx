import { useState } from "react";

const Dashboard = () => {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");

  const lectures = [
    { id: 1, title: "Introduction to React" },
    { id: 2, title: "State Management" },
    { id: 3, title: "React Hooks" },
  ];

  const tabs = ["Edit Course", "Publish Course", "Add Resources", "Add Lecture", "Course Analytics", "Comments & Feedback"];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-1/5 p-4 bg-gray-800">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav>
          <button className="block w-full text-left py-2 px-4 hover:bg-gray-700 rounded">Created Lectures</button>
        </nav>
      </aside>

      {/* Lecture List & Details */}
      <main className="flex-1 p-6">
        {!selectedLecture ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">Select a Lecture</h2>
            <ul>
              {lectures.map((lecture) => (
                <li
                  key={lecture.id}
                  className="p-3 bg-gray-800 rounded mb-2 cursor-pointer hover:bg-gray-700"
                  onClick={() => setSelectedLecture(lecture)}
                >
                  {lecture.title}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">{selectedLecture.title}</h2>
            <div className="flex border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`p-2 mx-2 ${activeTab === tab ? "border-b-2 border-blue-400" : "text-gray-400"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-4 bg-gray-800 mt-4 rounded">
              {activeTab === "Edit Course" && <p>Edit course details here...</p>}
              {activeTab === "Publish Course" && <p>Manage course publication...</p>}
              {activeTab === "Add Resources" && <p>Add quizzes, assignments, and more...</p>}
              {activeTab === "Add Lecture" && <p>Main lecture creation area...</p>}
              {activeTab === "Course Analytics" && <p>View course analytics and insights...</p>}
              {activeTab === "Comments & Feedback" && <p>Review and respond to feedback...</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;


  <div>
        {courses.length === 0 ? (
          <p className="text-center text-gray-500">No courses found.</p>
        ) : (
          courses.map((course) => (
            <Link
              to={`/dashboard/created/course-managment/${course._id}`}             
            >
            <div className="flex py-4 px-2 border-b-2 text-white hover:bg-gray-700 transform transition duration-300 hover:scale-102">
              {/* Course Image */}
              <div className="w-70 h-40 flex-shrink-0">
                <img
                  src={course.thumbnail?.url}
                  alt={course.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Course Details */}
              <div className="flex flex-row w-full ">
                <div className="w-full px-4">
                 
                  <h1 className="text-xl font-extrabold">
                    {course.title}
                  </h1>
                    
                  <div>
                    <p className="text-white">{course.description}</p>
                    <p className="text-white-500 text-sm my-1">
                      {course?.instructor?.name || "Unknown Instructor"}
                    </p>

                    {/* Rating */}
                    <StarRating rating={course.averageRating || 0} />

                    {/* Course Meta Info */}
                    <p className="text-white-500 text-sm my-1">
                      {course.lecture?.length || 0} Lectures
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="px-10 text-xl font-extrabold ">
                    ₹{course.price}
                  </p>
                </div>
              </div>
            </div>
            </Link>
          ))
        )}
      </div>