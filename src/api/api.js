import axios from "axios";

const API_BASE_URL = "https://news-aggregator-backend-yebk.onrender.com/api"; // Update with your actual backend URL

// Helper function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Fetch token from localStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
};

// Fetch news based on search query
export const fetchNews = async (searchQuery = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/news?search=${searchQuery}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const news = await response.json();
    return news;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

// Search news based on query
export const searchNews = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching news:", error);
    throw error;
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    localStorage.setItem("token", data.token); // Store token in localStorage
    localStorage.setItem("name", userData.name);
    return data;
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const data = await response.json();
    const { token, name, expiresIn } = data;

    // Store token and name in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);

    // Optionally, handle token expiration (if provided by backend)
    if (expiresIn) {
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      localStorage.setItem("tokenExpiry", expirationDate);
    }

    return data;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

// Add user interest
export const addUserInterest = async (interest) => {
  try {
    const token = localStorage.getItem("token");
    const userId = decodeToken(token);

    if (!userId) throw new Error("User ID not found");

    const response = await fetch(`${API_BASE_URL}/user/interests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, interest }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding interest:", error);
    throw error;
  }
};

// Remove user interest
export const removeUserInterest = async (interest) => {
  try {
    const token = localStorage.getItem("token");
    const userId = decodeToken(token);

    if (!userId) throw new Error("User ID not found");

    const response = await fetch(`${API_BASE_URL}/user/interests`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, interest }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing interest:", error);
    throw error;
  }
};

// Fetch user interests
export const fetchUserInterests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/interests`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const interests = await response.json();
    return interests;
  } catch (error) {
    console.error("Error fetching user interests:", error);
    throw error;
  }
};
