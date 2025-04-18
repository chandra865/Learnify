import { Routes, Route } from "react-router-dom"
import Navbar from "./pages/Navbar"
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { use, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "./store/slice/userSlice";
import CourseInfo from "./pages/CourseLandingPage";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import EnrolledCourses from "./pages/EnrolledCourses";
import CreatedCourses from "./pages/CreatedCourses";
import CreateCourse from "./pages/CreateCourse";
import Logout from "./pages/Logout";
import AddLecture from "./pages/AddLecture";
import LectureForm from "./pages/LectureForm";
import MediaPlayer from "./pages/MediaPlayer";
import EditCourse from "./pages/EditCourse";
import SetProfile from "./component/SetProfile";
import EditProfile from "./pages/EditProfile";
import Earning from "./pages/Earning";
import Footer from "./component/Footer";
import SearchPage from "./pages/SearchPage";
import CourseManagment from "./pages/CourseManagment";
import CourseLandingPage from "./pages/CourseLandingPage";
import Cart from "./component/Cart";
import Payment from "./component/Payment";
import CustomVideoPlayer from "./component/CustomVideoPlayer";
import CourseCurriculum from "./component/CourseCurriculum";
import LectureManage from "./component/LectureManage";

function App() {
  const dispatch = useDispatch();
  useEffect(()=>{

    const fetchData = async () =>{
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/user/getuser",
          {
            withCredentials: true, // Include credentials if needed
          }
        );
        console.log(response.data); // Log only response data
        // console.log(response.data.data.user);
        dispatch(login(response.data.data));
      } catch (error) {
        console.error(error.response?.data || "Request failed"); // Handle errors properly
      }
    }

    fetchData();

  },[])
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/course/enroll/:course_id" element={<CourseLandingPage/>}/>
      <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<SetProfile/>} />
          <Route path="enrolled" element={<EnrolledCourses />} />
          <Route path="created" element={<CreatedCourses />} >
            <Route path="course-managment/:courseId" element={<CourseManagment/>} />
          </Route>
          <Route path="cart" element={<Cart/>}/>
          <Route path="create" element={<CreateCourse />} />
          <Route path="AddLectures" element={<AddLecture/>} />
          <Route path="Earning" element={<Earning/>}/>
          
      </Route>

      <Route path="/payment/:userId/:courseId" element={<Payment/>} />
      <Route path="/videoplayer" element={<CustomVideoPlayer  src="
      https://cdn.pixabay.com/video/2020/10/19/52849-473336269_large.mp4" 
        poster="https://example.com/thumbnail.jpg" />} />
      <Route path="/add-lecture/:courseId" element={<LectureForm/>} />
      <Route path="/media-player/:courseId/:index" element={<MediaPlayer />} />
      <Route path="/edit-profile" element={<EditProfile/>}/>
      <Route path="/search" element={<SearchPage/>} />
      <Route path="/curri" element={<CourseCurriculum/>}/>
      <Route path="/lecturemanage/:lectureId" element={<LectureManage/>}/>
      <Route path="/logout" element={<Logout/>} />

    </Routes>
    {/* { !location.pathname.startsWith("/dashboard") && <Footer /> } */}
    {/* Toast Notification Container */}
    <ToastContainer position="top-right" autoClose={3000} />
   
    </>
  )
}

export default App;
