import React, { useState, useEffect } from "react";
import { fetchNews, searchNews, fetchUserInterests } from "./api/api.js";
import Header from "./components/Header/Header";
import NewsCard from "./components/card/NewsCard.jsx";
import Loader from "./components/loader/Loader.jsx";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

      if (userId) {
        const interests = await fetchUserInterests();
        if (Array.isArray(interests) && interests.length > 0) {
          const fetchedNews = await fetchUserInterests(interests);
          setNews(fetchedNews);
        } else {
          const fetchedNews = await fetchNews();
          setNews(fetchedNews);
        }
      } else {
        const fetchedNews = await fetchNews();
        setNews(fetchedNews);
      }
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();

    const handleInterestsUpdated = () => {
      loadNews();
    };

    window.addEventListener("interests-updated", handleInterestsUpdated);

    return () => {
      window.removeEventListener("interests-updated", handleInterestsUpdated);
    };
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchResults = await searchNews(searchQuery);
      setNews(searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </header>
      <div className="main-content">
        <div className="news-container">
          {loading ? (
            <Loader />
          ) : Array.isArray(news) && news.length > 0 ? (
            news.map((article) => (
              <NewsCard
                key={article.url}
                photo={article.urlToImage}
                headline={article.title}
                summary={
                  article.summary === "Summarization failed"
                    ? article.description
                    : article.summary
                }
                url={article.url}
              />
            ))
          ) : (
            <p>No news available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
