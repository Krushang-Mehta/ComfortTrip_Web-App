import React from "react";
import Link from "next/link";
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
            <div className="text-gray-600 mb-4 text-sm leading-relaxed">
              Shyamnagar 1,<br />
              Gandhigram,<br />
              Ramdevpir Chowk, 150 Ft Ring Road,<br />
              Rajkot - 360007.
            </div>
            <div className="text-gray-700 flex flex-col gap-3">
              <a
                href="https://wa.me/919974833330"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-emerald-800 transition group"
                title="Chat with us on WhatsApp"
              >
                <span className="w-8 h-8 rounded-full bg-emerald-600/15 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition shadow-xs">
                  <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                </span>
                <span className="font-semibold text-sm">+91 9974833330</span>
              </a>

              <a
                href="mailto:thecomfort@gmail.com"
                className="flex items-center gap-2.5 hover:text-purple-900 transition group"
                title="Email Comfort Trip"
              >
                <span className="w-8 h-8 rounded-full bg-purple-700/15 text-purple-900 flex items-center justify-center shrink-0 group-hover:bg-purple-700 group-hover:text-white transition shadow-xs">
                  <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                </span>
                <span className="font-semibold text-sm">thecomfort@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Column 2: Support Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about-us" className="text-gray-600 hover:text-purple-900 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-600 hover:text-purple-900 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/Services" className="text-gray-600 hover:text-purple-900 transition">
                  Our Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Bookings Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Bookings</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/Bookings" className="text-gray-600 hover:text-purple-900 transition font-medium">
                  Cars
                </Link>
              </li>
              <li>
                <Link href="/Bookings" className="text-gray-600 hover:text-purple-900 transition font-medium">
                  Travellers
                </Link>
              </li>
              <li>
                <Link href="/Bookings" className="text-gray-600 hover:text-purple-900 transition font-medium">
                  Buses
                </Link>
              </li>
              <li>
                <Link href="/Bookings" className="text-gray-600 hover:text-purple-900 transition font-medium">
                  Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Tour Packages pointing to Bookings */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Packages</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/Bookings" className="text-gray-600 hover:text-purple-900 transition">
                  Haridwar - Rishikesh
                </Link>
              </li>
              <li>
                <Link href="/Bookings" className="text-gray-600 hover:text-purple-900 transition">
                  Shimla - Manali
                </Link>
              </li>
              <li>
                <Link href="/Bookings" className="text-gray-600 hover:text-purple-900 transition">
                  Rajasthan
                </Link>
              </li>
              <li>
                <Link href="/Bookings" className="text-gray-600 hover:text-purple-900 transition">
                  South India
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-10 text-center text-gray-600 text-sm">
        &copy; 2025 Designed & Developed by{" "}
        <a
          href="https://krushang-mehta-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-700 hover:text-purple-900 underline transition"
        >
          Krushang Mehta
        </a>
      </div>
    </footer>
  );
};

export default Footer;
