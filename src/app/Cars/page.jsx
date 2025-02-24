import Banners from '@/components/Banners';
import CarsInsights from '@/components/CarsInsights';
import Footer from '@/components/Footer';
import OurObjective from "@/components/OurObjective";
import React from 'react'

const Cars = () => {
  return <div> 
    <Banners 
        img="/About-banner.png"
        title="Multiple Options"
        text="We provide varity of Vehicles on rent."
    />
    {/* Cars Page form code. */}
    <div className="relative">
        <CarsInsights isForm = {false} />

        
        <div className="mt-10">
            <OurObjective />
            <Footer />
        </div>


    </div>
  </div>

}

export default Cars;
