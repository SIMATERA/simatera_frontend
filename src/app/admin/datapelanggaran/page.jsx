"use client";
import { useEffect, useState } from "react";
import {
  getDataPelanggaran,
  saveDataPelanggaran,
} from "@/utils/localStorage";
import dayjs from "dayjs";

import { FiEdit } from "react-icons/fi";

const TABLE_HEAD = [
  "NIM",
  "Nama",
  "Gedung",
  "No Kamar",
  "Tanggal Pelanggaran",
  "Keterangan Pelanggaran",
  "Aksi",
];

const DataPelanggaran = () => {
  const [pelanggaranList, setPelanggaranList] = useState([]);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    const data = getDataPelanggaran();
    if (data) {
      setPelanggaranList(data);
    }
  }, []);

  const handleEdit = (pelanggaran) => {
    setShowModal(pelanggaran);
  };

  const [errorMessage, setErrorMessage] = useState("");

const handleSaveEdit = () => {
  // Validasi keterangan dan tanggal
  if (!showModal.tanggalPelanggaran || !showModal.keterangan) {
    setErrorMessage("Tanggal dan Keterangan harus diisi!");
    return;
  }

  const updatedList = pelanggaranList.map((item) =>
    item.id === showModal.id ? showModal : item
  );
  setPelanggaranList(updatedList);
  saveDataPelanggaran(updatedList);
  setShowModal(null);
  setErrorMessage(""); // Clear error message after saving
};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">Data Pelanggaran</h1>
      <table className="table-auto w-full px-4 py-2 border-collapse">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="bg-gray-400 px-4 py-2 border-r-1 border-black"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pelanggaranList.map((pelanggaran) => (
            <tr
              key={pelanggaran.id}
              className="px-4 py-2 odd:bg-[#FDE9CC] even:bg-white text-center"
            >
              <td>{pelanggaran.nim}</td>
              <td>{pelanggaran.nama}</td>
              <td>{pelanggaran.gedung}</td>
              <td>{pelanggaran.noKamar}</td>
              <td>{dayjs(pelanggaran.tanggalPelanggaran, ['DD/MM/YYYY', 'YYYY-MM-DD']).format('DD/MM/YYYY')}</td>
              <td>{pelanggaran.keterangan}</td>
              <td>
                <button
                  onClick={() => handleEdit(pelanggaran)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEdit size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {showModal ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Data Pelanggaran</h2>
            <input
              type="date"
              value={showModal.tanggalPelanggaran}
              onChange={(e) =>
                setShowModal({ ...showModal, tanggalPelanggaran: e.target.value })
              }
              className="block w-full border p-2 mb-2"
              max={new Date().toISOString().split("T")[0]}
              placeholder="Tanggal Pelanggaran"
              required
            />
            <input
              type="text"
              value={showModal.keterangan}
              onChange={(e) =>
                setShowModal({ ...showModal, keterangan: e.target.value })
              }
              className="block w-full border p-2 mb-2"
              placeholder="Keterangan"
              required
            />
             {errorMessage && (<p className="text-red-500 text-sm mb-2">{errorMessage}</p>)}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      ): null}
    </div>
  );
};

export default DataPelanggaran;