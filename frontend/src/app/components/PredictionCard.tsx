import React from 'react'

interface PredictionCardProps {
  title: string;
  price: number;
  tag: string;
}

const PredictionCard = ({ title, price, tag }: PredictionCardProps) => {
  return (
    <div className="prediction-card">
      <div className="prediction-main">
        <div className="prediction-title">{title}</div>
        <div className="prediction-buttons">
          <button className="yes-btn">Yes</button>
          <button className="no-btn">No</button>
        </div>
        <div className="prediction-meta">
          {price}ETH • {tag}
        </div>
      </div>
      <div className="status-box"></div>
      <div className="bookmark">&#128278;</div>
    </div>
  );
};

export default PredictionCard