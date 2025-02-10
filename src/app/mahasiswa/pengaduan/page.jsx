'use client';
import { useState, useEffect } from 'react';
import {
  saveDataPengaduanMahasiswa,
  getDataPengaduanMahasiswa,
} from '@/utils/localStorage';
import { useAuth } from '@/utils/AuthContext';

const TABLE_HEAD = [
  'NIM',
  'Nama',
  'Gedung',
  'No Kamar',
  'Keterangan',
  'Tanggal',
  'Status',
  'Gambar',
];

const PengaduanPage = () => {
  const { user } = useAuth();
  const [nama, setNama] = useState('');
  const [nim, setNIM] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [gedung, setGedung] = useState('');
  const [kamar, setKamar] = useState('');
  const [gambar, setGambar] = useState('');
  const [pengaduanList, setPengaduanList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && user.nim) {
      const data = getDataPengaduanMahasiswa(user.nim);
      setPengaduanList(data);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setGambar(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert('Harap unggah file gambar yang valid!');
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama || !nim || !gedung || !kamar || !keterangan) {
      alert('Harap isi semua field!');
      return;
    }
    const newPengaduan = {
      nama,
      nim,
      gedung,
      kamar,
      keterangan,
      gambar,
      status: 'Belum Dikerjakan',
      tanggal: new Date().toLocaleDateString(),
    };
    const updatedList = [...pengaduanList, newPengaduan];
    if (user && user.nim) {
      saveDataPengaduanMahasiswa(user.nim, updatedList);
      setPengaduanList(updatedList);
    }
    setNama('');
    setNIM('');
    setGedung('');
    setKamar('');
    setKeterangan('');
    setGambar('');
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Form Pengaduan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ['Nama', nama, setNama],
            ['NIM', nim, setNIM],
            ['Gedung', gedung, setGedung],
            ['Kamar', kamar, setKamar],
          ].map(([label, value, setter], i) => (
            <div key={i}>
              <label className="block font-medium">{label}</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={value}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}
          <div>
            <label className="block font-medium">Keterangan</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows="4"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block font-medium">Gambar</label>
            <input
              type="file"
              className="w-full p-2 border rounded-md"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Kirim Pengaduan
          </button>
        </form>
      </div>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Data Pengaduan</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {TABLE_HEAD.map((item) => (
                <th key={item} className="border p-2">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pengaduanList.map((item, index) => (
              <tr key={index} className="text-center">
                {[
                  item.nim,
                  item.nama,
                  item.gedung,
                  item.kamar,
                  item.keterangan,
                  item.tanggal,
                ].map((data, i) => (
                  <td key={i} className="border p-2">
                    {data}
                  </td>
                ))}
                <td className="border p-2">
                  <span
                    className={`px-3 py-1 rounded text-white ${item.status === 'Belum Dikerjakan' ? 'bg-red-500' : item.status === 'Sedang Dikerjakan' ? 'bg-yellow-500' : 'bg-green-500'}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="border p-2">
                  {item.gambar && (
                    <img
                      src={item.gambar}
                      alt="Pengaduan"
                      className="w-16 h-16 object-cover cursor-pointer"
                      onClick={() => openModal(item.gambar)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closeModal}
          >
            <div
              className="max-w-7xl p-4 bg-white rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Detail Gambar"
                className="w-full h-auto"
              />
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={closeModal}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PengaduanPage;
