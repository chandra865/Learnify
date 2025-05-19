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
import LectureForm from "./pages/LectureForm";
import EditCourse from "./pages/EditCourse";

import EditProfile from "./pages/EditProfile";
import Earning from "./pages/Earning";
import Footer from "./component/Footer";
import SearchPage from "./pages/SearchPage";

import CourseLandingPage from "./pages/CourseLandingPage";
import Cart from "./component/Cart";
import Payment from "./component/Payment";
import CustomVideoPlayer from "./component/CustomVideoPlayer";
import CourseCurriculum from "./component/CourseCurriculum";
import LectureManage from "./component/LectureManage";
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";
import CoursePlayer from "./pages/CoursePlayer";
import { useLocation } from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import QuizPage from "./pages/QuizPage";
import Order from "./component/Order";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
function App() {
  const location = useLocation();
  const hiddenNavbarPaths = ["/course-watch",  "/quiz"];
  const shouldHideNavbar = hiddenNavbarPaths.some((path) => location.pathname.startsWith(path));
 
  const hiddenFooterPaths = ["/dashboard", "/login", "/register", "/course", "/course-watch", "/quiz", "/logout", "/forgot-password", "/reset-password"];
  const shouldHideFooter = hiddenFooterPaths.some((path) => location.pathname.startsWith(path));
  const dispatch = useDispatch();

  useEffect(()=>{

    const fetchData = async () =>{
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/user/getuser`,
          {
            withCredentials: true, // Include credentials if needed
          }
        );
        //console.log(response.data); // Log only response data
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
    {!shouldHideNavbar && <Navbar />}
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/course/enroll/:course_id" element={<CourseLandingPage/>}/>
      <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<UserProfile/>} />
          <Route path="enrolled" element={<EnrolledCourses />} />
          <Route path="created" element={<CreatedCourses />} />
            
          <Route path="cart" element={<Cart/>}/>
          <Route path="order" element={<Order/>}/>
          <Route path="create" element={<CreateCourse />} />
          
          <Route path="Earning" element={<Earning/>}/>
          
      </Route>

      <Route path="/payment/:userId/:courseId" element={<Payment/>} />
      <Route path="/videoplayer" element={<CustomVideoPlayer  src="
      https://cdn.pixabay.com/video/2020/10/19/52849-473336269_large.mp4" 
        poster="https://example.com/thumbnail.jpg" />} />
      <Route path="/add-lecture/:courseId" element={<LectureForm/>} />
      <Route path="/edit-profile" element={<EditProfile/>}/>
      <Route path="/search" element={<SearchPage/>} />
      <Route path="/course-watch/:courseId/:sectionId/:lectureId" element = {<CoursePlayer/>}/>
      <Route path="/curri" element={<CourseCurriculum/>}/>
      <Route path="/lecturemanage/:lectureId" element={<LectureManage/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/quiz/:quizId" element={<QuizPage />} />
      <Route path="/logout" element={<Logout/>} />

    </Routes>
    { !shouldHideFooter && <Footer /> }
    {/* Toast Notification Container */}
    <ToastContainer position="bottom-right" autoClose={3000} />
   
    </>
  )
}

export default App;
