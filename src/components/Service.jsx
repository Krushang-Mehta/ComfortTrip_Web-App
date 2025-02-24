"use client";  // Client-side rendering required for framer-motion

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer } from "@/Nav-Contants/motion";
import TitleText from "./TitleText";
import styles from "@/Nav-Contants/styles";

const Service = ({ service }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.10 }}
      className="bg-white  justify-center items-center shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-third-color hover:scale-105 mx-2 max-w-s"
    >
      <div className="p-3">
        <h3 className="text-base font-semibold text-gray-800 mb-2">{service?.title}</h3>
        {/* <p className="text-xs text-gray-600 mb-2">
          {service?.text || "Experience the best travel services with us."}
        </p> */}
      </div>
      <div className="w-full">
        <Image
          src={service?.img}
          alt={service?.title}
          className="w-60 h-50 object-cover items-center"
        />
      </div>
    </motion.div>
  );
};

export default Service;




// "use client"
// import React from 'react';
// import {  motion } from 'framer-motion';
// import { staggerContainer } from '@/Nav-Contants/motion';
// import TitleText from './TitleText';
// import styles from '@/Nav-Contants/styles';

// const Service = ({ service  }) => {
//   return <section className="">
//     <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once:false,amount: 0.25 }} className={`${styles.innerWidth} grid grid-col-1 mt-10 mx-auto `} >
//       {/* Settings for title . */}
//       <TitleText title={service.title} />
//       <motion.div variants={service.variant1} className="flex justify-center items-center flex-col" >
//         {/* Settings for text */}
//           <p className="font-normal text-sm lg:text-lg text-slate-400  text-center leading-6 w-full max-w-7xl mb-5">{service.text}</p>
//           {/* IMG settings for sertvice page */}
//           <div className="w-5/6 lg:w-4/6">
//             <img src={service.img} className=" w-full h-60   object-contain" alt="" />
//           </div>

//       </motion.div>
//     </motion.div>
//   </section>;

// }

// export default Service;
 
