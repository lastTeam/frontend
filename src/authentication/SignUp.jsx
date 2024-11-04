import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/home/CartContext.jsx";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUserId } = useCart();

  const handleSignUp = async () => {
    if (!userName || !email || !password || !role) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/signup", {
        firstName: firstName,
        lastName: lastName,
        username: userName,
        email: email,
        password: password,
        roles: role.toUpperCase(), // Convert to uppercase to match backend expectations
      });

      // Store token and userId in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id);
      setUserId(response.data.id);

      // Redirect based on role
      if (role.toUpperCase() === "SELLER") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error during sign up. Please try again."
      );
      console.error("Error during sign up:", error);
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
      {/* Rest of the JSX remains the same */}
      <div className="absolute inset-0 backdrop-blur-[8px] bg-black/30" />
      <div className="flex max-w-5xl w-full bg-white/95 rounded-lg shadow-2xl overflow-hidden relative z-10">
        <div className="w-1/2">
          <img
            src="https://i.pinimg.com/236x/ff/dc/cb/ffdccb06ea6b7ccc6e7ffd4038f8770d.jpg"
            alt="Craft"
            className="w-full h-[600px] object-cover"
          />
        </div>
        <div className="w-1/2 p-8 backdrop-blur-sm bg-white/50">
          <div className="max-w-md mx-auto">
            <h1
              className="text-3xl font-bold text-center mb-4"
              style={{ color: "#EBBE43" }}
            >
              Crafty
            </h1>
            <p className="text-center text-gray-700 mb-6 font-medium">
              Create an account to explore our amazing features.
            </p>

            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                />
              </div>

              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                required
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                required
              >
                <option value="">Select Role</option>
                <option value="SELLER">Seller</option>
                <option value="BUYER">Buyer</option>
              </select>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm text-center mt-3">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleSignUp}
              className="w-full mt-6 py-2.5 rounded-lg text-white font-medium transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: "#EBBE43" }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
