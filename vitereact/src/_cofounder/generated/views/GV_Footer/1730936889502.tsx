import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

const GV_Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-gray-800 text-gray-300 p-4 w-full border-t border-gray-700">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Informational Links */}
          <div className="flex gap-6 flex-wrap justify-center md:justify-start">
            <Link to="/about-us" className="text-gray-300 hover:text-white transition underline">
              About Us
            </Link>
            <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-300 hover:text-white transition underline">
              Terms & Conditions
            </Link>
            <Link to="/contact-support" className="text-gray-300 hover:text-white transition underline">
              Contact Support
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4 justify-center md:justify-end">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-white transition"
            >
              <Twitter className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white transition"
            >
              <Linkedin className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition"
            >
              <Instagram className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            </a>
          </div>
        </div>

        {/* Footer Credits */}
        <div className="text-center mt-4 text-gray-500 text-sm">
          © 2023 Your Company. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default GV_Footer;