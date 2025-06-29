"use client";
import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const scrollToTopUp = () => {
    const section = document.getElementById("topup-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="text-white">
      <div className="flex items-center justify-center h-[72vh] flex-col px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold drop-shadow-10xl"
        >
          Welcome to
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-7xl font-extrabold drop-shadow-2xl text-red-500"
        >
          Sky Game Store
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg md:text-xl font-medium drop-shadow-2xl mt-2"
        >
          Top Up Game Aman, Murah, dan Cepat!
        </motion.p>

        {/* <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTopUp}
          className="mt-4 bg-red-600 hover:bg-red-500 px-6 py-2 rounded-full text-white font-semibold shadow-md"
        >
          Top Up Sekarang
        </motion.button> */}

        {/* Partner logos langsung menyatu di bawah tombol */}
        {/* <div className="flex justify-center items-center gap-4 flex-wrap mt-4">
          {["bca", "bni", "bri", "dana", "ovo", "gopay", "qris"].map((logo) => (
            <img
              key={logo}
              src={`/logos/${logo}.png`}
              alt={logo}
              className="h-8 md:h-10 brightness-110 contrast-125"
            />
          ))}
        </div> */}
      </div>
    </div>
  );
}
