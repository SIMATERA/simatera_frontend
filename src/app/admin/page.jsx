'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/navigation';
import PageHeading from '../../components/PageHeading';
import Sidebar from '../../components/sidebar';
import KelolaData from './datapenghuni/page';
import DataPelanggaran from './datapelanggaran/page';
import CreatePengumuman from './pengumuman/page';
import DataPengaduanPage from './datapengaduan/page';
import DataPembayaran from './datapembayaran/page';
import { getDataPengumuman } from '@/utils/localStorage';

const AdminDashboard = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Beranda');
  const [pengumuman, setPengumuman] = useState([]);

  const adminName = 'Admin';
  const profileImage = '/images/adminprofile.png';

  // Proteksi route dan cek role
  useEffect(() => {
    if (!user) {
      router.replace('/');
    } else if (user.role !== 'admin') {
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

  // Handle menu change
  const handleMenuChange = (menuItem) => {
    setActiveMenu(menuItem);
  };

  // Render konten berdasarkan menu aktif
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
          </div>
        );
      case 'Pengumuman':
        return <CreatePengumuman />;
      case 'Data Penghuni':
        return <KelolaData />;
      case 'Data Pelanggaran':
        return <DataPelanggaran />;
      case 'Data Pembayaran':
        return <DataPembayaran />;
      case 'Data Pengaduan':
        return <DataPengaduanPage />;
      default:
        return null;
    }
  };

  // Loading state atau belum ada user
  if (!user) {
    return null;
  }

  return (
    <div className="flex ">
      {/* Konten utama */}
      <div className="flex-1 flex flex-col">
        <PageHeading
          title={activeMenu}
          name={adminName}
          profileImage={profileImage}
        />

        {/* Main content */}
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
