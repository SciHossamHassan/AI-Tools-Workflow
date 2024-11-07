import React from 'react';
import { Link } from 'react-router-dom'; // For internal navigation

const GV_Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-gray-800 text-gray-300 p-6 w-full fixed bottom-0 left-0 flex justify-between items-center">
        {/* Left Section: Informational Links */}
        <div className="space-x-4 flex flex-wrap">
          <Link to="/about-us" className="hover:text-white focus:text-white transition">
            About Us
          </Link>
          <Link to="/privacy-policy" className="hover:text-white focus:text-white transition">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white focus:text-white transition">
            Terms & Conditions
          </Link>
          <Link to="/contact-support" className="hover:text-white focus:text-white transition">
            Contact Support
          </Link>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="flex space-x-4">
          {/* Twitter */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-white focus:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 19c11 0 15-9.33 15-15H5a10.004 10.004 0 006.29 9.549M8 19c5.5.663 10.998-1.867 14.94-7.91C17.91 8.645 21.15 6.875 23 5c-3.86 1.375-7.18 4.065-8.7 8.64M8 19c-3-1.5 1.5-7.5-4-8"
              />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-white focus:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 8a6 6 0 01-6 6H4a6 6 0 110-12h6a6 6 0 016 6zm0 0h-4m4 0h4M8 12v8m8-8v8"
              />
            </svg>
          </a>
        </div>
      </footer>
    </>
  );
};

export default GV_Footer;