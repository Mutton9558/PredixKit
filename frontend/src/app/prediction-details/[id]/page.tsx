'use client';
import React, { useState, useEffect, useRef } from "react";
import { ethers, BrowserProvider } from "ethers";
import { useParams, useRouter } from "next/navigation";
import Chart from "chart.js/auto";
import SearchButtonWrapper from "../../components/SearchButton";
import WalletButtonWrapper from "../../components/WalletButton";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "address", name: "marketAddress", type: "address" },
      { indexed: false, internalType: "uint256", name: "marketId", type: "uint256" },
    ],
    name: "MarketCreated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_tag", type: "string" },
      { internalType: "uint256", name: "_cutOffTime", type: "uint256" },
      { internalType: "uint256", name: "_endTime", type: "uint256" },
      { internalType: "address", name: "_creator", type: "address" },
      { internalType: "uint256", name: "_yesPrice", type: "uint256" },
      { internalType: "uint256", name: "_noPrice", type: "uint256" },
    ],
    name: "createMarket",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getAccumulatedAmount", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getCOT", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getCount", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getCreationDate", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getEndTime", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }], name: "getMarketAddressById", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getNoAmount", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getNoDist", outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getNoPrice", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getTag", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getTitle", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "_sender", type: "address" }], name: "getUserMarkets", outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getYesAmount", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getYesDist", outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "market", type: "address" }], name: "getYesPrice", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "marketCount", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "markets",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "address", name: "market", type: "address" },
    ],
    name: "storeNewMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userMarkets",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const PredictionDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // Trading UI states (merged)
  const [selectedTab, setSelectedTab] = useState<"Buy" | "Sell">("Buy");
  const [tradeSide, setTradeSide] = useState<"yes" | "no">("yes");
  const [spiritQuantity, setSpiritQuantity] = useState<string>("1");

  // Data states
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

  // Chart refs
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Format end time for display
  useEffect(() => {
    if (endTime) {
      const endDateObj = new Date(endTime * 1000);
      setClientDate(endDateObj.toLocaleString());
    }
  }, [endTime]);

  // Fetch on mount / id change
  useEffect(() => {
    const load = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        if (!CONTRACT_ADDRESS) return;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        const marketAddress = await contract.getMarketAddressById(id);

        const totalYes = Number((await contract.getYesAmount(marketAddress)).toString());
        const totalNo = Number((await contract.getNoAmount(marketAddress)).toString());
        setYesCount(totalYes);
        setNoCount(totalNo);
        setBetCount(totalYes + totalNo);

        const mtitle = await contract.getTitle(marketAddress);
        const mtag = await contract.getTag(marketAddress);
        const mEnd = Number(await contract.getEndTime(marketAddress));
        const myes = Number((await contract.getYesPrice(marketAddress)).toString());
        const mno = Number((await contract.getNoPrice(marketAddress)).toString());
        const accum = Number((await contract.getAccumulatedAmount(marketAddress)).toString());
        const cDate = Number(await contract.getCreationDate(marketAddress));
        const yd = (await contract.getYesDist(marketAddress)).map((x: any) => Number(x.toString()));
        const nd = (await contract.getNoDist(marketAddress)).map((x: any) => Number(x.toString()));

        setTitle(mtitle);
        setTag(mtag);
        setEndTime(mEnd);
        setYesPrice(myes);
        setNoPrice(mno);
        setAccumulatedMoney(accum);
        setCreationDate(cDate);
        setYesData(yd);
        setNoData(nd);
      } catch (e) {
        console.log("Error loading market", e);
      }
    };
    load();
  }, [id]);

  // Build labels
  let duration = endTime - creationDate;
  const labels: number[] = [];
  if (duration > 0) {
    if (duration <= 86400) {
      let idx = 0;
      let remaining = duration;
      while (remaining > 0) {
        labels.push(idx);
        idx++;
        remaining -= 3600;
      }
    } else {
      let day = 1;
      let remaining = duration;
      while (remaining > 0) {
        labels.push(day);
        day++;
        remaining -= 86400;
      }
    }
  }

  const dataChart = {
    labels,
    datasets: [
      {
        label: "Yes Odds",
        data: yesData.length ? yesData : [0],
        fill: false,
        borderColor: "rgb(75,192,192)",
        tension: 0.1,
      },
      {
        label: "No Odds",
        data: noData.length ? noData : [0],
        fill: false,
        borderColor: "rgba(192,75,75,1)",
        tension: 0.1,
      },
    ],
  };

  const options: any = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: endTime - creationDate <= 86400 ? "Hours" : "Days",
        },
      },
      y: {
        title: { display: true, text: "Number of Bets" },
      },
    },
  };

  // Chart lifecycle
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, { type: "line", data: dataChart, options });
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [JSON.stringify(dataChart.labels), JSON.stringify(yesData), JSON.stringify(noData), options]);

  useEffect(() => {
    const check = () => {
      setExpired(Date.now() >= endTime * 1000);
    };
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const handleBack = () => router.push("/dashboard")

  // Handlers
  const clampQuantity = () => {
    if (spiritQuantity === "" || Number(spiritQuantity) < 1) setSpiritQuantity("1");
    else if (Number(spiritQuantity) > 99) setSpiritQuantity("99");
  };
  const inc = () => {
    const n = Number(spiritQuantity || "0");
    setSpiritQuantity(String(Math.min(99, n + 1 || 1)));
  };
  const dec = () => {
    const n = Number(spiritQuantity || "0");
    setSpiritQuantity(String(Math.max(1, n - 1 || 1)));
  };

  const confirmTrade = () => {
    clampQuantity();
    // Here you can integrate a contract call:
    // mode = selectedTab.toLowerCase(), side = tradeSide, amount = Number(spiritQuantity)
    console.log("Submit trade", {
      mode: selectedTab.toLowerCase(),
      side: tradeSide,
      amount: Number(spiritQuantity),
    });
  };


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

  return (
    <div className="prediction-details-container">
      <header className="prediction-details-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            ← Back to Home
          </button>
        </div>
        <div className="header-right">
          <SearchButtonWrapper />
          <WalletButtonWrapper />
        </div>
      </header>

      <div className="prediction-details-content">
        <div className="prediction-details-card">
          <div className="prediction-info">
            <h2 className="prediction-title">{title || "[Loading Title]"}</h2>
            <p className="prediction-deadline">Ends on {clientDate ?? "Loading..."}</p>
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
                className={`spirits-tab ${selectedTab === "Buy" ? "active" : ""}`}
                onClick={() => {
                  setSelectedTab("Buy");
                  setTradeSide("yes");
                }}
              >
                Buy
              </button>
              <button
                className={`spirits-tab ${selectedTab === "Sell" ? "active" : ""}`}
                onClick={() => {
                  setSelectedTab("Sell");
                  setTradeSide("yes");
                }}
              >
                Sell
              </button>
            </div>

            <div className="trade-side-buttons">
              {selectedTab === "Buy" ? (
                <>
                  <button
                    type="button"
                    aria-pressed={tradeSide === "yes"}
                    className={`trade-side-btn ${tradeSide === "yes" ? "active buy" : "buy"}`}
                    onClick={() => setTradeSide("yes")}
                  >
                    Buy Yes
                  </button>
                  <button
                    type="button"
                    aria-pressed={tradeSide === "no"}
                    className={`trade-side-btn ${tradeSide === "no" ? "active buy" : "buy"}`}
                    onClick={() => setTradeSide("no")}
                  >
                    Buy No
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    aria-pressed={tradeSide === "yes"}
                    className={`trade-side-btn ${tradeSide === "yes" ? "active sell" : "sell"}`}
                    onClick={() => setTradeSide("yes")}
                  >
                    Sell Yes
                  </button>
                  <button
                    type="button"
                    aria-pressed={tradeSide === "no"}
                    className={`trade-side-btn ${tradeSide === "no" ? "active sell" : "sell"}`}
                    onClick={() => setTradeSide("no")}
                  >
                    Sell No
                  </button>
                </>
              )}
            </div>

            <div className="spirits-quantity single-input">
              <input
                type="number"
                className="spirits-quantity-input"
                min={1}
                max={99}
                value={spiritQuantity}
                aria-label="Spirit quantity"
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") {
                    setSpiritQuantity("");
                    return;
                  }
                  const v = parseInt(raw, 10);
                  if (isNaN(v)) {
                    setSpiritQuantity("");
                  } else {
                    setSpiritQuantity(String(Math.min(99, Math.max(1, v))));
                  }
                }}
                onBlur={clampQuantity}
                inputMode="numeric"
              />
              <div className="quantity-step-btns" style={{ display: "flex", gap: "0.75em", marginTop: "0.75em" }}>
                <button type="button" className="quantity-step-btn" onClick={inc}>
                  ▲
                </button>
                <button type="button" className="quantity-step-btn" onClick={dec}>
                  ▼
                </button>
              </div>
            </div>

            <button className="confirm-btn" onClick={confirmTrade}>
              Confirm
            </button>

            <div style={{ marginTop: "1em", fontSize: "0.85em", opacity: 0.8 }}>
              Bets: {betCount} • Yes: {yesCount} • No: {noCount} • Yes Price: {yesPrice} • No Price: {noPrice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetails;
