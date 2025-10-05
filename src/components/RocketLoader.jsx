import React from 'react';
import './RocketLoader.css';

const RocketLoader = ({ isVisible, message = "Analyzing your data..." }) => {
  if (!isVisible) return null;

  return (
    <div className="rocket-loader-overlay">
      <div className="rocket-loader-container">
        <div className="rocket">
          <div className="rocket-body">
            <div className="rocket-nose"></div>
            <div className="rocket-middle">
              <div className="window"></div>
            </div>
            <div className="rocket-fin rocket-fin-left"></div>
            <div className="rocket-fin rocket-fin-right"></div>
          </div>
          <div className="rocket-fire">
            <div className="flame flame-1"></div>
            <div className="flame flame-2"></div>
            <div className="flame flame-3"></div>
          </div>
        </div>
        <div className="stars">
          <div className="star star-1"></div>
          <div className="star star-2"></div>
          <div className="star star-3"></div>
          <div className="star star-4"></div>
          <div className="star star-5"></div>
        </div>
        <div className="loading-text">
          <h3>{message}</h3>
          <div className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RocketLoader;