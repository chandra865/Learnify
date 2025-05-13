import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useSelector } from "react-redux";
import StarRating from "./StarRating";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Testimonials = () => {
  const courseId = useSelector((state) => state.course.selectedCourse._id);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/review/get-review/${courseId}`,
          { withCredentials: true }
        );
        setReviews(response.data.data);
      } catch (error) {
        toast.error(
          error?.response?.data.message || "Error fetching reviews"
        );
      }
    };
    fetchReviews();
  }, [courseId]);

  return (
    <div className="max-w-5xl my-20 w-[700px]">
      <h3 className="text-2xl font-bold mb-8">Testimonials</h3>

      {reviews?.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1} // On mobile, show 1 review
          breakpoints={{
            640: { slidesPerView: 1 }, // Small screens
            768: { slidesPerView: 2 }, // Tablets
            1024: { slidesPerView: 3 }, // Desktop (3 reviews at a time)
          }}
          navigation={{ clickable: true }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          className="w-full"
        >
          {reviews.map(({ _id, userId, rating, comment }) => (
            <SwiperSlide key={_id}>
              <div className="p-6 bg-gray-800  h-[200px] w-[200] text-center flex flex-col ">
                {/* User Info */}
                <div className="flex items-center gap-2">
                  {/* User Avatar */}
                  <img
                    src={userId?.profilePicture?.url ||"https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                  />

                  {/* User Name & Rating */}
                  <div className="text-white text-left">
                    <span className="text-sm font-bold">
                      {userId?.name}
                    </span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-yellow-400 text-xl ${
                            i < rating ? "" : "opacity-30"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Comment */}
                <p className="italic mt-4 text-left text-sm">"{comment}"</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-gray-400">No reviews yet.</p>
      )}
    </div>
  );
};

export default Testimonials;
