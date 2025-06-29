"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  'https://xxzpmjydzrjvbbifsywo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4enBtanlkenJqdmJiaWZzeXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODgwOTAsImV4cCI6MjA2NTc2NDA5MH0.Q6-I9_rGESfndmeHuJcmSTCFZQVYfru8J148qKJeEsg'
);

export default function PaymentPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(3600);

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!error) setOrder(data);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const dummyVA = {
    "BCA VA": "123456789012",
    "BNI VA": "987654321098",
    "BRI VA": "456789123456",
  };

  const dummyWallet = {
    DANA: "0812-3456-7890",
    OVO: "0821-9876-5432",
    GoPay: "0857-1234-5678",
  };

  if (!order) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Pembayaran Order #{order.id}</h1>

      <div className="bg-gray-900 p-6 rounded-lg space-y-4">
        <p>Game: <strong>{order.game_name}</strong></p>
        <p>Paket Diamond: <strong>{order.diamond_package}</strong></p>
        <p>Metode Pembayaran: <strong>{order.payment_method}</strong></p>

        {order.payment_type === "Bank Transfer" && (
          <p>Nomor Virtual Account: <strong>{dummyVA[order.payment_method]}</strong></p>
        )}

        {order.payment_type === "E-Wallet" && (
          <p>Transfer ke Nomor: <strong>{dummyWallet[order.payment_method]}</strong></p>
        )}

        {order.payment_type === "QRIS" && (
          <div>
            <p>Scan QR Code di bawah ini untuk membayar:</p>
            <img src="/dummy-qr.png" alt="QRIS" className="w-40 h-40 mt-2" />
          </div>
        )}

        <p className="text-yellow-400 mt-4">
          Lakukan pembayaran sebelum: <strong>{formatTime(timeLeft)}</strong>
        </p>

        {timeLeft === 0 && (
          <p className="text-red-400 mt-4 font-bold">Waktu pembayaran telah habis!</p>
        )}
      </div>
    </div>
  );
}
