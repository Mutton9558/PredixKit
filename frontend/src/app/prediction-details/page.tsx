'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchButtonWrapper from '../components/SearchButton';
import WalletButtonWrapper from '../components/WalletButton';

const PredictionDetails = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Buy');
  const [spiritQuantity, setSpiritQuantity] = useState(1);

  const handleBackToHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="prediction-details-container">
      {/* Header */}
      <header className="prediction-details-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBackToHome}>
            ← Back to Home
          </button>
        </div>
        <div className="header-right">
          <SearchButtonWrapper />
          <div className="deposits-info">
            <span className="deposits-label">Deposits</span>
            <span className="deposits-amount">$0.00</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="prediction-details-content">
        {/* Prediction Card */}
        <div className="prediction-details-card">
          <div className="prediction-image">
            <img 
              src="/api/placeholder/400/200" 
              alt="Prediction" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1em' }}
            />
          </div>
          <div className="prediction-info">
            <h2 className="prediction-title">[Prediction_Title]</h2>
            <p className="prediction-deadline">Ends in [Days, hrs, sec]</p>
            <div className="prediction-tags">[tags]</div>
          </div>
          <div className="prediction-status">
            <div className="status-indicator"></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          {/* Total Accumulated Section */}
          <div className="total-section">
            <h3 className="total-title">Total Accumulated:</h3>
            <div className="total-amount">$0.00</div>
            <div className="chart-container">
              {/* Placeholder for chart - you can integrate a charting library here */}
              <div className="chart-placeholder">
                <p>Chart will be displayed here</p>
                <p>Consider using libraries like Chart.js, Recharts, or D3.js</p>
              </div>
            </div>
          </div>

          {/* Spirits Trading Section */}
          <div className="spirits-section">
            <h3 className="spirits-title">Spirits</h3>
            <div className="spirits-tabs">
              <button 
                className={`spirits-tab ${selectedTab === 'Buy' ? 'active' : ''}`}
                onClick={() => setSelectedTab('Buy')}
              >
                Buy
              </button>
              <button 
                className={`spirits-tab ${selectedTab === 'Sell' ? 'active' : ''}`}
                onClick={() => setSelectedTab('Sell')}
              >
                Sell
              </button>
            </div>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => setSpiritQuantity(Math.max(1, spiritQuantity - 1))}
              >
                ▲
              </button>
              <div className="quantity-display">{spiritQuantity}</div>
              <button 
                className="quantity-btn"
                onClick={() => setSpiritQuantity(spiritQuantity + 1)}
              >
                ▼
              </button>
            </div>
            <button className="confirm-btn">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetails;