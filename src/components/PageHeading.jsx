import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PageHeading({ title }) {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLogoutPromptVisible, setIsLogoutPromptVisible] = useState(false);
  const [dataUser, setDataUser] = useState(null);

  // Ambil user dari localStorage saat pertama kali component dipasang
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setDataUser(JSON.parse(storedUser)); // Parse data user
    }
  }, []);

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);
  const handleLogout = () => {
    setIsLogoutPromptVisible(true);
    setIsMenuVisible(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth'); // Redirect ke halaman login setelah logout
    setIsLogoutPromptVisible(false);
  };

  const cancelLogout = () => setIsLogoutPromptVisible(false);

  return (
    <div className="p-6 shadow-lg bg-white flex justify-between items-center relative">
      <span className="text-3xl text-[#828282] font-bold">{title}</span>

      <div className="flex gap-5 items-center relative">
        {dataUser ? (
          <>
            <p>
              {dataUser.email} ({dataUser.role})
            </p>{' '}
            {/* Menampilkan email dan role */}
            <Image
              src="/images/adminprofile.png"
              alt="Logo Profile"
              width={50}
              height={50}
              className="cursor-pointer"
              onClick={toggleMenu}
            />
            {isMenuVisible && (
              <div className="absolute right-0 mt-20 p-2 bg-white shadow-lg rounded-md w-32">
                <button
                  className="w-full text-red-600 hover:bg-red-100 p-2 rounded-md"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <p>Loading...</p> // Menampilkan loading jika user belum diambil
        )}
      </div>

      {isLogoutPromptVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>Apakah Anda yakin ingin logout?</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-md"
                onClick={confirmLogout}
              >
                Ya
              </button>
              <button
                className="bg-gray-300 py-2 px-4 rounded-md"
                onClick={cancelLogout}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
