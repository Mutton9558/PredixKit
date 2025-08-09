'use client';
import { id } from "ethers";
import Link from "next/link";
import React, { useState } from 'react'   // removed useEffect, useMemo

// --- move shared types above so base card can use them ---
type TradeSide = 'yes' | 'no';
type TradeMode = 'buy' | 'sell';

interface PredictionCardProps {
  title: string;
  predictionMoney: number;
  tag: string;
  id: number;
}

interface PredictionTradeCardProps {
  title: string;
  side: TradeSide;
  initialMode?: TradeMode;
  initialAmount?: number;
  onConfirm?: (p: { side: TradeSide; mode: TradeMode; amount: number }) => void;
  onCancel?: () => void;
}

/* Trade card (unchanged except type relocation) */
export const PredictionTradeCard: React.FC<PredictionTradeCardProps> = ({
  title,
  side,
  initialMode = 'buy',
  initialAmount = 50,
  onConfirm,
  onCancel
}) => {
  const [mode, setMode] = useState<TradeMode>(initialMode);
  const [amount, setAmount] = useState<number>(
    Math.min(99, Math.max(1, initialAmount))
  );

  const sideLabel = side === 'yes' ? 'Yes' : 'No';

  return (
    <div className="prediction-card trade-card">
      <div className="prediction-main">
        <div className="prediction-title" title={title}>{title}</div>
      </div>

      <div className="trade-mode-buttons" role="tablist" aria-label={`Choose Buy or Sell for ${sideLabel}`}>
        <button
          type="button"
          className={`trade-mode-btn buy ${mode === 'buy' ? 'active' : ''}`}
          onClick={() => setMode('buy')}
          role="tab"
          aria-selected={mode === 'buy'}
        >
          Buy {sideLabel}
        </button>
        <button
          type="button"
          className={`trade-mode-btn sell ${mode === 'sell' ? 'active' : ''}`}
          onClick={() => setMode('sell')}
          role="tab"
          aria-selected={mode === 'sell'}
        >
          Sell {sideLabel}
        </button>
      </div>

      <div className="trade-slider-wrap">
        <input
          type="range"
          className="trade-slider"
          min={1}
          max={99}
          value={amount}
          onChange={(e) => {
            const v = Number(e.target.value);
            setAmount(Math.min(99, Math.max(1, v)));
          }}
          aria-label="Adjust amount"
        />
        <div className="trade-slider-controls">
          <div className="trade-slider-value">{amount}</div>
          <div className="trade-step-buttons">
            <button
              type="button"
              className="trade-step-btn"
              aria-label="Increase"
              onClick={() => setAmount(a => Math.min(99, a + 1))}
            >▲</button>
            <button
              type="button"
              className="trade-step-btn"
              aria-label="Decrease"
              onClick={() => setAmount(a => Math.max(1, a - 1))}
            >▼</button>
          </div>
        </div>
      </div>

      <div className="prediction-buttons fixed-bottom trade-action-buttons">
        <button
          className="yes-btn"
          onClick={() => onConfirm?.({ side, mode, amount })}
        >Confirm</button>
        <button
          className="no-btn"
          onClick={() => onCancel?.()}
        >Cancel</button>
      </div>
    </div>
  );
};

/* Base card now swaps to trade card */
const PredictionCard = ({ title, predictionMoney, tag, id }: PredictionCardProps) => {
  const [tradeSide, setTradeSide] = useState<TradeSide | null>(null);

  // When a side is selected, show trade card instead
  if (tradeSide) {
    return (
      <PredictionTradeCard
        title={title}
        side={tradeSide}
        onCancel={() => setTradeSide(null)}
        onConfirm={(p) => {
          // placeholder: do something with p
          setTradeSide(null);   // return after confirm (optional)
        }}
      />
    );
  }

  return (
    <div className="prediction-card">
      <div className="prediction-main">
        <Link className="prediction-title" title={title} href={`/prediction-details/${id}`}>
          {title}
        </Link>
      </div>
      <div className="prediction-buttons fixed-bottom">
        <button className="yes-btn" onClick={() => setTradeSide('yes')}>Yes</button>
        <button className="no-btn" onClick={() => setTradeSide('no')}>No</button>
      </div>
      <div className="prediction-meta fixed-meta">
        {predictionMoney}ETH • {tag}
      </div>
    </div>
  );
};

export default PredictionCard;
