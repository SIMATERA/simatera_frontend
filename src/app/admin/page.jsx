'use client';

import { useState } from 'react';
import PageHeading from '../../components/PageHeading';
import Sidebar from '../../components/sidebar';
import KelolaData from './datapenghuni/page';
import DataPelanggaran from './datapelanggaran/page';
// Import halaman Data Penghuni

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('Beranda');

  const adminName = 'Admin User';
  const profileImage = '/images/adminprofile.png'; // Path gambar profil

  return (
    <div className="flex h-screen bg-[#F5F6FA]">
      {/* Sidebar */}
      <Sidebar
        role="admin"
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

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
            <>
              <h1 className="text-3xl font-semibold">
                Selamat Datang di Dashboard
              </h1>
              <p>Ini adalah halaman beranda.</p>
            </>
          )}

          {activeMenu === 'Data Penghuni' && <KelolaData />}
          {activeMenu === 'Data Pelanggaran' && <DataPelanggaran />}
        </div>
      </div>
    </div>
  );
}
