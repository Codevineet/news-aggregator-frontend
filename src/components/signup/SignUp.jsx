import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/api";
import "./SignUp.css";

const SignUp = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Access form values using refs
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const userData = { name, email, password };
      const result = await registerUser(userData);
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err); 
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h1>Sign Up</h1>
        {error && <div className="error-message">{error}</div>}
        <input type="text" placeholder="Name" ref={nameRef} required />
        <input type="email" placeholder="Email" ref={emailRef} required />
        <input
          type="password"
          placeholder="Password"
          ref={passwordRef}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
