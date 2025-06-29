"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xxzpmjydzrjvbbifsywo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4enBtanlkenJqdmJiaWZzeXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODgwOTAsImV4cCI6MjA2NTc2NDA5MH0.Q6-I9_rGESfndmeHuJcmSTCFZQVYfru8J148qKJeEsg');

const AdminProductsPage = () => {
  const [games, setGames] = useState([]);
  const [packages, setPackages] = useState([]);
  const [newGame, setNewGame] = useState({ game_name: '', imageFile: undefined });
  const [newPackage, setNewPackage] = useState({ game_id: '', package_name: '', price: '' });
  const [editPackage, setEditPackage] = useState({ id: '', package_name: '', price: '' });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchGames();
    fetchPackages();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchGames = async () => {
    const { data } = await supabase.from('games').select('*');
    setGames(data || []);
  };

  const fetchPackages = async () => {
    const { data } = await supabase.from('diamond_packages').select('*');
    setPackages(data || []);
  };

  const addGame = async () => {
    if (!newGame.game_name || !newGame.imageFile) {
      alert("Lengkapi nama game dan gambar!");
      return;
    }
    const uniqueName = `${Date.now()}-${newGame.imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("games")
      .upload(`images/${uniqueName}`, newGame.imageFile);
    if (uploadError) return alert("Upload gagal: " + uploadError.message);

    const { error: insertError } = await supabase.from("games").insert([{ name: newGame.game_name, image_url: uploadData?.path }]);
    if (insertError) return alert("Insert gagal: " + insertError.message);

    setNewGame({ game_name: '', imageFile: undefined });
    fetchGames();
    showToast("Game berhasil ditambahkan!");
  };

  const addPackage = async () => {
    if (!newPackage.game_id || !newPackage.package_name || !newPackage.price) return alert('Lengkapi semua data package');
    await supabase.from('diamond_packages').insert([{
      game_id: newPackage.game_id,
      package_name: newPackage.package_name,
      price: parseInt(newPackage.price),
    }]);
    setNewPackage({ game_id: '', package_name: '', price: '' });
    fetchPackages();
    showToast("Package berhasil ditambahkan!");
  };

  const deleteGame = async (id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus game ini beserta semua paketnya?');
    if (!confirmDelete) return;

    await supabase.from('diamond_packages').delete().eq('game_id', id);
    await supabase.from('games').delete().eq('id', id);
    fetchGames();
    fetchPackages();
    showToast("Game berhasil dihapus!");
  };

  const deletePackage = async (id) => {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus package ini?");
    if (!confirmDelete) return;

    await supabase.from('diamond_packages').delete().eq('id', id);
    fetchPackages();
    showToast("Package berhasil dihapus!");
  };

  const startEditPackage = (pkg) => {
    setEditPackage({ id: pkg.id, package_name: pkg.package_name, price: pkg.price });
  };

  const saveEditPackage = async () => {
    await supabase.from('diamond_packages').update({
      package_name: editPackage.package_name,
      price: parseInt(editPackage.price),
    }).eq('id', editPackage.id);
    setEditPackage({ id: '', package_name: '', price: '' });
    fetchPackages();
    showToast("Package berhasil diedit!");
  };

  return (
    <div className="text-white max-w-4xl mx-auto space-y-6 relative ">

      {/* Toast Notifikasi */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 px-4 py-2 rounded shadow-lg z-50 text-white text-center">
          {toastMessage}
        </div>
      )}

      <h2 className="text-2xl font-bold text-center">Manage Games</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Game Name"
          value={newGame.game_name}
          onChange={e => setNewGame({ ...newGame, game_name: e.target.value })}
          className="p-2 bg-gray-800 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setNewGame({ ...newGame, imageFile: e.target.files?.[0] })}
          className="p-2 bg-gray-800 rounded"
        />
        <button onClick={addGame} className="col-span-2 bg-green-500 p-2 rounded hover:bg-red-500 hover:font-bold">Add Game</button>
      </div>

      <h2 className="text-2xl font-bold text-center">Manage Diamond Packages</h2>
      <div className="grid grid-cols-3 gap-4">
        <select value={newPackage.game_id} onChange={e => setNewPackage({ ...newPackage, game_id: e.target.value })} className="p-2 bg-gray-800 rounded">
          <option value="">Select Game</option>
          {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <input
          placeholder="Package Name"
          value={newPackage.package_name}
          onChange={e => setNewPackage({ ...newPackage, package_name: e.target.value })}
          className="p-2 bg-gray-800 rounded"
        />
        <input
          placeholder="Price"
          type="number"
          value={newPackage.price}
          onChange={e => setNewPackage({ ...newPackage, price: e.target.value })}
          className="p-2 bg-gray-800 rounded"
        />
        <button onClick={addPackage} className="col-span-3 bg-green-500 p-2 rounded hover:bg-red-500 hover:font-bold">Add Package</button>
      </div>

      <div>
        <h3 className="text-xl mt-6 text-center">Existing Games & Packages</h3>
        {games.map(g => (
          <div key={g.id} className="bg-gray-900 p-4 mt-4 rounded">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">{g.name}</span>
              <button onClick={() => deleteGame(g.id)} className="bg-red-500 p-1 rounded">Delete Game</button>
            </div>
            <div className="ml-4 mt-2 space-y-2">
              {packages.filter(p => p.game_id === g.id).map(pkg => (
                <div key={pkg.id} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                  {editPackage.id === pkg.id ? (
                    <>
                      <input
                        value={editPackage.package_name}
                        onChange={e => setEditPackage({ ...editPackage, package_name: e.target.value })}
                        className="p-1 bg-gray-700 rounded mr-2"
                      />
                      <input
                        type="number"
                        value={editPackage.price}
                        onChange={e => setEditPackage({ ...editPackage, price: e.target.value })}
                        className="p-1 bg-gray-700 rounded mr-2"
                      />
                      <button onClick={saveEditPackage} className="bg-green-500 p-1 rounded">Save</button>
                    </>
                  ) : (
                    <>
                      <span>{pkg.package_name} (Rp{pkg.price.toLocaleString()})</span>
                      <div className="space-x-2">
                        <button onClick={() => startEditPackage(pkg)} className="bg-yellow-500 p-1 rounded">Edit</button>
                        <button onClick={() => deletePackage(pkg.id)} className="bg-red-500 p-1 rounded">Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductsPage;
