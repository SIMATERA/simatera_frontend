'use client';

import { useState, useEffect } from 'react';
import PageHeading from '../../components/PageHeading';
import Sidebar from '../../components/sidebar';
import DataPelanggaranMahasiswa from './datapelanggaran/page';
import { getDataPengumuman } from '@/utils/localStorage';
import CreatePengaduan from '@/app/mahasiswa/pengaduan/page';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';

export default function Mahasiswa() {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Beranda');

  const [mahasiswaName, setMahasiswaName] = useState('');

  const [pengumuman, setPengumuman] = useState([]);

  useEffect(() => {
    // Pengumuman global
    setPengumuman(getDataPengumuman());
    // Data pribadi (jika user ada)
    if (user && user.nim) {
      // setPelanggaranCount(getDataPelanggaranMahasiswa(user.nim).length);
      // setPengaduanCount(getDataPengaduanMahasiswa(user.nim).length);
    }
  }, [user]);
  const profileImage = '/images/mahasiswaprofile.png'; // Ganti dengan path gambar profil
  useEffect(() => {
    const data = getDataPengumuman();
    if (data) {
      setPengumuman(data);
    }
  }, []);

  return (
    <div className="flex bg-[#F5F6FA]">
      <div className="flex-1 flex flex-col">
        {/* PageHeading bagian atas */}
        <PageHeading
          title={activeMenu}
          name={mahasiswaName}
          profileImage={profileImage}
        />

        {/* Konten utama */}
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
        </div>
      </div>
    </div>
  );
}
