import {
  FaCode,
  FaBusinessTime,
  FaPaintBrush,
  FaBullhorn,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Categories = () => {
  const categoryData = [
    {
      name: "Programming",
      description: "Code your future with the best development courses.",
      icon: <FaCode size={36} className="text-blue-400" />,
    },
    {
      name: "Business",
      description: "Learn strategies and skills to grow your business.",
      icon: <FaBusinessTime size={36} className="text-green-400" />,
    },
    {
      name: "Design",
      description: "Unleash your creativity with top design tutorials.",
      icon: <FaPaintBrush size={36} className="text-pink-400" />,
    },
    {
      name: "Marketing",
      description: "Master the art of selling and brand building.",
      icon: <FaBullhorn size={36} className="text-yellow-400" />,
    },
    {
      name: "Finance",
      description:
        "Build wealth and understand the world of money and investments.",
      icon: <FaMoneyBillWave size={36} className="text-teal-400" />,
    },
  ];

  return (
    <section className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-10">
          Explore Course Categories
        </h2>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {categoryData.map((cat, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-800 rounded-2xl p-6 shadow-md h-full flex flex-col items-center text-center transition-transform transform hover:scale-105">
                {cat.icon}
                <h3 className="text-xl font-bold mt-4">{cat.name}</h3>
                <p className="text-sm text-gray-300 mt-2">{cat.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Categories;
