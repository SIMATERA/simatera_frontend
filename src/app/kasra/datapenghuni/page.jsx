'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/AuthContext'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import PageHeading from '@/components/PageHeading';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { getDataMahasiswa, getDataPelanggaranMahasiswa, saveDataPelanggaranMahasiswa } from '@/utils/localStorage';

const TABLE_HEAD = [
  'NIM',
  'Nama',
  'Prodi',
  'Gedung',
  'No Kamar',
  'Email',
  'Tanggal Lahir',
  'Tempat Lahir',
  'Asal',
  'Status',
  'Golongan UKT',
  'Action',
];

const DataMahasiswaKasra = () => {
  const { user } = useAuth(); // Mendapatkan user yang sedang login
  const [dataMahasiswa, setDataMahasiswa] = useState([]);
  const [dataPelanggaran, setDataPelanggaran] = useState([]);
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    gedung: '',
    noKamar: '',
    tanggalPelanggaran: '',
    keteranganPelanggaran: '',
  });
  const [showPelanggaranForm, setShowPelanggaranForm] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  // Mengambil data mahasiswa dan pelanggaran dari localStorage
  useEffect(() => {
    const savedData = getDataMahasiswa();
    setDataMahasiswa(savedData);

    const savedPelanggaran = getDataPelanggaranMahasiswa();
    setDataPelanggaran(savedPelanggaran);
  }, [user]);

  // Kasra hanya bisa menambahkan pelanggaran
  const handleTambahPelanggaranKasra = (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setFormData({
      nim: mahasiswa.nim,
      nama: mahasiswa.nama,
      gedung: mahasiswa.gedung,
      noKamar: mahasiswa.noKamar,
      tanggalPelanggaran: '',
      keteranganPelanggaran: '',
    });
    setShowPelanggaranForm(true);
  };

  const handleSubmitPelanggaran = (e) => {
    e.preventDefault();
    
    // Ambil data pelanggaran lama dari localStorage
    const existingPelanggaran = getDataPelanggaranMahasiswa(selectedMahasiswa.nim);

    // Tambahkan data pelanggaran baru tanpa menghapus yang lama
    const updatedPelanggaran = [
      ...existingPelanggaran,
      { ...formData, id: existingPelanggaran.length + 1 },
    ];

    // Simpan kembali ke localStorage
    saveDataPelanggaranMahasiswa(selectedMahasiswa.nim, updatedPelanggaran);

    // Update state pelanggaran
    setDataPelanggaran(updatedPelanggaran);

    setShowPelanggaranForm(false);
    setFormData({
      nim: '',
      nama: '',
      gedung: '',
      noKamar: '',
      tanggalPelanggaran: '',
      keteranganPelanggaran: '',
    });

    toast.success('Pelanggaran berhasil ditambahkan');
  };

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col">
        <PageHeading title="Data Mahasiswa Kasra" />
        <div className="flex-1 p-6">
        {showPelanggaranForm && (
          <div className="flex flex-col w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Tambah Pelanggaran</h2>
            <form onSubmit={handleSubmitPelanggaran}>
              <div>
                <label className="block text-sm font-medium">NIM</label>
                <input
                  type="text"
                  value={formData.nim}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Nama</label>
                <input
                  type="text"
                  value={formData.nama}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Gedung</label>
                <input
                  type="text"
                  value={formData.gedung}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">No Kamar</label>
                <input
                  type="text"
                  value={formData.noKamar}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Tanggal Pelanggaran</label>
                <input
                  type="date"
                  value={formData.tanggalPelanggaran}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tanggalPelanggaran: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Keterangan</label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      keterangan: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md mt-4"
              >
                Simpan Pelanggaran
              </button>
            </form>
          </div>
        )}
        {/* Tabel data mahasiswa */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
                
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dataMahasiswa.map((mahasiswa) => (
                <tr key={mahasiswa.nim} className="odd:bg-[#FDE9CC] even:bg-white">
                <td className="px-4 py-2 text-sm">{mahasiswa.nim}</td>
                    <td className="px-4 py-2 text">{mahasiswa.nama}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.prodi}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.gedung}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.noKamar}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.email}</td>
                    <td className="px-4 py-2 text-sm">
                      {mahasiswa.tanggalLahir}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {mahasiswa.tempatLahir}
                    </td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.asal}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.status}</td>
                    <td className="px-4 py-2 text-sm text-center">
                      {mahasiswa.golonganUKT}
                    </td>
                  <td className="px-4 py-2 text-sm">
                  <button
                          onClick={() => handleTambahPelanggaranKasra(mahasiswa)}
                          className="p-1 hover:text-yellow-600"
                        >
                          <ExclamationTriangleIcon className="h-5 w-5" />
                        </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        {/* Form untuk menambah pelanggaran */}
        

        
      </div>

      <ToastContainer />
    </div>
  );
};

export default DataMahasiswaKasra;
