'use client'

import React, { useState } from "react"
import Corusel from "./Corusel"
import Cryptocurrency from "./Cryptocurrency"
import WatchlistModal from "./WatchlistModal"

function Home() {
  const [currency, setCurrency] = useState("usd")
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false)

  return (
    <div>
      <header className="w-full bg-[#141414] fixed">
        <div className="container bg-[#141414] px-32 py-5 flex justify-between">
          <p className="font-montserrat text-[#87CEEB] text-xl font-bold leading-8 tracking-wide text-left">
            CRYPTOFOLIO
          </p>
          <div className="flex-div flex gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-md border border-gray-600 bg-transparent px-4 py-2 text-white focus:outline-none"
            >
              <option value="usd">USD</option>
              <option value="eur">EURO</option>
              <option value="rub">RUB</option>
            </select>
            <button
              onClick={() => setIsWatchlistOpen(true)}
              className="w-[100px] h-10 rounded-sm text-sm text-zinc-950 bg-[#87CEEB]"
            >
              WATCHLIST
            </button>
          </div>
        </div>
      </header>
      <div className="pt-16">
        <Corusel />
      </div>
      <Cryptocurrency selectedCurrency={currency} />
      <WatchlistModal isOpen={isWatchlistOpen} onClose={() => setIsWatchlistOpen(false)} />
    </div>
    
  )
}

export default Home

