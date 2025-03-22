import { useState } from "react";

const lectures = [
  { id: 1, title: "Introduction", duration: "5:30" },
  { id: 2, title: "Setting Up Environment", duration: "8:15" },
  { id: 3, title: "Basic Concepts", duration: "12:45" },
  { id: 4, title: "Advanced Techniques", duration: "15:20" }
];

export default function LectureView() {
  const [notes, setNotes] = useState("");
  const [comments, setComments] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(lectures[0]);

  const handleCommentSubmit = () => {
    if (comments.trim()) {
      setAllComments([...allComments, comments]);
      setComments("");
    }
  };

  return (
    <div className="flex max-w-6xl mx-auto p-6 gap-6">
      {/* Left: Video and Details */}
      <div className="w-2/3">
        <video className="w-full rounded-xl shadow-md" controls>
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <h1 className="text-2xl font-bold mt-4">{currentLecture.title}</h1>
        <p className="text-gray-600 mb-4">Duration: {currentLecture.duration}</p>

        {/* Notes Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Your Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here..."
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Comments Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">Comments</h2>
          <input
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add a comment..."
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
          />
          <button onClick={handleCommentSubmit} className="mt-2 bg-blue-500 text-white p-2 rounded-lg">Post</button>
          <ul className="mt-4 space-y-2">
            {allComments.map((comment, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded-lg">{comment}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: Lecture List */}
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3">Lecture List</h2>
        <ul className="space-y-2">
          {lectures.map((lecture) => (
            <li
              key={lecture.id}
              onClick={() => setCurrentLecture(lecture)}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition ${
                  currentLecture.id === lecture.id ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-200"
              }`}
            >
              <span>{lecture.title}</span>
              <span className="text-sm">{lecture.duration}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
