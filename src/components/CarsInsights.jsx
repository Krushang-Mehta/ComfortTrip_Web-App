"use client";

import { staggerContainer } from '@/Nav-Contants/motion';
import styles from '@/Nav-Contants/styles';
import { motion } from 'framer-motion';
import React from 'react';
import Image from "next/image";
import TitleText from './TitleText';
import { Insights } from '@/Nav-Contants/app_data-links';
import InsightCard from './InsightCard.jsx';
import Link from "next/link";

const CarsInsights = ({ isForm }) => {
  return (
    <motion.div
      variants={!isForm ? staggerContainer : {}}
      initial={!isForm ? 'hidden' : undefined}
      whileInView={!isForm ? 'show' : undefined}
      viewport={!isForm ? { once: false, amount: 0.25 } : undefined}
      className={`${styles.innerWidth} mx-auto flex flex-col gap-8 py-8 px-4 sm:px-6`}
    >
      {!isForm && <TitleText title={<>Wide Variety of Cars</>} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Insights?.map((insight, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            {/* Image Section */}
            <Image
              src={insight.imgUrl}
              alt={insight.title}
              className="w-full h-[300px] object-cover rounded-md"
            />

            {/* Title Section */}
            <h2 className="mt-5 text-lg font-bold text-third-color text-center">
              {insight.title}
            </h2>

            {/* Price and Seating Capacity */}
            <div className="mt-2 text-center">
              <p className="text-md font font-semibold text-gray-800">
                 {insight.seating} Seater
              </p>
              <p className="text-lg text-gray-800 font-semibold">
                {insight.price}
              </p>
            </div>

            {/* Book Now Button with Link to Bookings Page */}
            <Link href={`/Bookings?car=${encodeURIComponent(insight.title)}`}>
              <p className="mt-2 flex justify-center p-2 rounded-md items-center text-center font-md text-white bg-purple-500 cursor-pointer hover:shadow-second-color transform transition-transform duration-300 hover:scale-90">
                {insight.buttonVariants}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CarsInsights;



// "use client";

// import { staggerContainer } from '@/Nav-Contants/motion';
// import styles from '@/Nav-Contants/styles';
// import { motion } from 'framer-motion';
// import React from 'react';
// import Image from "next/image";
// import TitleText from './TitleText';
// import { Insights } from '@/Nav-Contants/app_data-links';
// import InsightCard from './InsightCard.jsx';

// const CarsInsights = ({ isForm }) => {
//   return (
//     <motion.div
//       variants={!isForm ? staggerContainer : {}}
//       initial={!isForm ? 'hidden' : undefined}
//       whileInView={!isForm ? 'show' : undefined}
//       viewport={!isForm ? { once: false, amount: 0.25 } : undefined}
//       className={`${styles.innerWidth} mx-auto flex flex-col gap-8 py-8 px-4 sm:px-6`}
//     >
//       {!isForm && <TitleText title={<>Wide Variety of Cars</>} />}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {Insights?.map((insight, index) => (
//           <div
//             key={index}
//             className="flex flex-col items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-lg"
//           >
//             {/* Image Section */}
//             <Image
//               src={insight.imgUrl}
//               alt={insight.title}
//               className="w-full h-[300px] object-cover rounded-md"
//             />

//             {/* Title Section */}
//             <h2 className="mt-5 text-lg font-bold text-third-color text-center">
//               {insight.title}
//             </h2>

//             {/* Price and Seating Capacity */}
//             <div className="mt-2 text-center">
//               <p className="text-md font font-semibold text-gray-800">
//                  {insight.seating} Seater
//               </p>
//               <p className="text-lg text-gray-800 font-semibold">
//                 {insight.price}
//               </p>
//             </div>
//             <p className=" mt-2 flex justify-between p-2 rounded-md  items-center text-crnter font-md  object-cover  text-white bg-purple-500 cursor-pointer  hover:shadow-second-color transform transition-transform duration-300 hover:scale-90">
//                 {insight.buttonVariants}
//               </p>
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// };

// export default CarsInsights;

