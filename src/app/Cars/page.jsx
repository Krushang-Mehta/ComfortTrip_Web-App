import Banners from '@/components/Banners';
import CarsInsights from '@/components/CarsInsights';
import Footer from '@/components/Footer';
import OurObjective from "@/components/OurObjective";
import React from 'react';

export const metadata = {
  title: "Car Fleet | Affordable Car Rentals in Rajkot",
  description:
    "Explore our fleet of sedans, luxury SUVs, and tempo travellers for rent in Rajkot. Clean, well-maintained vehicles with experienced chauffeurs for outstation and local trips.",
  keywords: [
    "Car Fleet Rajkot",
    "Car Rental Rajkot",
    "Innova Crysta on rent Rajkot",
    "Ertiga rental Rajkot",
    "Tempo Traveller Rental in Rajkot",
    "Best car rentals in Rajkot",
    "Affordable car Rentals in Rajkot",
    "Value for money car Rental in Rajkot",
    "Tempo Traveller Rental in Gujarat",
    "Sedan Car Rental in Rajkot",
    "SUV Car Rental in Rajkot",
    "Luxury Car Rental in Rajkot",
    "Car Rental Rajkot Airport",
    "Taxi service in Rajkot",
    "Rajkot Taxi",
    "Luxury car rentals in Rajkot"
  ],
  alternates: {
    canonical: "/Cars",
  },
};

const Cars = () => {
  return <div>
    <Banners
      img="/About-banner.png"
      title="Multiple Options"
      text="We provide varity of Vehicles on rent."
    />
    {/* Cars Page form code. */}
    <div className="relative">
      <CarsInsights isForm={false} />


      <div className="mt-10">
        <OurObjective />
        <Footer />
      </div>


    </div>
  </div>

}

export default Cars;
