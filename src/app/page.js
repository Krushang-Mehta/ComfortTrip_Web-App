import Carousels from "@/components/Carousel";
import Explore from "@/components/Explore";
import OurObjective from "@/components/OurObjective";
import Subfooter from "@/components/Subfooter";
import Footer from "@/components/Footer";
import CarsInsights from "@/components/CarsInsights";
import BookingCtaBanner from "@/components/common/BookingCtaBanner";

export const metadata = {
  title: "Comfort Trip — Best Car Rentals & Taxi Service in Rajkot",
  description:
    "Book affordable car rentals and taxi services in Rajkot with Comfort Trip. Best rates on outstation cabs to Somnath, Dwarka, and Gir, plus 24x7 Hirasar Airport transfers.",
  keywords: [
    "Comfort Trip",
    "Car Rental Rajkot",
    "Best Car Rentals in Rajkot",
    "Taxi Service in Rajkot",
    "Car Tentals Rajkot",
    "Car Bookings Rajkot",
    "The Comfort trip",
    "Affordable car Rentals in Rajkot",
    "Rajkot Taxi Service",
    "Car Hire Rajkot",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return ( 
  <div className="relative w-full overflow-x-hidden">
    <Carousels />
     
     {/* Explore Page  */}
    <div className="relative w-full">
      <Explore />
      <CarsInsights />
      <BookingCtaBanner />
      <Subfooter />
      <OurObjective />
      <Footer />
    </div>
  </div>
  );  
}
