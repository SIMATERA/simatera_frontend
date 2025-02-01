'use client';
import React from 'react';
import {
  MENU_ITEMS_ADMIN,
  MENU_ITEMS_KASRA,
  MENU_ITEMS_MAHASISWA,
} from '@/constant/menu';

const Sidebar = ({ role, activeMenu, setActiveMenu }) => {
  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return MENU_ITEMS_ADMIN;
      case 'kasra':
        return MENU_ITEMS_KASRA;
      case 'mahasiswa':
        return MENU_ITEMS_MAHASISWA;
      default:
        return [];
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4 h-full">
      <div className="flex flex-col items-center mb-6">
        <img
          src="/images/logoasrama.png"
          alt="Logo Asrama ITERA"
          className="w-16 h-16 mb-2"
        />
        <h2 className="text-xl font-bold text-center">
          Dashboard <br /> SIMATERA
        </h2>
      </div>
      <ul className="space-y-2">
        {getMenuItems().map((item) => (
          <li key={item.key}>
            <button
              onClick={() => setActiveMenu(item.key)}
              className={`w-full flex items-center gap-2 text-left p-3 rounded-md ${
                activeMenu === item.key
                  ? 'bg-orange-700'
                  : 'hover:bg-orange-700'
              }`}
            >
              {item.icon} {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
