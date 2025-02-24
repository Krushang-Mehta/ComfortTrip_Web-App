import Carousels from "@/components/Carousel";
import Explore from "@/components/Explore";
import OurObjective from "@/components/OurObjective";
import Subfooter from "@/components/Subfooter";
import Footer from "@/components/Footer";
import Image from "next/image";
import CarsInsights from "@/components/CarsInsights";

export default function Home() {
  return ( 
  <div className="">
    <Carousels />
     
     {/* Explore Page  */}
    <div className="relative">
      <Explore />
      <Subfooter />
      <CarsInsights />
      <OurObjective />
      <Footer />
    </div>
  </div>
  );  
}
