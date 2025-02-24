import React from 'react'

import Image from "next/image";

const ExploreCard = ({ world }) => {
    // Margin for card photos.

  return <div className="text-center w-full sm:mx-auto mt-16 shadow-xl text-gray-900 px-10 py-6 gradient-05 sm:p-8 rounded-lg border-third-color border-2 relative cursor-pointer hover:shadow-third-color transform transition-transform duration-300 hover:scale-105 ">
    
    {/* Style for card Photos. */}

    <div className="mx-auto w-32 h-32 relative -mt-[85px] border-4 border-white rounded-full overflow-hidden">
        <Image src={world.imgUrl} alt="" className="object-cover object-center h-32"/>
    </div>

    {/* Styles for title & description of card.  */}
    <div className="">
      <h2 className="text-xl font-bold text-third-color">{world.title}</h2>
      <p className="text-gray-800 mt-6 ">{world.description}</p>
    </div>
  </div>
}

export default ExploreCard;
