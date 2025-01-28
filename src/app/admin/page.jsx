"use client";

import { useState } from "react";
import PageHeading from "../../components/PageHeading";
import Sidebar from "../../components/sidebar";

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Beranda");

  const adminName = "Admin User";
  const profileImage = "/images/adminprofile.png"; // Ganti dengan path gambar profil

  return (
    <div className="flex h-screen bg-[#F5F6FA]">
      {/* Sidebar dengan role admin */}
      <Sidebar role="admin" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="flex-1 flex flex-col">
        {/* PageHeading bagian atas */}
        <PageHeading title={activeMenu} name={adminName} profileImage={profileImage} />

        {/* Konten utama */}
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-semibold capitalize">{activeMenu}</h1>
          <p>Konten untuk {activeMenu}</p>
        </div>
      </div>
    </div>
  );
}

