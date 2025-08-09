"use client";
import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";
import { useParams, useRouter } from "next/navigation";
import Chart from "chart.js/auto";
import SearchButtonWrapper from "../components/SearchButton";
import WalletButtonWrapper from "../components/WalletButton";

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
];
const PredictionDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [selectedTab, setSelectedTab] = useState("Buy");
  const [spiritQuantity, setSpiritQuantity] = useState(1);

  const [betCount, setBetCount] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [endTime, setEndTime] = useState(0);
  const [yesPrice, setYesPrice] = useState(0);
  const [noPrice, setNoPrice] = useState(0);
  const [accumulatedMoney, setAccumulatedMoney] = useState(0);
  const [creationDate, setCreationDate] = useState(0);
  const [yesData, setYesData] = useState([]);
  const [noData, setNoData] = useState([]);

  useEffect(() => {
    const connectSmartContract = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        if (CONTRACT_ADDRESS) {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          const marketAddress = await contract.getMarketAddressById(id);
          let totalYes = await contract.getYesAmount(marketAddress);
          let totalNo: number = await contract.getNoAmount(marketAddress);
          setYesCount(totalYes);
          setNoCount(totalNo);
          const totalBets: number = totalYes + totalNo;
          setBetCount(totalBets);

          let mtitle = await contract.getTitle(marketAddress);
          let mtag = await contract.getTag(marketAddress);
          let mtimeleft = await contract.getEndTime(marketAddress);
          let myesprice = await contract.getYesPrice(marketAddress);
          let mnoprice = await contract.getNoPrice(marketAddress);
          let maccumulateddolla = await contract.getAccumulatedAmount(
            marketAddress
          );
          let cd = await contract.getCreationDate(marketAddress);
          let yd = await contract.getYesDist(marketAddress);
          let nd = await contract.getNoDist(marketAddress);

          setTitle(mtitle);
          setTag(mtag);
          setEndTime(mtimeleft);
          setYesPrice(myesprice);
          setNoPrice(mnoprice);
          setAccumulatedMoney(maccumulateddolla);
          setCreationDate(cd);
          setYesData(yd);
          setNoData(nd);
        }
      } catch (err: any) {
        console.log("Error linking frontend to smart contract", err);
      }
    };

    connectSmartContract();
  }, []);

  let duration = endTime - creationDate;
  let label = [];
  if (duration <= 86400) {
    for (let i = 0; duration > 0; i++) {
      label[i] = i;
      duration -= 3600;
    }
  } else {
    for (let i = 1; duration > 0; i++) {
      label[i - 1] = i;
      duration -= 86400;
    }
  }

  const ctx = document.getElementById("chart-diagram") as HTMLCanvasElement;
  let labels = [];
  for (let i = 0; i < label.length; i++) {
    labels[i] = label[i];
  }

  const dataChart = {
    labels: labels,
    datasets: [
      {
        label: "Yes Odds",
        data: [0],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "No Odds",
        data: [0],
        fill: false,
        borderColor: "rgba(192, 75, 75, 1)",
        tension: 0.1,
      },
    ],
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: duration <= 86400 ? "Hours" : "Days",
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of Bets",
          },
        },
      },
    },
  };
  if (ctx) {
    const chart = new Chart(ctx, {
      type: "line",
      data: dataChart,
    });
  }

  const handleBackToHome = () => {
    router.push("/dashboard");
  };

  const endDate = new Date(endTime * 1000);
  const dateString = endDate.toLocaleString().toString();
  let date = dateString.slice(4, 15);
  let time = dateString.slice(16, 24);
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
          <WalletButtonWrapper />
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
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "1em",
              }}
            />
          </div>
          <div className="prediction-info">
            <h2 className="prediction-title">{title}</h2>
            <p className="prediction-deadline">
              Ends on {date}, {time}
            </p>
            <div className="prediction-tags">{tag}</div>
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
            <div className="total-amount">{accumulatedMoney} ETH</div>
            <div className="chart-container">
              {/* Placeholder for chart - you can integrate a charting library here */}
              <div className="chart-placeholder">
                <canvas id="chart-diagram"></canvas>
              </div>
            </div>
          </div>

          {/* Spirits Trading Section */}
          <div className="spirits-section">
            <h3 className="spirits-title">Spirits</h3>
            <div className="spirits-tabs">
              <button
                className={`spirits-tab ${
                  selectedTab === "Buy" ? "active" : ""
                }`}
                onClick={() => setSelectedTab("Buy")}
              >
                Buy
              </button>
              <button
                className={`spirits-tab ${
                  selectedTab === "Sell" ? "active" : ""
                }`}
                onClick={() => setSelectedTab("Sell")}
              >
                Sell
              </button>
            </div>
            <div className="spirits-amount">
              <div className="quantity-amount">
                <div className="quantity-display">{spiritQuantity}</div>
              </div>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => setSpiritQuantity(spiritQuantity + 1)}
                >
                  ▲
                </button>
                <button
                  className="quantity-btn"
                  onClick={() =>
                    setSpiritQuantity(Math.max(1, spiritQuantity - 1))
                  }
                >
                  ▼
                </button>
              </div>
            </div>
            <button className="confirm-btn">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetails;
