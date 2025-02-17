'use client';

import React, { useState, useEffect } from 'react';
import PageHeading from '@/components/PageHeading';
import { getDataMahasiswa } from '@/utils/localStorage';

const DataPembayaran = () => {
  const [dataPembayaran, setDataPembayaran] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Ambil data mahasiswa dan pembayaran dari localStorage
    const mahasiswaData = getDataMahasiswa();
    const existingPembayaran = mahasiswaData.map((mahasiswa) => {
      const pembayaranData = JSON.parse(localStorage.getItem(`pembayaran_${mahasiswa.nim}`)) || {};
      return {
        ...mahasiswa,
        statusPembayaran: pembayaranData.statusPembayaran || 'Belum Lunas',
        periode: pembayaranData.periode || 'Semester 1',
        nominal: pembayaranData.nominal || 1000000,
        metodePembayaran: pembayaranData.metodePembayaran || '-',
        tanggalPembayaran: pembayaranData.tanggalPembayaran || '-',
        catatan: pembayaranData.catatan || '-',
      };
    });

    setDataPembayaran(existingPembayaran);
  }, []);

  // Filter data berdasarkan pencarian dan status
  const filteredData = dataPembayaran.filter((item) => {
    const matchesSearch = (
      item.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gedung.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const matchesStatus = filterStatus === 'all' || item.statusPembayaran === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col">
        <PageHeading title="Data Pembayaran" />

        <div className="p-6">
          {/* Search and Filter Controls */}
          <div className="mb-4 flex gap-4">
            <input
              type="text"
              placeholder="Cari berdasarkan NIM, Nama, atau Gedung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded w-64"
            />
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">Semua Status</option>
              <option value="Lunas">Lunas</option>
              <option value="Belum Lunas">Belum Lunas</option>
            </select>
          </div>

          {/* Payment Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">NIM</th>
                  <th className="border p-2">Nama</th>
                  <th className="border p-2">Gedung</th>
                  <th className="border p-2">Kamar</th>
                  <th className="border p-2">Status Pembayaran</th>
                  <th className="border p-2">Periode</th>
                  <th className="border p-2">Nominal</th>
                  <th className="border p-2">Metode Pembayaran</th>
                  <th className="border p-2">Tanggal Pembayaran</th>
                  <th className="border p-2">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.nim}</td>
                    <td className="border p-2">{item.nama}</td>
                    <td className="border p-2">{item.gedung}</td>
                    <td className="border p-2">{item.noKamar}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded ${
                        item.statusPembayaran === 'Lunas' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.statusPembayaran}
                      </span>
                    </td>
                    <td className="border p-2">{item.periode}</td>
                    <td className="border p-2">Rp. {item.nominal.toLocaleString()}</td>
                    <td className="border p-2">{item.metodePembayaran}</td>
                    <td className="border p-2">{item.tanggalPembayaran}</td>
                    <td className="border p-2">{item.catatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPembayaran;