import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
   
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/login",{
          "email":email,
          "password":password,
        }
      );
  console.log(response.data);
  
    const localStorage = response.data.token
    alert ('Sure!')
      navigate("/home")
    } catch (error) {
      alert ('Oooops...')
      console.error("Error during login:", error);
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
          Access your account to explore our amazing features.
        </p>
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <div className="relative">
            <label
              className="flex cursor-pointer items-center gap-2 text-xs font-medium leading-none text-gray-700 dark:text-gray-200 mb-3"
              htmlFor="email"
            >
              <span>Email Address</span>
            </label>
            <input
              id="email"
              className="block peer w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-0 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label
              className="flex cursor-pointer items-center gap-2 text-xs font-medium leading-none text-gray-700 dark:text-gray-200 mb-3"
              htmlFor="password"
            >
              <span>Password</span>
            </label>
            <input
              id="password"
              className="block peer w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-0 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="my-2 flex justify-between gap-2">
            <label
              className="flex cursor-pointer items-center gap-2 text-xs font-medium leading-none text-gray-700 dark:text-gray-200"
              htmlFor="remember"
            >
              <input
                id="remember"
                className="peer rounded border-gray-300 dark:border-gray-600 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
                type="checkbox"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            className="lqd-btn group inline-flex items-center justify-center gap-1.5 font-medium rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl lqd-btn-primary bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:bg-indigo-700 focus-visible:shadow-indigo-300/10 px-5 py-3"
            type="submit"
          >
            Sign in
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          Don't have an account yet?
          <Link className="font-medium text-indigo-600 underline ml-1" to="/signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
