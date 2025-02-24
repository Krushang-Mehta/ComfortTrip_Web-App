import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/Nav-Contants/motion';

const InsightCard = ({ imgUrl, title, subtitle, index, price, capacity, isForm }) => {
  return (
    <motion.div
      variants={fadeIn('up', 'string', index * 0.5, 1)}
      className="flex flex-col md:flex-row gap-6 items-center p-4 bg-white shadow-lg rounded-lg"
    >
      {/* Image section */}
      <img
        src={imgUrl}
        className="w-full md:w-[350px] h-[250px] rounded-lg object-cover"
        alt={title}
      />
      {/* Text content */}
      <div className="flex flex-col items-start">
        <h4 className="font-extrabold text-third-color lg:text-[28px] text-[22px]">
          {title}
        </h4>
        <p className="mt-4 text-slate-500 text-base lg:text-lg leading-relaxed">{subtitle}</p>
        <p className="mt-2 font-semibold text-slate-600 text-sm lg:text-base">{price}</p>
        <p className="mt-2 font-semibold text-slate-600 text-sm lg:text-base">{capacity}</p>
      </div>
    </motion.div>
  );
};

export default InsightCard;
