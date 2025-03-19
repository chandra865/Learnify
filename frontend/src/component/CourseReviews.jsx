import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import StarRating from "./StarRating";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Testimonials = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/review/get-review/${courseId}`,
          { withCredentials: true }
        );
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [courseId]);

  return (
    <div className="max-w-5xl mt-20 w-[700px]">
      <h3 className="text-3xl font-bold text-center mb-8">Testimonials</h3>

      {reviews?.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
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
              <div className="p-6  bg-gray-700 rounded-xl shadow-lg h-[300px]  border-gray-200 text-center">
                
                {/* User Info */}
                <div className="flex flex-col justify-center items-center w-full my-2">
                  <img
                    src={userId?.profilePicture?.url || "/default-avatar.png"}
                    alt="User"
                    className="w-15 h-15 rounded-full border-2 border-white-400"
                  />

                  <div className="text-white my-2">
                    <p className="font-semibold">{userId?.name}</p>
                    {/* <p className="text-sm">{userId?.designation || "Student"}</p> */}
                  </div>
                </div>
                {/* Star Rating */}
                {/* <StarRating rating={rating|| 0} /> */}
                <div className="flex justify-center mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-yellow-400 text-xl ${i < rating ? "" : "opacity-30"}`}>
                      ★
                    </span>
                  ))}
                </div>

                

                {/* Review Comment */}
                <p className="text-lg mb-4 italic">"{comment}"</p>

                
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
