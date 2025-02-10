import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PageHeading({ title }) {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLogoutPromptVisible, setIsLogoutPromptVisible] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const menuRef = useRef(null);

  // Ambil user dari localStorage saat component dipasang
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setDataUser(JSON.parse(storedUser)); // Parse data user
    }
  }, []);

  // Menutup menu jika klik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false);
      }
    };

    if (isMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuVisible]);

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  const handleLogout = () => {
    setIsLogoutPromptVisible(true);
    setIsMenuVisible(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    setIsLogoutPromptVisible(false);
    setDataUser(null);

    setTimeout(() => {
      router.push('/auth'); // Redirect setelah state diupdate
    }, 300);
  };

  const cancelLogout = () => setIsLogoutPromptVisible(false);

  return (
    <div className="p-6 shadow-lg bg-white flex justify-between w-full items-center">
      <span className="text-3xl text-[#828282] font-bold">{title}</span>

      <div className="flex gap-5 items-center ">
        {dataUser ? (
          <>
            <p>
              {dataUser.email} ({dataUser.role})
            </p>
            <Image
              src="/images/adminprofile.png"
              alt="Logo Profile"
              width={50}
              height={50}
              className="cursor-pointer"
              role="button"
              onClick={toggleMenu}
            />
            {isMenuVisible && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-20 p-2 bg-white shadow-lg rounded-md w-32"
              >
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
          <p>Loading...</p>
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
