import { fadeIn } from "./motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

// This are the components for the Nav-bar & Header.
export const links = [

    // Home page linked here
    {
        link:"/",
        text:"Home",
        exact:"true",
    },
    
    // Bookings linked 
    {
        link:"/Bookings",
        text:"Bookings",
        exact:"true",
    },

    // Bookings car can be changed here
    {
        link:"/Cars",
        text:"Cars",
        exact:"true",
    },


    // Services
    {
        link:"/Services",
        text:"Services",
        exact:"true",
    },

    // Contact page
    {
        link:"/about-us",
        text:"About Us",
        exact:"true",
    },

    // User Login - Signup
    {
      link:"/Login",
      text:<span><FontAwesomeIcon icon={faUserCircle} /></span>,
      exact:"true",
  },
];


// Here are Components for the Carousel

export const profile = [
    {
        title : "Comfort-Trip",
        img : "/Multi-car.png", 
        text : "Multiple Car Options",
        icon : "car",
    },
    {
        title : "Airport Assistance",
        img : "/Air-port.png",
        text : "Airport Pickup and Drop Services",
        icon : "car",
    },
    {
        title : "Quality-Service",
        img : "/Customer-sat.png",
        text : "Quality Service and Customer Satisfaction",
        icon : "lightbulb",
    },
];


// Here are Array for Explore data-Cards.

export const exploreWorlds = [
    {
      id: "world-1",
      imgUrl: "/proffesniol-drive.png",
      title: "Professniols and Experienced Drivers",
      description: " We provide well trained and experienced professniols Drivers .From Unmatched Luxury to Spacious Comfort: Trip Awaits Your Selection!",
    },
    {
      id: "world-2",
      imgUrl: "/Comfort-ride.png",
      title: "Comfortable, Dependable, and Reliable",
      description: "At Comfort Trip, we understand your desires - a seasoned chauffeur behind the wheel, complemented by a flawlessly styled vehicle, ensuring a journey of unparalleled comfort and sophistication.",
    },
    {
      id: "world-3",
      imgUrl: "/all-journ-2.png",
      title: "Vehicles for each & every Destination",
      description: "Comfort Trip delivers the ultimate luxury ride for an unforgettable journey.",
    },
  ];

//   Our Objective Array Named as HomeCards.

export const homeCards = [
    {
      img: "/air-port-drop.png",
      title: "Provide Seamless Airport Assistance and Travel Solutions",
      description:
        "Ensure smooth airport pickup and drop services with a focus on punctuality and convenience.",
    },
    {
      img: "/02_Customer-satisfaction.png",
      title: "Deliver Quality Service and Customer Satisfaction",
      description:
        "Offer well-maintained vehicles and experienced drivers to guarantee a comfortable and safe journey, prioritizing customer needs.",
    },
    {
      img: "/tracking.png",
      title: "Offer a Wide Range of Vehicle Options for Every Journey",
      description:
        "Provide luxury, spacious, and dependable cars tailored for different travel needs, ensuring a memorable travel experience.",
    },
  ];
 
  
// Service Page Contents link.

export const serviceList = [
  {
      id: 1,
      text: "",
      title: "Air-Port Transfer",
      img: "/airport-service.png",
      variant1: fadeIn("right", "tween", 0.2, 1),
      variant2: fadeIn("left", "tween", 0.2, 1),
  },
  {
      id: 2,
      text: "",
      title: "One Way Trip",
      img: "/oneway.png",
      variant1: fadeIn("left", "tween", 0.2, 1),
      variant2: fadeIn("right", "tween", 0.2, 1),
  },
  {
      id: 3,
      text: "",
      title: "Round Trip",
      img: "/roundtrip.png",
      variant1: fadeIn("right", "tween", 0.2, 1),
      variant2: fadeIn("left", "tween", 0.2, 1),
  },
  {
      id: 4,
      text: "",
      title: "Pick Up-Drop Services",
      img: "/pickup-drop.png",
      variant1: fadeIn("left", "tween", 0.2, 1),
      variant2: fadeIn("right", "tween", 0.2, 1),
  },
  {
      id: 5,
      text: "",
      title: "Outstation Site Visit",
      img: "/outstation.png",
      variant1: fadeIn("right", "tween", 0.2, 1),
      variant2: fadeIn("left", "tween", 0.2, 1),
  }
];


// Our Cars content link.

export const Insights = [
  {
    imgUrl: "/01_Dzire_Ai.png",
    title: "Suzuki Dzire",
    seating:" 5 ",
    price: "₹ 12/km",
    buttonVariants: "Book Now",
  },
  {
    imgUrl: "/012_Zest_Ai.png",
    title: "Tata Zest XMS",
    seating:" 5 ",
    price: "₹ 12/km",
    buttonVariants: "Book Now",
    
  },
  {
    imgUrl: "/012_Ertiga_Ai.png",
    title: "Suzuki Ertiga",
    seating:" 6 ",
    price: "₹ 14/km",
    buttonVariants: "Book Now",
    
  },
  {
    imgUrl: "/01_Innova_Aii.png",
    title: "Toyota Innova",
    seating:" 7 ",
    price:"15 Rs/KM",
    buttonVariants: "Book Now",
  },
  {
    imgUrl: "/01_Innova-Crysta_Ai.png",
    title: "Toyota Crysta",
    seating:" 7 ",
    price: "₹ 18/km",
    buttonVariants: "Book Now",
  },
  {
    imgUrl: "/01-force-traveller.png",
    title: "Force Traveller",
    seating:" 12,17,20,25",
    price: "₹ 25 - 30/km",
    buttonVariants: "Book Now",  
  },
];  






