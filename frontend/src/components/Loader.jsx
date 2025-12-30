import React from 'react';
import './Loader.css';

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="spinner"></div>
      </div>
      <p className="loader-text">Generating voice...</p>
      <p className="loader-subtext">This may take a few moments</p>
    </div>
  );
}

export default Loader;
