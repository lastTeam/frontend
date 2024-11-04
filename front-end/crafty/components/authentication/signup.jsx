import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }

    const userData = {
      username: userName,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/signup", userData);
      console.log("Response:", response);
      navigate("/trips");
    } catch (error) {
      setErrorMessage("Error during sign up. Please try again.");
      console.error("Error during sign up:", error);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorMessage && <div>{errorMessage}</div>}

      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default Signup;
