'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveDataPengaduanMahasiswa, getDataPengaduanMahasiswa, getDataMahasiswa } from '@/utils/localStorage';
import { useAuth } from '@/utils/AuthContext';
import PageHeading from '@/components/PageHeading';

const TABLE_HEAD = [
  'ID',
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
  const [showForm, setShowForm] = useState(false);  // Track the visibility of the form
  const [dataMahasiswa, setDataMahasiswa] = useState(null);

  useEffect(() => {
    if (user?.nim) {
      const savedData = getDataMahasiswa();
      const mahasiswa = savedData.find(item => item.nim === user.nim);
      setDataMahasiswa(mahasiswa);

      if (mahasiswa) {
        setNama(mahasiswa.nama);
        setNIM(mahasiswa.nim);
        setGedung(mahasiswa.gedung);
        setKamar(mahasiswa.noKamar);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user?.nim) {
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
    if (!keterangan) {
      alert('Harap isi semua field!');
      return;
    }

    const newPengaduan = {
      id: uuidv4(), // Generate unique ID
      nama,
      nim,
      gedung,
      kamar,
      keterangan,
      gambar,
      status: 'Belum Dikerjakan',
      tanggal: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(), // Add timestamp for sorting
      type: 'mahasiswa',
    };

    const updatedList = [...pengaduanList, newPengaduan];
    // Sort by creation date, newest first
    updatedList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (user?.nim) {
      saveDataPengaduanMahasiswa(user.nim, updatedList);
      setPengaduanList(updatedList);
    }

    setKeterangan('');
    setGambar('');
    setShowForm(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeading title="Pengaduan Mahasiswa" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          {/* Button to show/hide form */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {showForm ? 'Batal' : 'Tambah Pengaduan'}
          </button>
        </div>

        {/* Form Section (Overlay) */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-4">Form Pengaduan Kasra</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium">Nama</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block font-medium">NIM</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={nim}
                    onChange={(e) => setNIM(e.target.value)}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block font-medium">Gedung</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={gedung}
                    onChange={(e) => setGedung(e.target.value)}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block font-medium">No Kamar</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={kamar}
                    onChange={(e) => setKamar(e.target.value)}
                    readOnly
                  />
                </div>

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
                <button
                  onClick={() => setShowForm(false)}
                  className="w-full bg-red-300 text-white py-2 rounded-md hover:bg-red-600"
                >
                  batal
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Data Pengaduan Section */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="text-center">
                {TABLE_HEAD.map((item) => (
                      <th key={item} className="px-4 py-3 text-sm">{item}</th>
                    ))}
              </tr>
            </thead>
            <tbody>
              {pengaduanList.map((item) => (
                <tr key={item.id} className="odd:bg-[#FDE9CC] even:bg-white">
                  <td className="px-4 py-3 text-sm">{item.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-sm">{item.nim}</td>
                  <td className="px-4 py-3 text-sm">{item.nama}</td>
                  <td className="px-4 py-3 text-sm">{item.gedung}</td>
                  <td className="px-4 py-3 text-sm">{item.kamar}</td>
                  <td className="px-4 py-3 text-sm">{item.keterangan}</td>
                  <td className="px-4 py-3 text-sm">{item.tanggal}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                          className={`px-3 py-1 rounded text-white ${item.status === 'Belum Dikerjakan'
                              ? 'bg-red-500'
                              : item.status === 'Sedang Dikerjakan'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
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
        </div>

        {/* Image Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
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