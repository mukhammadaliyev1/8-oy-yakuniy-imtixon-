import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
function Corusel() {
  const containerRef = useRef(null);
  const controls = useAnimationControls();
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h"
        );
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCryptoData();
  }, []);
  useEffect(() => {
    if (containerRef.current && items.length > 0) {
      const containerWidth = containerRef.current.offsetWidth;
      const itemWidth = containerWidth / 6;
      controls.start({
        x: [-itemWidth, -itemWidth * items.length],
        transition: {
          duration: 14,
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
  }, [controls, items.length]);
  return (
    <div
    className="w-full h-96 flex items-center justify-center p-8 overflow-hidden bg-cover bg-center mx-auto"
    style={{ backgroundImage: 'url("/background.svg")' }}
  >
x  
      <div className="">
        <h1 className="font-montserrat text-6xl font-extrabold leading-[72px] tracking-[-0.5px] text-center text-[#87CEEB] mt-12">
          {" "}
          CRYPTOFOLIO WATCH LIST
        </h1>
        <p class="font-montserrat   text-sm text-gray-400 font-medium leading-6 tracking-tight text-center">
          Get all the Info regarding your favorite Crypto Currency
        </p>
        <div className="relative h-40 w-[800px] mt-4">
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r to-transparent z-20" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l to-transparent z-20" />

          <div ref={containerRef} className="overflow-hidden">
            <motion.div
              animate={controls}
              className="flex w-[80px]"
              style={{ width: `${items.length * 25}%` }}
            >
              {[...items, ...items].map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  className="flex-shrink-0 w-[180px] px-4"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    delay: index * 4,
                  }}
                >
                  <div className="flex flex-col items-center justify-center w-full h-40 rounded-lg relative group">
                    <div className="absolute inset-0 rounded-lg transition-all duration-300 w-16" />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-contain mb-2"
                    />
                    <span className="text-cyan-400 font-medium">
                      {item.name}
                    </span>
                    <span className="text-gray-300 text-sm">
                      ${item.current_price.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        <div className="h-[1px] w-[300px] bg-gradient-to-r from-transparent to-transparent mt-12" />
      </div>
    </div>
  );
}

export default Corusel;
