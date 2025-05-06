import { FaCode, FaBusinessTime, FaPaintBrush, FaBullhorn, FaMoneyBillWave } from "react-icons/fa";
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
      icon: <FaCode size={40} className="text-white" />, 
    },
    {
      name: "Business",
      description: "Learn strategies and skills to grow your business.",
      icon: <FaBusinessTime size={40} className="text-white" />, 
    },
    {
      name: "Design",
      description: "Unleash your creativity with top design tutorials.",
      icon: <FaPaintBrush size={40} className="text-white" />, 
    },
    {
      name: "Marketing",
      description: "Master the art of selling and brand building.",
      icon: <FaBullhorn size={40} className="text-white" />, 
    },
    {
      name: "Finance",
      description: "Build wealth and understand the world of money and investments.",
      icon:<FaMoneyBillWave size={40} className="text-white" />,
     
    }
    
  ];

  return (
    <section className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold mb-10">Explore Course Categories</h2>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
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
              <div className="bg-gray-700 rounded-xl p-6 shadow-lg h-full flex flex-col justify-between items-center text-center">
                {cat.icon}
                <h3 className="text-xl font-bold mt-4 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-200">{cat.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Categories;
