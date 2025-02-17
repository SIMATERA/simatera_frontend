'use client';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FiEdit } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAllPelanggaran,
  getDataPelanggaranMahasiswa,
  saveDataPelanggaranMahasiswa,
} from '@/utils/localStorage';
import PageHeading from '@/components/PageHeading';

dayjs.extend(customParseFormat);

const TABLE_HEAD = [
  'NIM',
  'Nama',
  'Gedung',
  'No Kamar',
  'Tanggal Pelanggaran',
  'Keterangan Pelanggaran',
];

const DataPelanggaranKasra = () => {
  const [pelanggaranList, setPelanggaranList] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Saat komponen dimuat, ambil data pelanggaran global (agregat dari semua mahasiswa)
  useEffect(() => {
    const data = getAllPelanggaran();
    setPelanggaranList(data);
  }, []);

  // Fungsi untuk memulai proses edit (modal akan muncul dengan data violation yang akan diedit)
  const handleEdit = (pelanggaran) => {
    setShowModal(pelanggaran);
  };

  // Saat menyimpan edit, update violation pada data personal mahasiswa yang bersangkutan
  const handleSaveEdit = () => {
    if (!showModal.tanggalPelanggaran || !showModal.keterangan) {
      setErrorMessage('Tanggal dan Keterangan harus diisi!');
      return;
    }

    // Dapatkan NIM dari violation yang diedit
    const violationNim = showModal.nim;
    // Ambil data pelanggaran mahasiswa tersebut dari localStorage
    const studentViolations = getDataPelanggaranMahasiswa(violationNim);
    // Perbarui array pelanggaran untuk mahasiswa tersebut dengan menggantikan violation yang diedit
    const updatedStudentViolations = studentViolations.map((v) =>
      v.id === showModal.id ? { ...showModal } : v
    );
    // Simpan kembali data pelanggaran untuk mahasiswa tersebut
    saveDataPelanggaranMahasiswa(violationNim, updatedStudentViolations);

    // Untuk tampilan admin, kita perlu mengagregasi ulang data dari seluruh mahasiswa
    const updatedGlobalViolations = getAllPelanggaran();
    setPelanggaranList(updatedGlobalViolations);

    setShowModal(null);
    setErrorMessage('');
    toast.success('Data berhasil diubah');
  };

  return (
    <div className="flex ">
      <div className="flex-1 flex flex-col">
        <PageHeading title="Data Pelanggaran" />
        <div className="flex-1 p-6 ">
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="text-center">
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
              <tbody className="divide-y divide-gray-200">
                {pelanggaranList.map((pelanggaran) => (
                  <tr
                    key={`${pelanggaran.nim}_${pelanggaran.tanggalPelanggaran}`}
                    className="odd:bg-[#FDE9CC] even:bg-white"
                  >
                    <td className="px-4 py-2 text-sm">{pelanggaran.nim}</td>
                    <td className="px-4 py-2 text-sm">{pelanggaran.nama}</td>
                    <td className="px-4 py-2 text-sm">{pelanggaran.gedung}</td>
                    <td className="px-4 py-2 text-sm">{pelanggaran.noKamar}</td>
                    <td className="px-4 py-2 text-sm">
                      {dayjs(pelanggaran.tanggalPelanggaran, [
                        'DD/MM/YYYY',
                        'YYYY-MM-DD',
                      ]).format('DD/MM/YYYY')}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {pelanggaran.keterangan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default DataPelanggaranKasra;
