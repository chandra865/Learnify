import { useState } from "react";
import { BadgeCheck, BookOpen, Heart, Settings, Star } from "lucide-react";

const StudentProfile =()=> {
  const [student] = useState({
    name: "John Doe",
    username: "@johndoe",
    bio: "Passionate learner | Web Developer | Tech Enthusiast",
    profilePic: "https://via.placeholder.com/100",
    enrolledCourses: [
      { id: 1, title: "React for Beginners", progress: 60 },
      { id: 2, title: "Advanced JavaScript", progress: 30 },
    ],
    certifications: ["React Basics", "JavaScript Mastery"],
    wishlist: ["Node.js Crash Course", "Tailwind CSS Mastery"],
    reviews: [{ course: "React for Beginners", rating: 5 }],
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Profile Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <img
          src={student.profilePic}
          alt="Profile"
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h2 className="text-xl font-semibold">{student.name}</h2>
          <p className="text-gray-500">{student.username}</p>
          <p className="text-gray-600 text-sm">{student.bio}</p>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="mt-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" /> Enrolled Courses
        </h3>
        {student.enrolledCourses.map((course) => (
          <div key={course.id} className="bg-gray-100 p-3 mt-2 rounded">
            <p className="font-medium">{course.title}</p>
            <p className="text-sm text-gray-600">
              Progress: {course.progress}%
            </p>
          </div>
        ))}
      </div>

      {/* Achievements & Certifications */}
      <div className="mt-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-green-500" /> Certifications
        </h3>
        <ul className="list-disc pl-6 text-gray-700">
          {student.certifications.map((cert, index) => (
            <li key={index} className="mt-1">{cert}</li>
          ))}
        </ul>
      </div>

      {/* Wishlist */}
      <div className="mt-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" /> Wishlist
        </h3>
        <ul className="list-disc pl-6 text-gray-700">
          {student.wishlist.map((course, index) => (
            <li key={index} className="mt-1">{course}</li>
          ))}
        </ul>
      </div>

      {/* Reviews */}
      <div className="mt-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" /> Reviews
        </h3>
        {student.reviews.map((review, index) => (
          <div key={index} className="bg-gray-100 p-3 mt-2 rounded">
            <p className="font-medium">{review.course}</p>
            <p className="text-sm text-gray-600">Rating: ⭐ {review.rating}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="mt-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" /> Settings
        </h3>
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Manage Profile
        </button>
      </div>
    </div>
  );
}

export default StudentProfile;