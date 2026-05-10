import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/slice/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { persistor } from "../store/store.js";
import axios from "axios";
import { userBaseUrl } from "../utils/endpoints";
import Loading from "../component/Loading";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await axios.get(`${userBaseUrl}/logout`, {
          withCredentials: true,
        });
        toast.success(response.data.message);
      } catch (error) {
        console.error("Logout error:", error);
        // We still proceed with local logout even if server call fails
      } finally {
        // 1. Reset all state slices (handled by rootReducer + extraReducers)
        dispatch(logout());

        // 2. Clear Redux-Persist & LocalStorage explicitly
        await persistor.purge();
        localStorage.removeItem("persist:root");
        localStorage.clear();
        sessionStorage.clear();

        // 3. Smooth transition to home
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 800);
      }
    };

    logoutUser();
  }, [dispatch, navigate]);

  return <Loading />;
};

export default Logout;
