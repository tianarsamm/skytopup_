"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import LandingPage from './components/LandingPage';
import TopUpPage from './components/TopUpPage';
import AdminProductsPage from './components/AdminProductsPage';
import AdminOrdersPage from './components/AdminOrderPage';
import Navbar from './components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';

// Inisialisasi Supabase
const supabase = createClient(
  'https://xxzpmjydzrjvbbifsywo.supabase.co', // ganti dengan URL kamu
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4enBtanlkenJqdmJiaWZzeXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODgwOTAsImV4cCI6MjA2NTc2NDA5MH0.Q6-I9_rGESfndmeHuJcmSTCFZQVYfru8J148qKJeEsg' // ganti dengan anon-key kamu
);

export default function Home() {
  const [page, setPage] = useState('landing');
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden text-white">
      <video
        className="fixed top-0 left-0 w-full h-full max-w-full max-h-full object-cover z-0"
        src="/Video/bg6.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      
      <div className="relative z-10 flex flex-col min-h-screen bg-black/60">
        {/* Navbar menerima supabase client, setIsAdmin, dan page */}
        <Navbar
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          setPage={setPage}
          page={page} // Tambahan properti ini
          supabase={supabase}
        />

        <div className="flex-1 flex flex-col items-center justify-start py-8 w-full">
          <AnimatePresence mode="wait">
            {page === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <LandingPage />
              </motion.div>
            )}

            {page === 'topup' && (
              <motion.div
                key="topup"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <TopUpPage supabase={supabase} />
              </motion.div>
            )}

            {page === 'adminProducts' && isAdmin && (
              <motion.div
                key="adminProducts"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <AdminProductsPage supabase={supabase} />
              </motion.div>
            )}

            {page === 'adminOrders' && isAdmin && (
              <motion.div
                key="adminOrders"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <AdminOrdersPage supabase={supabase} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
