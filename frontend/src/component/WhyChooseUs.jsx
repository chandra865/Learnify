import { FaChalkboardTeacher, FaClock, FaCertificate } from "react-icons/fa";

const WhyChooseUs = () => {
  const benefits = [
    {
      title: "Expert Instructors",
      description: "Learn from industry professionals with real-world experience.",
      icon: <FaChalkboardTeacher size={40} className="text-blue-400" />,
    },
    {
      title: "Flexible Learning",
      description: "Study at your own pace, anytime, anywhere on any device.",
      icon: <FaClock size={40} className="text-yellow-400" />,
    },
    {
      title: "Certification",
      description: "Receive accredited certifications upon course completion.",
      icon: <FaCertificate size={40} className="text-green-400" />,
    },
  ];

  return (
    <section className="bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl text-white font-extrabold mb-12">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-white flex flex-col items-center text-center"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
