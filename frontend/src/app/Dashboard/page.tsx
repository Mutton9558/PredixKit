"use client";
import React from "react";

function PredictionCard() {
  return (
    <div className="prediction-card">
      <div className="avatar"></div>
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
        <div className="dashboard-header">
          <span className="main-title">MainPage</span>
          <div className="header-actions">
            <span className="icon" title="Search">&#128269;</span>
            <div className="profile-box">
              <span className="icon" title="Account">&#128100;</span>
              <span>[account_add]</span>
              <span>$0.00</span>
            </div>
          </div>
        </div>
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
      <style jsx>{`
        .dashboard-bg {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #6b21a8 0%, #9333ea 100%);
          padding: 0;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1em 2em;
          background: #222;
          color: #fff;
          font-size: 1.1em;
        }
        .main-title {
          font-weight: bold;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1em;
        }
        .icon {
          font-size: 1.3em;
          vertical-align: middle;
        }
        .profile-box {
          display: flex;
          align-items: center;
          gap: 0.5em;
          background: #fff;
          color: #222;
          border-radius: 0.7em;
          padding: 0.3em 1em;
        }
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2em 1em;
        }
        .create-btn {
          display: flex;
          align-items: center;
          font-size: 1.3em;
          font-weight: 600;
          background: #fff;
          border: 2px solid #222;
          border-radius: 1em;
          padding: 0.7em 2em;
          margin-bottom: 2em;
          cursor: pointer;
          transition: box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }
        .create-btn:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .section {
          margin-bottom: 2em;
        }
        .section-title {
          color: #fff;
          font-size: 1.4em;
          font-weight: 600;
          margin-bottom: 0.5em;
        }
        .section-inner {
          background: #fff;
          border-radius: 1em;
          padding: 1.5em 1em 1em 1em;
          box-shadow: 0 4px 16px rgba(0,0,0,0.13);
          margin-bottom: 1em;
          position: relative;
        }
        .see-more {
          position: absolute;
          right: 1em;
          bottom: 0.7em;
          font-size: 1em;
          color: #222;
          display: flex;
          align-items: center;
          gap: 0.2em;
          cursor: pointer;
        }
        .prediction-card {
          display: flex;
          align-items: flex-start;
          background: #e5e5e5;
          border-radius: 1em;
          padding: 1em;
          margin-bottom: 1em;
          box-shadow: 2px 4px 8px rgba(0,0,0,0.13);
          border: 3px solid #222;
          min-width: 350px;
          max-width: 500px;
          position: relative;
        }
        .avatar {
          width: 48px;
          height: 48px;
          background: #666;
          border-radius: 0.7em;
          margin-right: 1em;
          flex-shrink: 0;
        }
        .prediction-main {
          flex: 1;
        }
        .prediction-title {
          font-size: 1.1em;
          font-weight: bold;
          margin-bottom: 0.7em;
        }
        .prediction-buttons {
          display: flex;
          gap: 1em;
          margin-bottom: 0.7em;
        }
        .yes-btn {
          background: #b9fbc0;
          color: #22c55e;
          border: none;
          border-radius: 0.7em;
          padding: 0.4em 2em;
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
        }
        .no-btn {
          background: #ffd6d6;
          color: #f43f5e;
          border: none;
          border-radius: 0.7em;
          padding: 0.4em 2em;
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
        }
        .prediction-meta {
          font-size: 0.95em;
          color: #444;
          margin-top: 0.5em;
        }
        .status-box {
          width: 38px;
          height: 38px;
          background: #ffb4b4;
          border-radius: 0.7em;
          margin-left: 1em;
          flex-shrink: 0;
        }
        .bookmark {
          position: absolute;
          right: 1em;
          bottom: 0.7em;
          font-size: 1.2em;
          color: #444;
        }
        @media (max-width: 700px) {
          .dashboard-content {
            padding: 1em 0.2em;
          }
          .prediction-card {
            min-width: 0;
            max-width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
