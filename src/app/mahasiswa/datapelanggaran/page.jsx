'use client';
import { useEffect, useState } from 'react';
import {
  getDataPelanggaranMahasiswa,
  saveDataPelanggaranMahasiswa,
} from '@/utils/localStorage';
import dayjs from 'dayjs';
import { useAuth } from '@/utils/AuthContext';

import { FiEdit } from 'react-icons/fi';

const TABLE_HEAD = [
  'NIM',
  'Nama',
  'Gedung',
  'No Kamar',
  'Tanggal Pelanggaran',
  'Keterangan Pelanggaran',
  'Aksi',
];

const DataPelanggaran = () => {
  const { user } = useAuth();
  const [pelanggaranList, setPelanggaranList] = useState([]);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    if (user && user.nim) {
      const data = getDataPelanggaranMahasiswa(user.nim);
      setPelanggaranList(data);
    }
  }, [user]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold">Data Pelanggaran</h1>
      <div>
        <table className="min-w-full mt-4">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pelanggaranList.map((item, index) => (
              <tr
                key={index}
                className="odd:bg-[#FDE9CC] even:bg-white text-center"
              >
                <td className="px-4 py-2 text-sm">{item.nim}</td>
                <td className="px-4 py-2 text-sm">{item.nama}</td>
                <td className="px-4 py-2 text-sm">{item.gedung}</td>
                <td className="px-4 py-2 text-sm">{item.noKamar}</td>
                <td className="px-4 py-2 text-sm">
                  {dayjs(item.tanggalPelanggaran, [
                    'DD/MM/YYYY',
                    'YYYY-MM-DD',
                  ]).format('DD/MM/YYYY')}
                </td>
                <td className="px-4 py-2 text-sm">{item.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPelanggaran;
