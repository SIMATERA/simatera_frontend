"use client";

import { useState, useEffect } from "react";
import PageHeading from "../../components/PageHeading";
import Sidebar from "../../components/sidebar";

export default function Mahasiswa() {
  const [activeMenu, setActiveMenu] = useState("Beranda");

  const [mahasiswaName, setMahasiswaName] = useState("");

  useEffect(() => {
    // Fetch the user data from an API or local storage
    const fetchUserData = async () => {
      const userData = await getUserData(); // Replace with actual data fetching logic
      setMahasiswaName(userData.name);
    };

    const getUserData = async () => {
      // Replace with actual data fetching logic
      return { name: "John Doe" };
    };

    fetchUserData();
  }, []);
  const profileImage = "/images/mahasiswaprofile.png"; // Ganti dengan path gambar profil

  return (
    <div className="flex h-screen bg-[#F5F6FA]">
      {/* Sidebar dengan role mahasiswa */}
      <Sidebar role="mahasiswa" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="flex-1 flex flex-col">
        {/* PageHeading bagian atas */}
        <PageHeading title={activeMenu} name={mahasiswaName} profileImage={profileImage} />

        {/* Konten utama */}
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-semibold capitalize">{activeMenu}</h1>
          <p>Konten untuk {activeMenu}</p>
        </div>
      </div>
    </div>
  );
}