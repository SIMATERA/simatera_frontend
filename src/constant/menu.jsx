import {
  Home,
  Users,
  FileX,
  CreditCard,
  Megaphone,
  CalendarClock,
  Settings,
} from 'lucide-react';

export const MENU_ITEMS_ADMIN = [
  { name: 'Beranda', key: 'Beranda', icon: <Home size={20} /> },
  {
    name: 'Pengumuman', 
    key: 'Pengumuman', 
    icon: <Megaphone size={20} />},
  { name: 'Data Penghuni', key: 'Data Penghuni', icon: <Users size={20} /> },
  {
    name: 'Data Pelanggaran',
    key: 'Data Pelanggaran',
    icon: <FileX size={20} />,
  },
  {
    name: 'Data Pembayaran',
    key: 'Data Pembayaran',
    icon: <CreditCard size={20} />,
  },
  {
    name: 'Data Pengaduan',
    key: 'Data Pengaduan',
    icon: <Megaphone size={20} />,
  },
  { 
    name: 'Pengaturan', 
    key: 'Pengaturan', 
    icon: <Settings size={20} /> },

  
];

export const MENU_ITEMS_KASRA = [
  { name: 'Beranda', key: 'Beranda', icon: <Home size={20} /> },
  { name: 'Data Penghuni', key: 'Data Penghuni', icon: <Users size={20} /> },
  {
    name: 'Data Pelanggaran',
    key: 'Data Pelanggaran',
    icon: <FileX size={20} />,
  },
  {
    name: 'Data Pembayaran',
    key: 'Data Pembayaran',
    icon: <CreditCard size={20} />,
  },
  { name: 'Pengaduan', key: 'pengaduan', icon: <Megaphone size={20} /> },
  {
    name: 'Jadwal Kegiatan',
    key: 'Jadwal Kegiatan',
    icon: <CalendarClock size={20} />,
  },
  { name: 'Pengaturan', key: 'Pengaturan', icon: <Settings size={20} /> },
];

export const MENU_ITEMS_MAHASISWA = [
  { name: 'Beranda', key: 'Beranda', icon: <Home size={20} /> },
  {
    name: 'Data Pelanggaran',
    key: 'Data Pelanggaran',
    icon: <FileX size={20} />,
  },
  {
    name: 'Data Pembayaran',
    key: 'Data Pembayaran',
    icon: <CreditCard size={20} />,
  },
  { name: 'Pengaduan', key: 'Pengaduan', icon: <Megaphone size={20} /> },
  {
    name: 'Jadwal Kegiatan',
    key: 'Jadwal Kegiatan',
    icon: <CalendarClock size={20} />,
  },
  { name: 'Pengaturan', key: 'Pengaturan', icon: <Settings size={20} /> },
];
