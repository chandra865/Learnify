const Hero = () => {
    return (
      <section className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          {/* Left Side - Text Content */}
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Learn Anytime, <span className="text-blue-500">Anywhere</span>
            </h1>
            <p className="text-lg text-gray-300">
              Upskill yourself with our expert-led courses in technology, business, and more.
            </p>
  
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <a
                href="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
              >
                Get Started
              </a>
              <a
                href="/courses"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
              >
                Explore Courses
              </a>
            </div>
          </div>
  
          {/* Right Side - Image */}
          <div className="md:w-1/2 flex justify-center mt-10 ">
            <img
              src="src/assets/lms-hero.png"
              alt="LMS Hero"
              className="w-full"
            />
          </div>
        </div>
      </section>
    );
  };
  
  export default Hero;
  