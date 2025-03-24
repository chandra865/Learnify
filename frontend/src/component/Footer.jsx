import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold text-white">About Us</h2>
          <p className="mt-2 text-gray-400">
            We provide high-quality online courses to help you upskill and achieve your career goals.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold text-white">Quick Links</h2>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="/courses" className="hover:text-blue-500">Courses</a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-500">About Us</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-500">Contact</a>
            </li>
            <li>
              <a href="/faq" className="hover:text-blue-500">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h2 className="text-xl font-bold text-white">Follow Us</h2>
          <div className="flex gap-4 mt-3">
            <a href="#" className="text-gray-400 hover:text-blue-500 text-2xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 text-2xl">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 text-2xl">
              <FaLinkedin />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 text-2xl">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} MyLMS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
