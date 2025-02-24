"use client";

import Banners from "@/components/Banners";
import Footer from "@/components/Footer";
import Service from "@/components/Service";
import Subfooter from "@/components/Subfooter";
import { serviceList } from "@/Nav-Contants/app_data-links";
import React from "react";

const Services = () => {
  const limitedServices = serviceList.slice(0, 6);

  return (
    <div>
      <Banners
        img="/local-01.png"
        title="Multiple Services"
        text="We provide a wide range of rental services."
      />

      <div className="mb-10 px-4">
        <h2 className="text-2xl font-bold text-center mt-8 mb-4">Our Services</h2>
        {/* Grid with 2 rows and 3 columns, smaller size and margin adjustments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-6">
          {limitedServices.map((service, index) => (
            <Service key={index} service={service} />
          ))}
        </div>
      </div>
      <div>
        <p>
          
        </p>
      </div>

      <Subfooter />
      <Footer />
    </div>
  );
};

export default Services;





// import Banners from '@/components/Banners';
// import Footer from '@/components/Footer';
// import Service from '@/components/Service';
// import Subfooter from '@/components/Subfooter';
// import { serviceList } from '@/Nav-Contants/app_data-links';
// import React from 'react';

// const Services = () => {
//   return <div>
//     <Banners 
//         img="/local-01.png"
//         title="Multiple Services"
//         text="We provide wide range of rental services."
//     />
//     <div className="mb-3">

//     {serviceList?.map((service,index) => (
//         <div key={index}>
//             <Service service={service} />
//         </div>
//     ))}

//     </div>
//     <Subfooter />
//     <Footer />
//   </div>;
  
// };

// export default Services;


