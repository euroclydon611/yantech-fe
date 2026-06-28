import React from 'react';
import '../css/Loader.css'; // We will create this CSS file

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="page-loader-overlay">
      <div className="page-loader-content">
        <img
          src="/images/logo.png"
          alt="YANTEC Engineering"
          className="page-loader-logo"
        />

        <div className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        <p className="page-loader-text">{text}</p>
      </div>
    </div>
  );
};

export default Loader;