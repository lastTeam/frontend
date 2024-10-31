import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [id, setId] = useState();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!userName || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }

   

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/signup", {
        "firstName":firstName,
        "lastName":lastName,
        "username":userName,
        "email":email ,
        "password":password,
        "roles": role
      });
      console.log(response);
      setId(response.data.id) 
      navigate("/home");
    } catch (error) {
      setErrorMessage("Error during sign up. Please try again.");
      console.error("Error during sign up:", error);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center backdrop-blur-sm"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/thumbnails/036/595/006/small_2x/ai-generated-craft-shop-advertisment-background-with-copy-space-free-photo.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded shadow-lg max-w-md w-full mx-auto">
        <h1 className="mb-8 text-2xl font-bold text-center text-gray-800 dark:text-white">
          Crafty
        </h1>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
          Create an account to explore our amazing features.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="px-4 py-3 border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-0 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="px-4 py-3 border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-0 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="px-4 py-3 border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-0 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-0 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-0 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="seller/user"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-3 border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-0 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
          />
        </div>
        
        {errorMessage && (
          <div className="text-red-500 text-sm text-center mt-4">{errorMessage}</div>
        )}

        <button
          onClick={handleSignUp}
          className="w-full mt-6 lqd-btn font-medium rounded-full bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:bg-indigo-700 focus-visible:shadow-indigo-300/10 px-5 py-3 transition-all"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Signup;
