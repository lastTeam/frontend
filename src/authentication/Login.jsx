import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.role);

      if (response.data.role === "ADMIN") {
        navigate("/admin");
      } else if (response.data.role === "SELLER") {
        navigate("/dashboard");
      } else {
        navigate("/");
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] bg-white/90"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
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