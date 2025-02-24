"use client";
import React, { useState } from "react";
import Link from "next/link";
import { links } from "@/Nav-Contants/app_data-links";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const [isMenu, setIsMenu] = useState(false);

  return (
    // Added 'relative' to ensure the dropdown menu stays within the header
    <div className="bg-white shadow-lg h-16 flex justify-between items-center md:px-[10%] relative"> 
      
      {/* Logo */}
      <Link
        href="/"
        className="text-third-color font-bold text-2xl pl-5 md:pl-0 transform transition-transform duration-300 hover:scale-110"
      >
        Comfort~Trip
      </Link>

      {/* Toggle Menu Button */}
      {/* Added 'cursor-pointer' to improve UX */}
      <div
        className="md:hidden flex flex-col gap-1 pr-5 cursor-pointer"
        onClick={() => setIsMenu(!isMenu)}
      >
        <div className="w-5 h-0.5 bg-black"></div>
        <div className="w-5 h-0.5 bg-black"></div>
        <div className="w-5 h-0.5 bg-black"></div>
      </div>

      {/* Navbar Links */}
      {/* Updated this div to handle the menu toggle properly */}
      <div
        className={`${
          isMenu ? "flex" : "hidden"
        } flex-col absolute top-16 left-0 w-full bg-white shadow-md md:shadow-none md:flex md:flex-row md:static md:w-auto text-center`}
      >
        {links?.map((link) => (
          <div key={link.link} className="py-2 md:py-0">
            <Link
              className={`block px-5 py-2 ${
                pathname === link.link ? "text-third-color font-bold" : "text-gray-800"
              }`}
              href={link.link}
              onClick={() => setIsMenu(false)} // Added this to close the menu when a link is clicked
            >
              <span>{link.text}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;



// "use client"
// import React, {useState} from "react";
// import Link from "next/link";
// import { links } from "@/Nav-Contants/app_data-links";
// import { usePathname } from "next/navigation";

// const Header = () => {
//     const pathname = usePathname();
    
//     // Toggle Menu statement
    
//     const [isMenu, setIsMenu] = useState(false);
//     console.log(pathname);
//   return (

//     // This div class contains styles for header & other components.
//     <div className="bg-white shadow-lg h-16 flex justify-between items-center md:px-[10%]">  
//         <Link href="/" className="text-third-color font-bold text-2xl pl-5 md:pl-0 transform transition-transform duration-300 hover:scale-110">
//         Comfort~Trip
//         </Link>

//         {/* Block code for toggle menu */}    {/* Call Toggle Menu */}
//         <div className=" md:hidden flex flex-col gap-1 pr-5"  
//         onClick={()=>setIsMenu(!isMenu)}>
            
//             <div className="w-5 h-0.5 bg-black"></div>
//             <div className="w-5 h-0.5 bg-black"></div>
//             <div className="w-5 h-0.5 bg-black"></div>

//         </div>

//         {/*  This block of code is used to link navbar components*/}

//         {/* Below div contains class for styling. */}
//         {/* Responsive design components included in class */}
//         <div className={`${isMenu ? "flex-col absolute top-16 w-full":"hidden md:flex"} gap-5  md:flex-row  md:static top-16 bg-white w-full md:w-auto text-center`}>
//             {links?.map((link)=>(
//                 <div key={link.link}>

//                     {/* Here are the contant of Nav-Bar which are linked through other files. */}

//                     <Link className={`${pathname === link.link? "text-third-color font-bold " : "text-gray-800 "}`} href={link.link} exact={link.exact}>
//                         <span>{link.text}</span>
//                     </Link>

//                 </div>
//             ))}
//         </div>
//     </div>
//   );
// };

// export default Header;
