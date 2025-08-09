import { id } from "ethers";
import Link from "next/link";
import React from "react";

interface PredictionCardProps {
  title: string;
  predictionMoney: number;
  tag: string;
  id: number;
}

const PredictionCard = ({
  title,
  predictionMoney,
  tag,
}: PredictionCardProps) => {
  return (
    <div className="prediction-card">
      <div className="prediction-main">
        <Link className="prediction-title" href={`/prediction-details/${id}`}>{title}</Link>
        <div className="prediction-buttons">
          <button className="yes-btn">Yes</button>
          <button className="no-btn">No</button>
        </div>
        <div className="prediction-meta">
          {predictionMoney}ETH • {tag}
        </div>
      </div>
      <div className="status-box"></div>
      <div className="bookmark">&#128278;</div>
    </div>
  );
};

export default PredictionCard;
