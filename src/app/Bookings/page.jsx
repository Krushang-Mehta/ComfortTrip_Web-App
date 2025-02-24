"use client"

import { useState } from "react";

const Bookings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    destination: "",
    passengers: "",
    car: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Booking request sent successfully!");
      setFormData({ name: "", email: "", phone: "", pickup: "", destination: "", passengers: "", car: "" });
    } else {
      setMessage("Failed to send booking request.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-third-color">Comfort Bookings</h1>
        
        {message && <p className="text-center text-green-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-third-color font-medium">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-third-color" required />
          </div>

          <div>
            <label className="block text-third-color font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-third-color" required />
          </div>

          <div>
            <label className="block text-third-color font-medium">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-third-color" required />
          </div>

          <div>
            <label className="block text-third-color font-medium">Pickup Address</label>
            <input type="text" name="pickup" value={formData.pickup} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-third-color" required />
          </div>

          <div>
            <label className="block text-third-color font-medium">Destination Address</label>
            <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-third-color" required />
          </div>

          <div>
            <label className="block text-third-color font-medium">Passengers</label>
            <input type="number" name="passengers" value={formData.passengers} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-third-color" required />
          </div>

          <div>
            <label className="block text-third-color font-medium">Select Car</label>
            <select name="car" value={formData.car} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-third-color" required>
              <option value="">Select a Car</option>
              <option value="Suzuki Dzire">Suzuki Dzire</option>
              <option value="Tata Zest">Tata Zest</option>
              <option value="Toyota Innova">Toyota Innova</option>
              <option value="Innova Crysta">Innova Crysta</option>
              <option value="Suzuki Ertiga">Suzuki Ertiga</option>
              <option value="Traveller">Traveller</option>
            </select>
          </div>

          <button type="submit" className="min-w-full bg-third-color text-white font-bold py-2 px-4 rounded hover:bg-purple-950 hover:scale-90 transition duration-600">
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Bookings;





// "use client"

// import React, { useState } from "react";
// import Footer from '@/components/Footer';

// const Bookings = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     pickup: "",
//     destination: "",
//     passengers: "",
//     car: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("/api/sendMail", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert("Booking request sent successfully!");
//       } else {
//         alert(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Failed to send booking request.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 p-6">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
//         <h1 className="text-3xl font-bold mb-4 text-center text-third-color">Comfort Bookings</h1>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-third-color font-medium">Name</label>
//             <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color" required />
//           </div>

//           <div>
//             <label className="block text-third-color font-medium">Email</label>
//             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color" required />
//           </div>

//           <div>
//             <label className="block text-third-color font-medium">Phone Number</label>
//             <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color" required />
//           </div>

//           <div>
//             <label className="block text-third-color font-medium">Pickup Address</label>
//             <input type="text" name="pickup" value={formData.pickup} onChange={handleChange} placeholder="Enter pickup address"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color" required />
//           </div>

//           <div>
//             <label className="block text-third-color font-medium">Destination Address</label>
//             <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="Enter destination address"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color" required />
//           </div>

//           <div>
//             <label className="block text-third-color font-medium">Passengers</label>
//             <input type="number" name="passengers" value={formData.passengers} onChange={handleChange} placeholder="Enter no of passengers"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color" required />
//           </div>

//           <div>
//             <label className="block text-third-color font-medium">Select Car</label>
//             <select name="car" value={formData.car} onChange={handleChange}
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color" required>
//               <option value="">Select Car</option>
//               <option value="Suzuki Dzire">Suzuki Dzire</option>
//               <option value="Tata Zest">Tata Zest</option>
//               <option value="Toyota Innova">Toyota Innova</option>
//               <option value="Innova Crysta">Innova Crysta</option>
//               <option value="Suzuki Ertiga">Suzuki Ertiga</option>
//               <option value="Traveller">Traveller</option>
//             </select>
//           </div>

//           <button type="submit" className="min-w-full bg-third-color text-white font-bold py-2 px-4 rounded hover:bg-purple-950 hover:scale-90 transition duration-600">
//             Book Now
//           </button>
//         </form>

//         {/* <div className="mt-10">
//             <Footer />
//         </div> */}

//       </div>
//     </div>

//   );
// };



// export default Bookings;






// dddddddd///////////////////////////////////////////////////////







// import React from "react";

// const Bookings = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 p-6">
//       {/* Form section */}
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
//         <h1 className="text-3xl font-bold mb-4 text-center text-third-color">Comfort Bookings </h1>
//         <form className="space-y-4">
//           {/* Name Field */}
//           <div>
//             <label className="block text-third-color font-medium">Name</label>
//             <input
//               type="text"
//               placeholder="Enter your full name"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color"
//               required
//             />
//           </div>

//           {/* Email Field */}
//           <div>
//             <label className="block text-third-color font-medium">Email</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color"
//               required
//             />
//           </div>

//           {/* Phone Number Field */}
//           <div>
//             <label className="block text-third-color font-medium">Phone Number</label>
//             <input
//               type="tel"
//               placeholder="Enter your phone number"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color"
//               required
//             />
//           </div>

//           {/* Pickup Address Field */}
//           <div>
//             <label className="block text-third-color font-medium">Pickup Address</label>
//             <input
//               type="text"
//               placeholder="Enter pickup address"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color"
//               required
//             />
//           </div>

//           {/* Destination Address Field */}
//           <div>
//             <label className="block text-third-color font-medium">Destination Address</label>
//             <input
//               type="text"
//               placeholder="Enter destination address"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color"
//               required
//             />
//           </div>

//           {/* Number of Passengers Field */}
//           <div>
//             <label className="block text-third-color font-medium">Passangers</label>
//             <input
//               type="number"
//               placeholder="Enter no of passangers"
//               className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color"
//               required
//             />
//           </div>

//           {/* Car Selection Dropdown */}
//           <div>
//             <label className="block text-third-color font-medium">Select Car</label>
//             <select className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-third-color" required>
//               <option value="">Suzuki Dzire</option>
//               <option value="sedan">tata Zest</option>
//               <option value="suv">Toyota Innova</option>
//               <option value="hatchback">Innova Crysta</option>
//               <option value="luxury">Suzuki Ertiga</option>
//               <option value="minivan">traveller</option>
//             </select>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="min-w-full bg-third-color text-white font-bold py-2 px-4 rounded hover:bg-purple-950 hover:scale-90 transition duration-600"
//           >
//             Book Now
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Bookings;
