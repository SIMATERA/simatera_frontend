'use client';

import { useState, useEffect } from 'react';
import PageHeading from '../../components/PageHeading';
import Sidebar from '../../components/sidebar';

import DataPelanggaranMahasiswa from './datapelanggaran/page';
import { getDataPengumuman, getDataJadwalKegiatan } from '@/utils/localStorage';
import CreatePengaduan from '@/app/mahasiswa/pengaduan/page';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import DataPembayaranMahasiswa from '@/app/mahasiswa/datapembayaran/page';
import PengaduanPage from '@/app/mahasiswa/pengaduan/page';
import JadwalKegiatanMahasiswa from './jadwalkegiatan/page';
import Settings from './pengaturan/page';

export default function Mahasiswa() {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Beranda');
  const router = useRouter();

  const [mahasiswaName, setMahasiswaName] = useState('');

  const [pengumuman, setPengumuman] = useState([]);
  const [jadwalKegiatan, setJadwalKegiatan] = useState([]);

  useEffect(() => {
    if (!user) {
      router.replace('/');
    } else if (user.role !== 'mahasiswa') {
      router.replace(`/${user.role}`);
    }
  }, [user, router]);

  // Ambil data pengumuman
  useEffect(() => {
    const data = getDataPengumuman();
    if (data) {
      setPengumuman(data);
    }
  }, []);

  useEffect(() => {
    const data = getDataJadwalKegiatan();
    if (data) {
      setJadwalKegiatan(data);
    }
  }, []);

  // Handle menu change
  const handleMenuChange = (menuItem) => {
    setActiveMenu(menuItem);
  };

  const profileImage = '/images/mahasiswaprofile.png';

  const renderContent = () => {
    switch (activeMenu) {
      case 'Beranda':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Daftar Pengumuman</h1>
            <div className="space-y-4">
              {pengumuman.length > 0 ? (
                pengumuman.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h2 className="text-xl font-semibold">{item.judul}</h2>
                    <p className="text-sm text-blue-500">{item.tanggal}</p>
                    <p className="text-gray-700 mt-2">{item.deskripsi}</p>
                    {item.file && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.file.data;
                            link.download = item.file.name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Download {item.file.name}
                        </button>
                        <span className="text-sm text-gray-500">
                          {item.file.type.includes('pdf') ? 'PDF' : 'Word'}{' '}
                          Document
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Tidak ada pengumuman.
                </p>
              )}
            </div>
            <h1 className="text-2xl font-bold mb-6 mt-6">
              Daftar Jadwal Kegiatan
            </h1>
            <div className="space-y-4">
              {jadwalKegiatan.length > 0 ? (
                jadwalKegiatan.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h2 className="text-xl font-semibold">{item.judul}</h2>
                    <p className="text-sm text-blue-500">{item.tanggal}</p>
                    <p className="text-gray-700 mt-2">{item.deskripsi}</p>
                    {item.file && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.file.data;
                            link.download = item.file.name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Download {item.file.name}
                        </button>
                        <span className="text-sm text-gray-500">
                          {item.file.type.includes('pdf') ? 'PDF' : 'Word'}{' '}
                          Document
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Tidak ada jadwal kegiatan.
                </p>
              )}
            </div>
          </div>
        );

      case 'Data Pelanggaran':
        return <DataPelanggaran />;
      case 'Data Pembayaran':
        return <DataPembayaranMahasiswa />;
      case 'Pengaduan':
        return <PengaduanPage />;
      case 'Jadwal Kegiatan':
        return <JadwalKegiatanMahasiswa />;
      case 'Pengaturan':
        return <Settings />;

      default:
        return null;
    }
  };

  return (

    <div className="flex">
      <div className="flex-1 flex flex-col">
        {/* PageHeading bagian atas */}
        <PageHeading
          title={activeMenu}
          name={mahasiswaName}
          profileImage={profileImage}
        />

        {/* Konten utama */}
        {/* Main content */}
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>

    </div>
  );
}
