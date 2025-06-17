import heroImage from "../assets/lms-hero.png"; // Adjust the path as necessary
const Hero = () => {
  return (
    <section className="bg-gray-900 text-white py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Learn Anytime, <span className="text-blue-500">Anywhere</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300">
            Upskill yourself with our expert-led courses in technology,
            business, and more.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-4">
            <a
              href="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold text-center"
            >
              Get Started
            </a>
            <a
              href="https://drive.google.com/file/d/1DgrDrbEdsnVaIEhFgBdNru2W4vsuGShC/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-lg font-semibold text-center"
            >
              Demo Video
            </a>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={heroImage}
            alt="LMS Hero"
            className="w-full max-w-md sm:max-w-lg md:max-w-xl h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
