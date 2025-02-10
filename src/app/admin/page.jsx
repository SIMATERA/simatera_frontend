'use client';

import { useEffect, useState } from 'react';
import PageHeading from '../../components/PageHeading';
import Sidebar from '../../components/sidebar';
import KelolaData from './datapenghuni/page';
import DataPelanggaran from './datapelanggaran/page';
import CreatePengumuman from './pengumuman/page';
import DataPengaduanPage from './datapengaduan/page';
import { getDataPengumuman } from '@/utils/localStorage';
// Import halaman Data Penghuni

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('Beranda');

  const adminName = 'Admin';
  const profileImage = '/images/adminprofile.png'; // Path gambar profil

  const [pengumuman, setPengumuman] = useState([]);

  useEffect(() => {
    const data = getDataPengumuman();
    if (data) {
      setPengumuman(data);
    }
  }, []);

  return (
    <div className="flex  min-h-screen bg-[#F5F6FA]">
      {/* Konten utama */}
      <div className="flex-1 flex flex-col">
        <PageHeading
          title={activeMenu}
          name={adminName}
          profileImage={profileImage}
        />

        {/* Menampilkan konten berdasarkan menu yang dipilih */}
        <div className="flex-1 p-6">
          {activeMenu === 'Beranda' && (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Daftar Pengumuman</h1>
              <div className="space-y-4">
                {pengumuman.length > 0 ? (
                  pengumuman.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-lg shadow-md"
                    >
                      <h2 className="text-xl font-semibold">{item.judul}</h2>
                      <p className="text-sm text-blue-500">{item.tanggal}</p>
                      <p className="text-gray-700">{item.deskripsi}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Tidak ada pengumuman.</p>
                )}
              </div>
            </div>
          )}

          {/* {activeMenu === 'Pengumuman' && <CreatePengumuman />}
          {activeMenu === 'Data Penghuni' && <KelolaData />}
          {activeMenu === 'Data Pelanggaran' && <DataPelanggaran />}
          {activeMenu === 'Data Pengaduan' && <DataPengaduanPage />} */}
        </div>
      </div>
    </div>
  );
}
