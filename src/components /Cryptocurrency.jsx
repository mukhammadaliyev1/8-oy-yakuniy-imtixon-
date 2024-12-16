import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoEye } from "react-icons/io5";

export default function Cryptocurrency({ selectedCurrency }) {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 2000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        vs_currency: selectedCurrency,
        order: "market_cap_desc",
        per_page: "10",
        page: currentPage.toString(),
        sparkline: "false",
      });

      if (debouncedSearchTerm.trim()) {
        params.append("ids", debouncedSearchTerm);
      }

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`
        );
        const data = await response.json();
        setCryptoData(data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchCryptoData();
  }, [debouncedSearchTerm, selectedCurrency, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getCurrencySymbol = () => {
    switch (selectedCurrency) {
      case "usd":
        return "$";
      case "eur":
        return "€";
      case "gbp":
        return "£";
      default:
        return "";
    }
  };

  const formatPrice = (price) => {
    if (!price) return "";
    return price.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] p-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-center text-2xl font-medium text-white">
          Cryptocurrency Prices by Market Cap
        </h2>

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 w-full rounded bg-[#1C1F26] px-4 py-3 text-sm text-white placeholder-gray-400 outline-none"
          placeholder="Search For a Crypto Currency..."
          type="text"
        />

        <div className="mb-2 grid grid-cols-12 px-4 text-sm text-gray-400">
          <div className="col-span-3">Coin</div>
          <div className="col-span-3 text-right">Price</div>
          <div className="col-span-3 text-right">24h Change</div>
          <div className="col-span-3 text-right">Market Cap</div>
        </div>

        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : cryptoData.length > 0 ? (
          <div className="space-y-1">
            {cryptoData.map((coin) => (
              <Link to={`/coin/${coin.id}`} key={coin.id}>
                <div className="grid grid-cols-12 items-center rounded bg-[#1C1F26] p-4 text-white transition hover:bg-[#2C2F36]">
                  <div className="col-span-3 flex items-center gap-3">
                    <img className="h-6 w-6" src={coin.image} alt={coin.name} />
                    <div>
                      <div className="font-medium">
                        {coin.symbol.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400">{coin.name}</div>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    {getCurrencySymbol()}
                    {formatPrice(coin.current_price)}
                  </div>
                  <div
                    className={`col-span-3 flex items-center justify-end gap-2 ${
                      coin.price_change_percentage_24h > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <IoEye className="cursor-pointer text-xl text-gray-400 hover:text-teal-400" />
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </div>
                  <div className="col-span-3 text-right">
                    {getCurrencySymbol()}
                    {formatPrice(coin.market_cap)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No results found...</div>
        )}
        <div className="mt-6 flex justify-center space-x-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`rounded px-3 py-1 ${
                currentPage === page
                  ? "bg-teal-500 text-white"
                  : "bg-[#1C1F26] text-gray-300 hover:bg-[#2C2F36]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
