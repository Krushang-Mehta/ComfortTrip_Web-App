import React from 'react';
import Image from "next/image";
import TitleText from './TitleText';
import { homeCards } from '@/Nav-Contants/app_data-links';

const OurObjective = () => {
  return (
    <div className="bg-white pt-12 pb-12 mb-10 flex flex-col items-center">
      {/* Title Section */}
      <TitleText
        title={
          <span className="text-gray-700 font-extrabold ">
            Our Objective
          </span>
        }
      />

      {/* Cards Section */}
      <div className="w-full max-w-7xl mx-10 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {homeCards?.map((car, index) => (
            <div
              key={index}
              className="rounded shadow-lg bg-white w-full max-w-sm mx-auto"
            >
              <div className="w-full relative">
                <Image
                  src={car.img}
                  alt="img"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="font-bold text-xl md-2 text-third-color p-4">
                {car.title}
              </div>
              <p className="text-gray-500 text-base p-4">{car.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurObjective;
