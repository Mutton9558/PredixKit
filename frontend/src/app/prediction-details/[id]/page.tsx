"use client";
import React, { useState, useEffect, useRef } from "react";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";
import { useParams, useRouter } from "next/navigation";
import Chart from "chart.js/auto";
import SearchButtonWrapper from "../../components/SearchButton";
import WalletButtonWrapper from "../../components/WalletButton";

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
  const [yesData, setYesData] = useState<number[]>([]);
  const [noData, setNoData] = useState<number[]>([]);
  const [clientDate, setClientDate] = useState<string | null>(null);
  const [Expired, setExpired] = useState(false);

  // Ref for the chart canvas
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (endTime) {
      const endDate = new Date(endTime * 1000);
      const dateString = endDate.toLocaleString();

      setClientDate(`${dateString}`);
    }
  }, [endTime]);

  useEffect(() => {
    const connectSmartContract = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        if (CONTRACT_ADDRESS) {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          const marketAddress = await contract.getMarketAddressById(id);
          let totalYes = Number(
            await contract.getYesAmount(marketAddress).toString()
          );
          let totalNo: number = Number(
            await contract.getNoAmount(marketAddress).toString()
          );
          setYesCount(totalYes);
          setNoCount(totalNo);
          const totalBets: number = totalYes + totalNo;
          setBetCount(totalBets);

          let mtitle = await contract.getTitle(marketAddress);
          let mtag = await contract.getTag(marketAddress);
          let mtimeleft = Number(await contract.getEndTime(marketAddress));
          let myesprice = await contract.getYesPrice(marketAddress);
          let mnoprice = await contract.getNoPrice(marketAddress);
          let maccumulateddolla = await contract.getAccumulatedAmount(
            marketAddress
          );
          let cd = Number(await contract.getCreationDate(marketAddress));
          let yd = await contract.getYesDist(marketAddress);
          let nd = await contract.getNoDist(marketAddress);
          console.log(mtimeleft);
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
  }, [id]);

  // Calculate labels for the chart
  let duration = endTime - creationDate;
  console.log(duration);
  let label: number[] = [];
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
  console.log(label);

  // Setup chart data based on yesData and noData (or fallback)
  const dataChart = {
    labels: label,
    datasets: [
      {
        label: "Yes Odds",
        data: yesData.length > 0 ? yesData : [0],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "No Odds",
        data: noData.length > 0 ? noData : [0],
        fill: false,
        borderColor: "rgba(192, 75, 75, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: endTime - creationDate <= 86400 ? "Hours" : "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Bets",
        },
      },
    },
  };

  // Create/destroy Chart in useEffect to avoid duplicate charts error
  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy old chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: dataChart,
      options: options,
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [dataChart, options]);

  useEffect(() => {
    const check = () => {
      setExpired(Date.now() >= endTime * 1000);
    };
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const ResultSection = () => {
    return (
      <div className="result-section">
        {Expired ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em' }}>
            <div className="status-indicator-ended">
              <p>Ended</p>
            </div>
            <ResultChoice />
          </div>
        ) : (
          <div className="status-indicator-ongoing">
            <p>Ongoing</p>
          </div>
        )}
      </div>
    );
  };

  const ResultChoice = () => {
    return (
      <>
        <div className="result-choice-section">
          <button>Finalize the Verdict!</button>
        </div>
        <div className="result-choice" style={{ display: 'none' }}>
          <button className="result-button">Choose Yes</button>
          <button className="result-button">Choose No</button>
        </div>

      </>
    );
  };

  const handleBackToHome = () => {
    router.push("/dashboard");
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
          <WalletButtonWrapper />
        </div>
      </header>

      {/* Main Content */}
      <div className="prediction-details-content">
        {/* Prediction Card */}
        <div className="prediction-details-card">
          <div className="prediction-info">
            <h2 className="prediction-title">{title}</h2>
            <p className="prediction-deadline">
              Ends on {clientDate ?? "Loading..."}
            </p>
            <div className="prediction-tags">{tag}</div>
          </div>
          <div className="prediction-status">
            <ResultSection />
          </div>
        </div>

        <div className="bottom-section">
          <div className="total-section">
            <h3 className="total-title">Total Accumulated:</h3>
            <div className="total-amount">{accumulatedMoney} ETH</div>
            <div className="chart-container">
              <div className="chart-placeholder">
                <canvas id="chart-diagram" ref={canvasRef}></canvas>
              </div>
            </div>
          </div>

          <div className="spirits-section">
            <h3 className="spirits-title">Spirits</h3>
            <div className="spirits-tabs">
              <button
                className={`spirits-tab ${selectedTab === "Buy" ? "active" : ""
                  }`}
                onClick={() => setSelectedTab("Buy")}
              >
                Buy
              </button>
              <button
                className={`spirits-tab ${selectedTab === "Sell" ? "active" : ""
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
