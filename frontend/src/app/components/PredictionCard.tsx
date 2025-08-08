import React from 'react'

function PredictionCard() {
  return (
    <div className="prediction-card">
      <div className="prediction-main">
        <div className="prediction-title">[Prediction Title]</div>
        <div className="prediction-buttons">
          <button className="yes-btn">Yes</button>
          <button className="no-btn">No</button>
        </div>
        <div className="prediction-meta">
          [Prediction_money] • [tags]
        </div>
      </div>
      <div className="status-box"></div>
      <div className="bookmark">&#128278;</div>
    </div>
  );
}

export default PredictionCard