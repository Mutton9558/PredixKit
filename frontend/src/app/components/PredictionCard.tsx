"use client";
import { id } from "ethers";
import Link from "next/link";
import React, { useState } from "react"; // removed useEffect, useMemo
import { ethers, BrowserProvider } from "ethers";
import { useRouter } from "next/navigation";

// --- move shared types above so base card can use them ---
type TradeSide = "yes" | "no";
type TradeMode = "buy" | "sell";

interface PredictionCardProps {
  title: string;
  predictionMoney: number;
  tag: string;
  id: number;
}

interface PredictionTradeCardProps {
  title: string;
  id: number;
  side: TradeSide;
  initialMode?: TradeMode;
  initialAmount?: number;
  onConfirm?: (p: { side: TradeSide; mode: TradeMode; amount: number }) => void;
  onCancel?: () => void;
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "marketAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
    ],
    name: "MarketCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_tag",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_cutOffTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_yesPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_noPrice",
        type: "uint256",
      },
    ],
    name: "createMarket",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getAccumulatedAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getCOT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getCreationDate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getEndTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getMarketAddressById",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getNoAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getNoDist",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getNoPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getTag",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getTitle",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
    ],
    name: "getUserMarkets",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getYesAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getYesDist",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getYesPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "markets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "storeNewMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
      {
        internalType: "bool",
        name: "transactionType",
        type: "bool",
      },
    ],
    name: "userBuy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userMarkets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "sellAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "transactionType",
        type: "bool",
      },
    ],
    name: "userSell",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const transactionEvent = async (
  decision: any,
  quantity: number,
  selectedTab: any,
  id: number
) => {
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    if (CONTRACT_ADDRESS) {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const market = await contract.getMarketAddressById(id);
      const yesPrice = await contract.getYesPrice(market);
      const noPrice = await contract.getNoPrice(market);
      let cost;
      if (decision === "Yes") {
        cost = BigInt(quantity) * yesPrice;
      } else if (decision === "No") {
        cost = BigInt(quantity) * noPrice;
      }
      console.log(cost);
      if (selectedTab === "buy") {
        const transaction = await contract.userBuy(market, decision == "Yes", {
          value: cost,
        });
        await transaction.wait();
      } else if (selectedTab === "sell") {
        console.log("Sell");
        const transaction = await contract.userSell(
          market,
          quantity,
          decision === "Yes"
        );
        await transaction.wait();
      }
    }
  } catch (err: any) {
    console.log("aiyo error: ", err);
  }
};

/* Trade card (unchanged except type relocation) */
export const PredictionTradeCard: React.FC<PredictionTradeCardProps> = ({
  title,
  id,
  side,
  initialMode = "buy",
  initialAmount = 50,
  onConfirm,
  onCancel,
}) => {
  const [mode, setMode] = useState<TradeMode>(initialMode);
  const [amount, setAmount] = useState<number>(
    Math.min(99, Math.max(1, initialAmount))
  );

  const sideLabel = side === "yes" ? "Yes" : "No";

  return (
    <div className="prediction-card trade-card">
      <div className="prediction-main">
        <div className="prediction-title" title={title}>
          {title}
        </div>
      </div>

      <div
        className="trade-mode-buttons"
        role="tablist"
        aria-label={`Choose Buy or Sell for ${sideLabel}`}
      >
        <button
          type="button"
          className={`trade-mode-btn buy ${mode === "buy" ? "active" : ""}`}
          onClick={() => setMode("buy")}
          role="tab"
          aria-selected={mode === "buy"}
        >
          Buy {sideLabel}
        </button>
        <button
          type="button"
          className={`trade-mode-btn sell ${mode === "sell" ? "active" : ""}`}
          onClick={() => setMode("sell")}
          role="tab"
          aria-selected={mode === "sell"}
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
              onClick={() => setAmount((a) => Math.min(99, a + 1))}
            >
              ▲
            </button>
            <button
              type="button"
              className="trade-step-btn"
              aria-label="Decrease"
              onClick={() => setAmount((a) => Math.max(1, a - 1))}
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      <div className="prediction-buttons fixed-bottom trade-action-buttons">
        <button
          className="yes-btn"
          onClick={() => transactionEvent(sideLabel, amount, mode, id)}
        >
          Confirm
        </button>
        <button className="no-btn" onClick={() => onCancel?.()}>
          Cancel
        </button>
      </div>
    </div>
  );
};

/* Base card now swaps to trade card */
const PredictionCard = ({
  title,
  predictionMoney,
  tag,
  id,
}: PredictionCardProps) => {
  const [tradeSide, setTradeSide] = useState<TradeSide | null>(null);

  // When a side is selected, show trade card instead
  if (tradeSide) {
    return (
      <PredictionTradeCard
        title={title}
        id={id}
        side={tradeSide}
        onCancel={() => setTradeSide(null)}
        onConfirm={(p) => {
          // placeholder: do something with p
          setTradeSide(null); // return after confirm (optional)
        }}
      />
    );
  }

  return (
    <div className="prediction-card">
      <div className="prediction-main">
        <Link className="prediction-title" title={title} href={`/prediction-details/${id}`} style={{ cursor: 'pointer' }}>
          {title}
        </Link>
      </div>
      <div className="prediction-buttons fixed-bottom">
        <button className="yes-btn" onClick={() => setTradeSide("yes")}>
          Yes
        </button>
        <button className="no-btn" onClick={() => setTradeSide("no")}>
          No
        </button>
      </div>
      <div className="prediction-meta fixed-meta">
        {BigInt(predictionMoney) / BigInt(1000000000000000000)}ETH • {tag}
      </div>
    </div>
  );
};

export default PredictionCard;
