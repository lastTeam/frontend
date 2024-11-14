import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/home/CartContext.jsx";
import Swal from "sweetalert2";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUserId } = useCart();

  const handleSignUp = async () => {
    if (!userName || !email || !password || !role) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "All fields are required.",
        confirmButtonColor: "#EBBE43",
      });
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/signup", {
        firstName: firstName,
        lastName: lastName,
        username: userName,
        email: email,
        password: password,
        roles: role.toUpperCase(),
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id);
      setUserId(response.data.id);

      if (role.toUpperCase() === "SELLER") {
        navigate("/dashboard");
      } else {
        navigate("/");
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

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Role
                </label>
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