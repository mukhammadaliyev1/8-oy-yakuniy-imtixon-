import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Chart from "react-apexcharts";
import WatchlistModal from "./WatchlistModal";

export default function CryptoDetails() {
  const { coinId } = useParams();
  const [coinDetails, setCoinDetails] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeframe, setTimeframe] = useState("1m");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (coinId) {
      setLoading(true);
      fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
        .then((detailsRes) => (detailsRes.ok ? detailsRes.json() : null))
        .then((detailsData) => {
          if (detailsData) {
            setCoinDetails(detailsData);
          } else {
            console.error("Failed to fetch coin details");
          }
        })
        .catch((error) => {
          console.error("Error fetching coin details:", error);
        });

      fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${
          timeframe === "1y"
            ? 365
            : timeframe === "6m"
            ? 180
            : timeframe === "3m"
            ? 90
            : 30
        }&interval=daily`
      )
        .then((historyRes) => (historyRes.ok ? historyRes.json() : null))
        .then((historyData) => {
          if (historyData) {
            const formattedHistory = historyData.prices.map(
              ([timestamp, price]) => ({
                x: new Date(timestamp).getTime(),
                y: price,
              })
            );
            setPriceHistory(formattedHistory);
          } else {
            console.error("Failed to fetch price history");
          }
        })
        .catch((error) => {
          console.error("Error fetching price history:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [coinId, timeframe]);

  useEffect(() => {
    if (coinDetails) {
      const newCoin = {
        id: coinDetails.id,
        name: coinDetails.name,
        symbol: coinDetails.symbol,
        image: coinDetails.image?.thumb,
      };

      const savedWatchlist =
        JSON.parse(localStorage.getItem("watchlist")) || [];
      const updatedWatchlist = [...savedWatchlist, newCoin];

      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      setIsModalOpen(true);
    }
  }, [coinDetails]);

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: "#718096" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#718096" },
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },
    tooltip: {
      x: { format: "dd MMM yyyy" },
    },
    theme: { mode: "dark" },
    grid: { borderColor: "#2D3748" },
    colors: ["#00ffd5"],
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 dark:bg-gray-800">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!coinDetails) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Failed to load coin details. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-800 p-8">
      <div className="bg-gray-800 rounded-lg p-6 text-white max-w-4xl mx-auto">
        <button
          className="text-teal-400 mb-4"
          onClick={() => window.history.back()}
        >
          ← Go Back
        </button>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img
              src={coinDetails.image?.thumb}
              alt={`${coinDetails.name} logo`}
              className="h-8 w-8"
            />
            <h2 className="text-2xl font-bold">{coinDetails.name}</h2>
          </div>
          <p className="text-xl font-semibold">
            ${coinDetails.market_data?.current_price.usd.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            Market Cap: $
            {coinDetails.market_data?.market_cap.usd.toLocaleString()}
          </p>
          <div className="h-[350px]">
            {priceHistory.length > 0 ? (
              <Chart
                options={chartOptions}
                series={[{ name: "Price", data: priceHistory }]}
                type="line"
                height={350}
              />
            ) : (
              <p className="text-gray-400">No price history available.</p>
            )}
          </div>
          <div className="flex gap-2">
            {["1m", "3m", "6m", "1y"].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                disabled={timeframe === period}
                className={`px-4 py-2 rounded ${
                  timeframe === period
                    ? "bg-teal-400 text-gray-900"
                    : "bg-gray-700 text-white"
                }`}
              >
                {period.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
