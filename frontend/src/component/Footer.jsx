import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-4">About Us</h2>
          <p className="text-gray-400 leading-relaxed">
            We provide high-quality online courses to help you upskill and achieve your career goals.
            Join us to start learning today.
          </p>
        </div>

        {/* Quick Links */}
        <nav>
          <h2 className="text-2xl font-extrabold text-white mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <a href="#" className="hover:text-blue-500 transition duration-300">Courses</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500 transition duration-300">About Us</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500 transition duration-300">Contact</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500 transition duration-300">FAQ</a>
            </li>
          </ul>
        </nav>

        {/* Social Media */}
        <address className="not-italic">
          <h2 className="text-2xl font-extrabold text-white mb-4">Follow Us</h2>
          <div className="flex gap-6 mt-3">
            <a href="#" aria-label="Facebook" className="text-2xl hover:text-blue-500 transition">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Twitter" className="text-2xl hover:text-blue-400 transition">
              <FaTwitter />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-2xl hover:text-blue-300 transition">
              <FaLinkedin />
            </a>
            <a href="#" aria-label="Instagram" className="text-2xl hover:text-pink-400 transition">
              <FaInstagram />
            </a>
          </div>
        </address>
      </div>

      {/* Copyright */}
      <div className="mt-12 text-center text-gray-500 border-t border-gray-700 pt-6">
        <p>© {new Date().getFullYear()} MyLMS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
