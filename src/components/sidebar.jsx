import { Home, Users, FileX, CreditCard, Megaphone, CalendarClock, Settings } from "lucide-react";

const Sidebar = ({ role, activeMenu, setActiveMenu }) => {
  const menuItems = {
    admin: [
      { name: "Beranda", key: "Beranda", icon: <Home size={20} /> },
      { name: "Data Penghuni", key: "Data Penghuni", icon: <Users size={20} /> },
      { name: "Data Pelanggaran", key: "Data Pelanggaran", icon: <FileX size={20} /> },
      { name: "Data Pembayaran", key: "Data Pembayaran", icon: <CreditCard size={20} /> },
      { name: "Data Pengaduan", key: "Data Pengaduan", icon: <Megaphone size={20} /> },
      { name: "Pengaturan", key: "Pengaturan", icon: <Settings size={20} /> }
    ],
    kasra: [
      { name: 'Beranda', key: 'Beranda', icon: <Home size={20} /> },
      { name: 'Data Penghuni', key: 'Data Penghuni', icon: <Users size={20} /> },
      { name: 'Data Pelanggaran', key: 'Data Pelanggaran', icon: <FileX size={20} /> },
      { name: "Data Pembayaran", key: "Data Pembayaran", icon: <CreditCard size={20} /> },
      { name: "Pengaduan", key: "pengaduan", icon: <Megaphone size={20} /> },
      { name: "Jadwal Kegiatan", key: "Jadwal Kegiatan", icon: <CalendarClock size={20} /> },
      { name: "Pengaturan", key: "Pengaturan", icon: <Settings size={20} /> }   
    ],
    mahasiswa: [
      { name: 'Beranda', key: 'Beranda', icon: <Home size={20} /> },
      { name: "Data Pelanggaran", key: "Data Pelanggaran", icon: <FileX size={20} /> },
      { name: "Data Pembayaran", key: "Data Pembayaran", icon: <CreditCard size={20} /> },
      { name: "Pengaduan", key: "Pengaduan", icon: <Megaphone size={20} /> },
      { name: "Jadwal Kegiatan", key: "Jadwal Kegiatan", icon: <CalendarClock size={20} /> },
      { name: "Pengaturan", key: "Pengaturan", icon: <Settings size={20} /> }
      
    ]
  };

return (
    <div className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4 h-full">
        <div className="flex flex-col items-center mb-6">
            <img src="/images/logoasrama.png" alt="Logo Asrama ITERA" className="w-16 h-16 mb-2" />
            <h2 className="text-xl font-bold text-center">
                Dashboard <br /> SIMATERA
            </h2>
        </div>
        <ul className="space-y-2">
            {menuItems[role]?.map((item) => (
                <li key={item.key}>
                    <button
                        onClick={() => setActiveMenu(item.key)}
                        className={`w-full flex items-center gap-2 text-left p-3 rounded-md ${
                            activeMenu === item.key ? "bg-orange-700" : "hover:bg-orange-700"
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
