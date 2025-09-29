import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-purple-300 pt-12 pb-8 border-t border-gray-300">
      {/* Footer Title Section */}
      <div className="text-center">
        <h3 className="text-gray-700 font-extrabold text-2xl">Connect With Us</h3>
      </div>

      {/* Footer Links Section */}
      <div className="mx-10 md:mx-[10%] mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Logo and Contact */}
          <div className="text-gray-700">
            <h4 className="text-xl font-bold mb-4">Comfort Trip</h4>
            <div className="text-gray-600 mb-4">
               Shyamnagar 1,<br />
               Gandhigram , <br />
               Ramdevpir Chowk ,150 Ft Ring Road, <br />
               Rajkot:- 360007.
             </div>
            <div className="text-gray-600 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faWhatsapp} className="text-gray-700" />
                +91 9974833330
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-700" />
                thecomfort@gmail.com
              </div>
            </div>
          </div>

          {/* Column 2: Support Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Support</h4>
            <ul>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">About Us</a></li>
            </ul>
          </div>

          {/* Column 3: Bookings Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Bookings</h4>
            <ul>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Cars</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Travellers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Buses</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Packages</a></li>
            </ul>
          </div>

          {/* Column 4: Packages */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Packages</h4>
            <ul>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Haridwar - Rishikesh</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Shimla - Manali</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Rajasthan</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">South India</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-10 text-center text-gray-600 text-sm">
         &copy; 2025
        Designed & Developed by  <a href=https:"https://krushang-portfolio-website.vercel.app" target="_blank" rel="noopener noreferrer">Krushang Mehta</a>
      </div>
    </footer>
  );
};

export default Footer;
