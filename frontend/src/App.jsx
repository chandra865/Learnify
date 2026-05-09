import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./pages/Navbar"
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/slice/userSlice";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import EnrolledCourses from "./pages/EnrolledCourses";
import CreatedCourses from "./pages/CreatedCourses";
import CreateCourse from "./pages/CreateCourse";
import Logout from "./pages/Logout";
import LectureForm from "./pages/LectureForm";

import EditProfile from "./pages/EditProfile";
import Earning from "./pages/Earning";
import Footer from "./component/Footer";
import SearchPage from "./pages/SearchPage";

import CourseLandingPage from "./pages/CourseLandingPage";
import Cart from "./component/Cart";
import Payment from "./component/Payment";
import CourseCurriculum from "./component/CourseCurriculum";
import LectureManage from "./component/LectureManage";
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";
import CoursePlayer from "./pages/CoursePlayer";
import { useLocation } from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import QuizPage from "./pages/QuizPage";
import Order from "./component/Order";
import { setCart } from "./store/slice/cartSlice";
import { userBaseUrl, cartBaseUrl } from "./utils/endpoints";

const ProtectedRoute = ({ children }) => {
  const { status } = useSelector((state) => state.user);
  if (!status) return <Navigate to="/login" replace />;
  return children;
};
function App() {
  const location = useLocation();
  const hiddenNavbarPaths = ["/course-watch", "/quiz"];
  const shouldHideNavbar = hiddenNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const hiddenFooterPaths = [
    "/dashboard",
    "/login",
    "/register",
    "/course",
    "/course-watch",
    "/quiz",
    "/logout",
    "/forgot-password",
    "/reset-password",
  ];
  const shouldHideFooter = hiddenFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${userBaseUrl}/get-user`, {
          withCredentials: true,
        });
        const userData = response.data.data;
        dispatch(login(userData));

        // Fetch cart if user is logged in
        if (userData && userData._id) {
          const cartResponse = await axios.get(
            `${cartBaseUrl}/${userData._id}`,
            { withCredentials: true }
          );
          dispatch(setCart(cartResponse.data.data));
        }
      } catch {
        // console.error("Error fetching initial data");
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <>
    {!shouldHideNavbar && <Navbar />}
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/course/enroll/:course_id" element={<CourseLandingPage/>}/>
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
          <Route path="profile" element={<UserProfile/>} />
          <Route path="enrolled" element={<EnrolledCourses />} />
          <Route path="created" element={<CreatedCourses />} />
            
          <Route path="cart" element={<Cart/>}/>
          <Route path="order" element={<Order/>}/>
          <Route path="create" element={<CreateCourse />} />
          
          <Route path="earning" element={<Earning/>}/>
          
      </Route>

      <Route 
        path="/payment/:userId/:courseId" 
        element={
          <ProtectedRoute>
            <Payment/>
          </ProtectedRoute>
        } 
      />
      <Route path="/add-lecture/:courseId" element={<LectureForm/>} />
      <Route 
        path="/edit-profile" 
        element={
          <ProtectedRoute>
            <EditProfile/>
          </ProtectedRoute>
        }
      />
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
