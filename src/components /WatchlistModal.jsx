import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function WatchlistModal({ isOpen, onClose }) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  function addToWatchlist(newCoin) {
    setWatchlist((prevWatchlist) => {
      const exists = prevWatchlist.some((coin) => coin.id === newCoin.id);
      if (!exists) {
        const updatedWatchlist = [...prevWatchlist, newCoin];
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
        return updatedWatchlist;
      }
      return prevWatchlist;
    });
  }

  function removeFromWatchlist(id) {
    setWatchlist((prevWatchlist) => {
      const updatedWatchlist = prevWatchlist.filter((coin) => coin.id !== id);
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      return updatedWatchlist;
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-72 bg-[#141414] shadow-lg">
      <div className="flex items-center justify-between border-b border-gray-700 p-4">
        <h2 className="text-xl font-bold text-white">WATCHLIST</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {watchlist.length > 0 ? (
          watchlist.map((coin) => (
            <div key={coin.id} className="flex flex-col items-center">
              <img
                src={coin.image}
                alt={coin.name}
                className="h-12 w-12 rounded-full"
              />
              <p className="mt-2 text-sm font-medium text-white">
                {coin.symbol.toUpperCase()}
              </p>
              <button
                onClick={() => removeFromWatchlist(coin.id)}
                className="mt-1 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
              >
                REMOVE
              </button>
            </div>
          ))
        ) : (
          <div className="text-white">No coins in watchlist</div>
        )}
      </div>
    </div>
  );
}
