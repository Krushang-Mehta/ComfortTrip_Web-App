import React from "react";
import { IoMdContacts } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { IoCarSport } from "react-icons/io5";
// import { MdCardTravel } from "react-icons/md";
// import { MdEvent, MdBookOnline, MdCalendarToday } from "react-icons/md";
// import { IoTicketOutline} from "react-icons/io5";
// import { FaRegAddressBook } from "react-icons/fa";



const Subfooter = () => {
  return <div className="w-full grid grid-cols-1 md:grid-cols-2 rounded-lg shadow-[0_2px_15px_-3px-rgba(0,0,0,0.07),0_10px_20px_-2px-rgba(0,0,0,0.04)] md:flex-row relative">
    {/* Image of yellow Taxi */}
    <img src="/Taxi-img.png" alt="Taxi-img" className="h-96 w-full md:px-16 px-8 md:my-0 my-8 rounded-t-lg md:!rounded-l-lg" />
    {/* Bullet contents of yellow taxi img */}
    <div className="flex flex-col justify-center gap-8 md:px-16 px-8 md:my-0 my-8">
      {/* Bullet 1 */}
      <div className="flex items-center gap-5">
        <span className="shadow-xl text-2xl p-6 rounded-full">
          <HiOutlineCalendar  className="text-third-color" />
        </span>
          <div className="flex flex-col gap-2">
            <h5 className="text-2xl text-gray-700 font-bold">Easy Bookings</h5>   
            <p className="mb-4 text-base text-gray-500 border-l-4 border-third-color pl-4">Book your best journey from our  website.</p>         
          </div>
      </div>
      {/* Bullet 2 */}
      <div className="flex items-center gap-5">
        <span className="shadow-xl text-2xl p-6 rounded-full">
          <IoMdContacts  className="text-third-color" />
        </span>
          <div className="flex flex-col gap-2">
            <h5 className="text-2xl text-gray-700 font-bold">Customer Satisfaction</h5>   
            <p className="mb-4 text-base text-gray-500 border-l-4 border-third-color pl-4">We work on providing best riding experience.</p>         
          </div>
      </div>
      {/* Bullet 3 */}
      <div className="flex items-center gap-5">
        <span className="shadow-xl text-2xl p-6 rounded-full">
          <IoCarSport  className="text-third-color" />
        </span>
          <div className="flex flex-col gap-2">
            <h5 className="text-2xl text-gray-700 font-bold">Maintained Cars</h5>   
            <p className="mb-4 text-base text-gray-500 border-l-4 border-third-color pl-4">We provide neat & clean Cars to enhance your Comfort.</p>         
          </div>
      </div>
    </div>
  </div>
}

export default Subfooter;
