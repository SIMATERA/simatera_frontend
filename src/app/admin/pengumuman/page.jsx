'use client';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDataPengumuman, saveDataPengumuman } from '@/utils/localStorage';
import PageHeading from '@/components/PageHeading';

const CreatePengumuman = () => {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [pengumuman, setPengumuman] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setPengumuman(getDataPengumuman());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!judul || !deskripsi) {
      toast.error('Judul dan deskripsi harus diisi!');
      return;
    }

    let updatedPengumuman;
    if (editId) {
      updatedPengumuman = pengumuman.map((item) =>
        item.id === editId ? { ...item, judul, deskripsi } : item
      );
      setEditId(null);
      toast.success('Pengumuman berhasil diperbarui!');
    } else {
      const newPengumuman = {
        id: Date.now(),
        judul,
        deskripsi,
        tanggal: new Date().toLocaleDateString(),
      };
      updatedPengumuman = [...pengumuman, newPengumuman];
      toast.success('Pengumuman berhasil dibuat!');
    }

    saveDataPengumuman(updatedPengumuman);
    setPengumuman(updatedPengumuman);
    setJudul('');
    setDeskripsi('');
  };

  const handleEdit = (id) => {
    const item = pengumuman.find((p) => p.id === id);
    if (item) {
      setJudul(item.judul);
      setDeskripsi(item.deskripsi);
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    const updatedPengumuman = pengumuman.filter((p) => p.id !== id);
    saveDataPengumuman(updatedPengumuman);
    setPengumuman(updatedPengumuman);
    toast.success('Pengumuman berhasil dihapus!');
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] ">
      <div className="flex-1 flex flex-col">
        <PageHeading title="Pengumuman" />

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">
            {editId ? 'Edit Pengumuman' : 'Buat Pengumuman'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul</label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                rows="5"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {editId ? 'Update Pengumuman' : 'Buat Pengumuman'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setJudul('');
                    setDeskripsi('');
                    setEditId(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Daftar Pengumuman</h2>
            <div className="space-y-3">
              {pengumuman.length > 0 ? (
                pengumuman.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <h3 className="text-lg font-semibold">{item.judul}</h3>
                    <p className="text-sm text-gray-500 mb-1">{item.tanggal}</p>
                    <p className="text-gray-700">{item.deskripsi}</p>
                    <div className="mt-2 flex gap-4">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Belum ada pengumuman.</p>
              )}
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default CreatePengumuman;
