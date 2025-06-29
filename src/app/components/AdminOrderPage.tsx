"use client";
import { useState, useEffect } from 'react';

export default function AdminOrdersPage({ supabase }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        username,
        game_name,
        diamond_package,
        status,
        created_at,
        payment_type,
        payment_method
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
  }

  async function handleDelete(id) {
    const confirm = window.confirm("Yakin ingin menghapus order ini?");
    if (!confirm) return;

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Gagal menghapus order.");
      console.error(error);
    } else {
      fetchOrders();
    }
  }

  return (
    <div className="text-white">
      <h2 className="text-4xl mb-4 font-bold text-center">ORDERS LIST</h2>
      <div className="overflow-x-auto w-full px-4">
        <div className="inline-block min-w-full rounded shadow-lg backdrop-blur-md bg-black/10">
          <table className="min-w-full">
            <thead>
              <tr>
            <th className="px-3 py-2 text-center">Order ID</th>
            <th className="px-3 py-2 text-center">User ID</th>
            <th className="px-3 py-2 text-center">Username</th>
            <th className="px-3 py-2 text-center">Game</th>
            <th className="px-3 py-2 text-center">Diamond Package</th>
            <th className="px-3 py-2 text-center">Status</th>
            <th className="px-3 py-2 text-center">Tanggal</th>
            <th className="px-3 py-2 text-center">Jenis Pembayaran</th>
            <th className="px-3 py-2 text-center">Metode Pembayaran</th>
            <th className="px-3 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
          <tr key={o.id} className="border-b border-gray-700 text-center">
            <td className="px-3 py-2">{o.id}</td>
            <td className="px-3 py-2">{o.user_id}</td>
            <td className="px-3 py-2">{o.username}</td>
            <td className="px-3 py-2">{o.game_name}</td>
            <td className="px-3 py-2">{o.diamond_package}</td>
            <td className="px-3 py-2">{o.status || 'Pending'}</td>
            <td className="px-3 py-2">{o.created_at?.slice(0, 10)}</td>
            <td className="px-3 py-2">{o.payment_type}</td>
            <td className="px-3 py-2">{o.payment_method}</td>
            <td className="px-3 py-2">
              <button
                onClick={() => handleDelete(o.id)}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Hapus
              </button>
            </td>
          </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
