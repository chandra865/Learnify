import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-extrabold text-white mb-4">About Us</h2>
          <p className="text-gray-400">
            We provide high-quality online courses to help you upskill and achieve your career goals. Join us to start learning today.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-extrabold text-white mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">Courses</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">About Us</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">Contact</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-extrabold text-white mb-4">Follow Us</h2>
          <div className="flex gap-6 mt-3">
            <a href="#" className="text-gray-400 hover:text-blue-500 text-3xl transition duration-300">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 text-3xl transition duration-300">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 text-3xl transition duration-300">
              <FaLinkedin />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 text-3xl transition duration-300">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-500 mt-12 border-t border-gray-700 pt-4">
        <p>© {new Date().getFullYear()} MyLMS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
