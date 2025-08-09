"use client";
import { useEffect } from "react";
import SearchButtonWrapper from "../components/SearchButton";
import WalletButtonWrapper from "../components/WalletButton";
import { BrowserProvider, ethers } from "ethers";
import { useRouter } from "next/navigation";

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

const page = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const title = formData.get("title")?.toString() || "";
    const tag = formData.get("tag")?.toString() || "";
    const yesPrice = formData.get("yesPrice")?.toString() || "";
    const noPrice = formData.get("noPrice")?.toString() || "";
    const cutOffTimeRaw = formData.get("Cut-Off-Time") as string;
    const endDatetimeRaw = formData.get("End-Datetime") as string;

    if (!cutOffTimeRaw || !endDatetimeRaw) {
      alert("Please fill out both dates.");
      return;
    }

    const cutOffTime = Math.floor(new Date(cutOffTimeRaw).getTime() / 1000);
    const endDatetime = Math.floor(new Date(endDatetimeRaw).getTime() / 1000);

    try {
      const ownerAddress = localStorage.getItem("userAddress");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("hi");
      if (CONTRACT_ADDRESS) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        console.log("hi");
        const tx = await contract.createMarket(
          title,
          tag,
          cutOffTime,
          endDatetime,
          ownerAddress,
          ethers.parseEther(yesPrice),
          ethers.parseEther(noPrice)
        );
        await tx.wait();
        contract.on("MarketCreated", (creator, marketAddress, marketId) => {
          console.log(
            "Event received:",
            creator,
            marketAddress,
            marketId.toString()
          );
        });
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error creating market:", err);
    }
  };

  return (
    <div className="new-prediction-container">
      <header>
        <SearchButtonWrapper />
        <WalletButtonWrapper />
      </header>
      <div className="newPredictionForm-Container">
        <div className="newPredictionForm">
          <form id="new-prediction-form" onSubmit={handleSubmit}>
            <div className="form-details">
              <h1>Prediction Details</h1>
              <div id="title-container">
                <h2>Prediction Title</h2>
                <input
                  name="title"
                  type="text"
                  placeholder="Enter your prediction..."
                />
              </div>

              <div id="tag-container">
                <h2>Prediction Tags</h2>
                <input
                  name="tag"
                  type="text"
                  placeholder="Enter tags (comma separated)..."
                />
              </div>
            </div>
            <div className="form-timeline">
              <h1>Prediction Timeline</h1>
              <div id="end-date-cont">
                <div className="prediction-end-date">
                  <h2>Prediction Ends</h2>
                  <input
                    name="End-Datetime"
                    type="datetime-local"
                    placeholder="Select date and time..."
                  />
                </div>
              </div>
              <div id="cot-cont">
                <h2>Cut-off time</h2>
                <input
                  name="Cut-Off-Time"
                  type="datetime-local"
                  placeholder="Select cut-off time..."
                />
              </div>
            </div>
            <div className="form-market-settings">
              <div>
                <h1>Initial Price</h1>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1%",
                    justifyContent: "center",
                  }}
                >
                  <div className="initial-price-choice-yes">
                    <div className="yes-btn">Yes</div>
                    <input
                      name="yesPrice"
                      type="number"
                      placeholder="Enter initial price..."
                    />
                  </div>
                  <div className="initial-price-choice-no">
                    <div className="no-btn">No</div>
                    <input
                      name="noPrice"
                      type="number"
                      placeholder="Enter initial price..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-submit">
              <button type="submit">Create Prediction</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
