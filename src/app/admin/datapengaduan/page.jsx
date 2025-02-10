'use client';
import { useState, useEffect } from 'react';
import {
  saveDataPengaduanMahasiswa,
  getDataPengaduanMahasiswa,
  getAllPengaduan,
} from '@/utils/localStorage';
import PageHeading from '@/components/PageHeading';

const TABLE_HEAD = [
  'NIM',
  'Nama',
  'Gedung',
  'No Kamar',
  'Keterangan',
  'Status',
  'Tanggal',
  'Aksi',
  'Gambar',
];

const DataPengaduanPage = () => {
  const [pengaduanList, setPengaduanList] = useState([]);

  useEffect(() => {
    const data = getAllPengaduan();
    setPengaduanList(data);
  }, []);

  const updateStatus = (index, newStatus) => {
    const nim = index.nim; // pastikan index memiliki properti nim
    // Ambil data pengaduan personal untuk mahasiswa tersebut
    const personalPengaduan = getDataPengaduanMahasiswa(nim);
    const updatedPersonalPengaduan = personalPengaduan.map((v) =>
      v.id === index.id ? { ...v, status: newStatus } : v
    );
    // Simpan data personal yang diperbarui untuk mahasiswa tersebut
    saveDataPengaduanMahasiswa(String(nim), updatedPersonalPengaduan);
    // Perbarui data global dengan mengagregasi ulang
    const updatedGlobalPengaduan = getAllPengaduan();
    setPengaduanList(updatedGlobalPengaduan);
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] ">
      <div className="flex-1 flex flex-col">
        <PageHeading title="Data Pengaduan" />

        <div className="flex-1 p-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {TABLE_HEAD.map((item) => (
                  <th key={item} className="border p-1">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pengaduanList.map((pengaduan) => (
                <tr
                  key={`${pengaduan.nim}_${pengaduan.tanggal}`}
                  className="text-center"
                >
                  <td className="border p-2">{pengaduan.nim}</td>
                  <td className="border p-2">{pengaduan.nama}</td>
                  <td className="border p-2">{pengaduan.gedung}</td>
                  <td className="border p-2">{pengaduan.kamar}</td>
                  <td className="border p-2">{pengaduan.keterangan}</td>
                  <td className="border p-2">
                    <span
                      className={`px-3 py-1 rounded text-white ${
                        pengaduan.status === 'Belum Dikerjakan'
                          ? 'bg-red-500'
                          : pengaduan.status === 'Sedang Dikerjakan'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                    >
                      {pengaduan.status}
                    </span>
                  </td>
                  <td className="border p-2">{pengaduan.tanggal}</td>
                  <td className="border p-1 text-left">
                    <select
                      className="p-1 border rounded"
                      value={pengaduan.status}
                      onChange={(e) => updateStatus(pengaduan, e.target.value)}
                    >
                      <option value="Belum Dikerjakan">Belum Dikerjakan</option>
                      <option value="Sedang Dikerjakan">
                        Sedang Dikerjakan
                      </option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    {pengaduan.gambar ? (
                      <img
                        src={
                          pengaduan.gambar.startsWith('data:image')
                            ? pengaduan.gambar
                            : '/placeholder-image.png'
                        }
                        alt="Pengaduan"
                        className="w-16 h-16 object-cover cursor-pointer"
                        onClick={() => openModal(pengaduan.gambar)}
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada gambar</span>
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
    </div>
  );
};

export default DataPengaduanPage;
