// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminLogin() {
//   const router = useRouter();
//   const [password, setPassword] = useState("");

//   // Function to handle admin login
//   const handleLogin = () => {
//     if (password === "admin123") { // Check if password is correct
//       router.push("/admin"); // Redirect to Admin Dashboard
//     } else {
//       alert("Incorrect Password!"); // Show error message
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Admin Login</h2>
//       {/* Input field for admin password */}
//       <input
//         type="password"
//         placeholder="Enter Admin Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       {/* Login button */}
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }




"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "admin123") {
      router.push("/admin"); // Redirect to Admin Dashboard
    } else {
      alert("Incorrect Password!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-100">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-6 py-4 mb-6 border rounded-md outline-none focus:ring-3 focus:ring-purple-600"
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}

