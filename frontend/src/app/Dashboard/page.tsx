"use client";
import React from "react";
import SearchButtonWrapper from "../components/SearchButton";
import WalletButtonWrapper from "../components/WalletButton";

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

const Dashboard = () => {
  return (
    <>
      <div className="dashboard-bg">
        <header>
          <SearchButtonWrapper />
          <WalletButtonWrapper />
        </header>
        <div className="dashboard-content">
          <button className="create-btn">
            <span style={{ fontSize: "1.5em", marginRight: "0.5em" }}>+</span>
            Create New Prediction
          </button>
          <div className="section">
            <div className="section-title">Your Ongoing Predictions</div>
            <div className="section-inner">
              <PredictionCard />
              <div className="see-more">
                see more <span className="icon">&#8635;</span>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section-title">Your Past Predictions</div>
            <div className="section-inner">
              <PredictionCard />
              <div className="see-more">
                see more <span className="icon">&#8635;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
