"use client";
import Image from "next/image";

import Link from "next/link";

import { useState } from "react";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login submitted:", formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100">
            <div className="bg-white flex shadow-md rounded-lg overflow-hidden">
                {/* Left Section */}
                <div className="w-1/2 p-8">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                    <p className="text-gray-600 mt-2">Please enter your details</p>
                    <form onSubmit={handleSubmit} className="mt-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg py-2 px-4 mt-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg py-2 px-4 mt-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="mr-2 leading-tight"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-700">
                                    Remember for 30 days
                                </label>
                            </div>
                            <a href="/forgot-password" className="text-sm text-purple-600">
                                Forgot password?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Sign in
                        </button>
                    </form>
                    <div className="mt-6">
                        <button className="w-full border border-gray-300 flex items-center justify-center py-2 px-4 rounded-lg hover:bg-gray-100">
                            <img
                                src="/Google.png" // Replace with an actual path to a Google logo
                                alt="Google Logo"
                                className="w-5 h-5 mr-2"
                            />
                            Sign in with Google
                        </button>
                    </div>
                    <p className="text-sm text-center text-gray-600 mt-4">
                        Don’t have an account?{" "}
                        <Link href="/Register" className="text-purple-600 font-medium">
                            Sign up
                        </Link>
                    </p>

                </div>
                {/* Right Section */}
                <div className="w-1/2 bg-purple-300 flex items-center justify-center">
                    <Image
                        src="/Car-Banner-3-1.png" // Replace with an actual illustration
                        alt="Illustration"
                        className="w-2/3"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
