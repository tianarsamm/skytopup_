"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  'https://xxzpmjydzrjvbbifsywo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4enBtanlkenJqdmJiaWZzeXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODgwOTAsImV4cCI6MjA2NTc2NDA5MH0.Q6-I9_rGESfndmeHuJcmSTCFZQVYfru8J148qKJeEsg'
);

type Game = {
  id: string;
  name: string;
  image_url: string;
};

type DiamondPackage = {
  id: string;
  game_id: string;
  package_name: string;
  price: number;
};

const paymentOptions = {
  "Bank Transfer": ["BCA VA", "BNI VA", "BRI VA"],
  "E-Wallet": ["DANA", "OVO", "GoPay"],
  QRIS: ["QRIS"],
};

const generatePaymentInfo = (method: string) => {
  if (method === "QRIS") return { qrUrl: "/qr.svg" };
  if (["BCA VA", "BNI VA", "BRI VA"].includes(method))
    return { number: "1234567890" };
  if (["DANA", "OVO", "GoPay"].includes(method))
    return { number: "081234567890" };
  return {};
};

const PaymentDetail = ({
  method,
  type,
  onBack,
}: {
  method: string;
  type: string;
  onBack: () => void;
}) => {
  const [remainingTime, setRemainingTime] = useState(3600);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const payment = generatePaymentInfo(method);

  return (
    <div className="bg-black/60 text-white p-6 rounded w-full max-w-md space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Selesaikan Pembayaran</h2>
      <p className="text-center">Metode: {method} ({type})</p>

      {method === "QRIS" ? (
        <img src={payment.qrUrl} alt="QR Code" className="mx-auto w-48 h-48" />
      ) : (
        <div className="text-center">
          <p className="text-sm">Bayar ke nomor berikut:</p>
          <p className="text-xl font-bold mt-2">{payment.number}</p>
        </div>
      )}

      <p className="text-center mt-4 text-sm">
        Lakukan pembayaran sebelum:{" "}
        <span className="font-semibold">{formatTime(remainingTime)}</span>
      </p>

      {!paid ? (
        <button
          onClick={() => setPaid(true)}
          className="w-full bg-green-600 py-2 rounded hover:bg-green-500"
        >
          Saya Sudah Bayar
        </button>
      ) : (
        <p className="text-green-400 text-center font-semibold">
          ✅ Silakan login ke game untuk melihat hasil top up Anda.
        </p>
      )}

      <button
        onClick={onBack}
        className="mt-4 w-full bg-gray-700 py-2 rounded text-white hover:bg-gray-600"
      >
        Kembali ke Halaman Awal
      </button>
    </div>
  );
};

const TopUpPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [packages, setPackages] = useState<DiamondPackage[]>([]);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => { fetchGames(); }, []);

  const fetchGames = async () => {
    const { data, error } = await supabase.from('games').select('*');
    if (!error && data) setGames(data);
  };

  const fetchPackages = async (gameId: string) => {
    const { data, error } = await supabase
      .from('diamond_packages')
      .select('*')
      .eq('game_id', gameId);
    if (!error && data) setPackages(data);
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    fetchPackages(game.id);
    setSelectedPackageId('');
    setPaymentType('');
    setPaymentMethod('');
    setShowPayment(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !username || !selectedPackageId || !selectedGame || !paymentType || !paymentMethod) {
      alert("Lengkapi semua form sebelum membeli!");
      return;
    }

    const selectedPackage = packages.find(p => p.id === selectedPackageId);
    if (!selectedPackage) return;

    const { error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        username,
        game_name: selectedGame.name,
        diamond_package: selectedPackage.package_name,
        status: "Pending",
        payment_type: paymentType,      // <--- ini harus ada
        payment_method: paymentMethod,  // <--- ini harus ada
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (!error) {
      setShowPayment(true);
    } else {
      alert("Gagal menyimpan order.");
      console.error(error);
    }
  };

  const selectedPackageDetail = packages.find(p => p.id === selectedPackageId);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-white">What Game Will You Top Up</h1>

      {showPayment ? (
        <PaymentDetail
          method={paymentMethod}
          type={paymentType}
          onBack={() => {
            setShowPayment(false);
            setUserId('');
            setUsername('');
            setSelectedGame(null);
          }}
        />
      ) : !selectedGame ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {games.map((game) => (
            <div 
              key={game.id} 
              onClick={() => handleGameSelect(game)}
              className="cursor-pointer hover:scale-105 transition-transform"
            >
              <img
                src={supabase.storage.from("games").getPublicUrl(game.image_url).data.publicUrl}
                alt={game.name}
                className="w-60 h-60 object-contain"
              />
              <p className="text-center text-white mt-2">{game.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-black/50 p-6 rounded-md w-full max-w-md space-y-4">
          <h2 className="text-2xl text-white text-center">{selectedGame.name} Top Up Form</h2>

          <input type="text" placeholder="User ID" value={userId}
            onChange={(e) => setUserId(e.target.value)} required
            className="p-2 rounded bg-gray-800 text-white w-full" />

          <input type="text" placeholder="Username" value={username}
            onChange={(e) => setUsername(e.target.value)} required
            className="p-2 rounded bg-gray-800 text-white w-full" />

          <select value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value)} required
            className="p-2 rounded bg-gray-800 text-white w-full">
            <option value="">Pilih Diamond Package</option>
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.package_name} - Rp{pkg.price.toLocaleString()}
              </option>
            ))}
          </select>

          {selectedPackageDetail && (
            <p className="text-white text-center">
              Harga: Rp{selectedPackageDetail.price.toLocaleString()}
            </p>
          )}

          <select value={paymentType}
            onChange={(e) => { setPaymentType(e.target.value); setPaymentMethod(''); }}
            required className="p-2 rounded bg-gray-800 text-white w-full">
            <option value="">Pilih Jenis Pembayaran</option>
            {Object.keys(paymentOptions).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {paymentType && (
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required className="p-2 rounded bg-gray-800 text-white w-full"
            >
              <option value="">Pilih Metode</option>
              {paymentOptions[paymentType].map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          )}

          <button type="submit" className="bg-red-500 py-2 rounded w-full">
            Beli Sekarang
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedGame(null);
              setPackages([]);
              setSelectedPackageId('');
              setPaymentType('');
              setPaymentMethod('');
            }}
            className="text-red-400 underline text-sm block mt-2 text-center"
          >
            Kembali Pilih Game
          </button>
        </form>
      )}
    </div>
  );
};

export default TopUpPage;
