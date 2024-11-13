import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/auth/login",
        {
          email: email,
          password: password,
        }
      );

      // Store the token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.role);

      // Redirect based on user role
      if (response.data.role === "ADMIN") {
        navigate("/admin"); // Redirect to admin dashboard
      } else if (response.data.role === "SELLER") {
        navigate("/dashboard"); // Redirect to seller dashboard
      } else {
        navigate("/"); // Redirect regular users to home
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Invalid credentials");
      } else {
        setError("An error occurred during login");
      }
      console.error("Error during login:", error);
    }
  };

  return (
    <div
      className="min-h-[600px] flex justify-center items-center p-4 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/236x/4f/fd/9b/4ffd9be517c945762cfc0968bb6844e8.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-[8px] bg-black/30" />

      {/* Main content container */}
      <div className="flex max-w-5xl w-full bg-white/95 rounded-lg shadow-2xl overflow-hidden relative z-10">
        {/* Left side - Image */}
        <div className="w-1/2">
          <img
            src="https://i.pinimg.com/236x/ff/dc/cb/ffdccb06ea6b7ccc6e7ffd4038f8770d.jpg"
            alt="Craft"
            className="w-full h-[600px] object-cover"
          />
        </div>

        {/* Right side - Login Form */}
        <div className="w-1/2 p-8 backdrop-blur-sm bg-white/50">
          <div className="max-w-md mx-auto">
            <h1
              className="text-3xl font-bold text-center mb-4"
              style={{ color: "#EBBE43" }}
            >
              Crafty
            </h1>
            <p className="text-center text-gray-700 mb-6 font-medium">
              Access your account to explore our amazing features.
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#EBBE43] focus:ring-[#EBBE43]"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-white font-medium transition-all hover:opacity-90 shadow-lg mt-6"
                style={{ backgroundColor: "#EBBE43" }}
              >
                Sign in
              </button>

              <div className="text-center text-gray-700 mt-6">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="font-medium hover:underline"
                  style={{ color: "#EBBE43" }}
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Login;
