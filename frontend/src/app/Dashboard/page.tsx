import React from "react";
import SearchButtonWrapper from "../components/SearchButton";
import WalletButtonWrapper from "../components/WalletButton";
import PredictionCard from "../components/PredictionCard";


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
