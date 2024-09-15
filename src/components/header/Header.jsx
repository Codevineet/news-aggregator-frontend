import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  addUserInterest,
  removeUserInterest,
  fetchUserInterests,
} from "../../api/api.js";
import "./header.css";

const interests = [
  "Technology",
  "Science",
  "Health",
  "Politics",
  "Sports",
  "Entertainment",
  "Business",
  "Travel",
  "Education",
  "Environment",
  "Lifestyle",
  "Food",
  "Art",
];

const Header = ({ searchQuery, setSearchQuery, handleSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const interests = await fetchUserInterests();
        setSelectedInterests(Array.isArray(interests) ? interests : []);
      } catch (error) {
        console.error("Error fetching interests:", error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setIsLoggedIn(true);
      setUserName("User");
      loadInterests();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleCheckboxChange = async (interest) => {
    if (!isLoggedIn) {
      alert("Please log in to manage interests.");
      return;
    }

    try {
      if (selectedInterests.includes(interest)) {
        await removeUserInterest(interest);
        setSelectedInterests((prev) => prev.filter((i) => i !== interest));
        alert(`Removed interest: ${interest}`);
      } else {
        await addUserInterest(interest);
        setSelectedInterests((prev) => [...prev, interest]);
        alert(`Added interest: ${interest}`);
      }
      setShowDropdown(false);
      window.dispatchEvent(new Event("interests-updated"));
    } catch (error) {
      console.error("Error updating interests:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("");
    setSelectedInterests([]);
    setShowDropdown(false);
    alert("You have been logged out.");
  };

  const handleSubmit = () => {
    setShowDropdown(false);
    alert("Interests updated.");
  };

  return (
    <header className="header">
      <div className="logo">News Aggregator</div>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search news..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <span>Welcome, {userName}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/signup">
              <button>Signup</button>
            </Link>
          </>
        )}
      </div>
      <button
        className="interests-toggle"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Interests
      </button>
      {showDropdown && (
        <div className="interests-dropdown">
          <h2 className="dropdown-title">Interests</h2>
          <ul className="interest-list">
            {interests.map((interest) => (
              <li key={interest} className="interest-item">
                <input
                  type="checkbox"
                  checked={selectedInterests.includes(interest)}
                  onChange={() => handleCheckboxChange(interest)}
                  id={interest}
                />
                <label htmlFor={interest}>{interest}</label>
              </li>
            ))}
          </ul>
          <button className="dropdown-submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
