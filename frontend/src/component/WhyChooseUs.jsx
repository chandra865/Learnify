import { FaChalkboardTeacher, FaClock, FaCertificate } from "react-icons/fa";

const WhyChooseUs = () => {
  const benefits = [
    {
      title: "Expert Instructors",
      description: "Learn from industry professionals with real-world experience.",
      icon: <FaChalkboardTeacher className="text-white" size={40} />,
    },
    {
      title: "Flexible Learning",
      description: "Study at your own pace, anytime, anywhere on any device.",
      icon: <FaClock className="text-white" size={40} />,
    },
    {
      title: "Certification",
      description: "Receive accredited certifications upon course completion.",
      icon: <FaCertificate className="text-white" size={40} />,
    },
  ];

  return (
    <section className="bg-gray-900 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl text-white font-extrabold mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gray-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-4 flex justify-center">{benefit.icon}</div>
              <h3 className="text-xl font-bold  mb-2 text-white">{benefit.title}</h3>
              <p className="text-white text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
