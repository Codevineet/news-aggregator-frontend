import React from "react";
import "./newsCard.css";

const NewsCard = ({ photo, headline, summary, url }) => {
  return (
    <div className="news-card">
      {photo && <img src={photo} alt={headline} className="news-card-img" />}
      <h2 className="news-card-headline">{headline}</h2>
      <p className="news-card-summary">{summary}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="news-card-link"
      >
        Read more
      </a>
    </div>
  );
};

export default NewsCard;
