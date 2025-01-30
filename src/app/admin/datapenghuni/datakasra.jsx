import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { BsPlusLg, BsTrashFill } from "react-icons/bs";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { getDataKasra, saveDataKasra, clearDataKasra } from "@/utils/localStorage";

const TABLE_HEAD = [
  "NIM",
  "Nama",
  "Prodi",
  "Gedung",
  "No Kamar",
  "Email",
  "Tempat Lahir",
  "Tanggal Lahir",
  "Asal",
  "Beasiswa",
  "Golongan UKT",
  "Action"
];

// Data dummy kasra
const dummyData = [
  {
    id: 1,
    nim: "21012345",
    nama: "John Doe",
    prodi: "Teknik Informatika",
    gedung: "TB1",
    noKamar: "A101",
    email: "john@example.com",
    tempatLahir: "Jakarta",
    tanggalLahir: "2000-01-01",
    asal: "Jakarta",
    golonganUKT: 3,
    beasiswa: "Bidikmisi"
  }
];

const DataKasra = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [DataKasra, setDataKasra] = useState(() => {
    const savedData = getDataKasra();
    return savedData.length > 0 ? savedData : dummyData;
  });
  const [dataEditKasra, setDataEditKasra] = useState({});
  
  const initialFormState = {
    nim: "",
    nama: "",
    prodi: "",
    gedung: "TB1",
    noKamar: "",
    email: "",
    tempatLahir: "",
    tanggalLahir: "",
    asal: "",
    golonganUKT: 1,
    beasiswa: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  
  useEffect(() => {
    saveDataKasra(DataKasra);
  }, [DataKasra]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!formData.nim || !formData.nama || !formData.email) {
      setErrorMessage("NIM, Nama, dan Email wajib diisi!");
      return;
    }
    setIsLoading(true);
    const idd = toast.loading("Create Data Kasra...");
    
    const newKasra = { 
      ...formData, 
      id: Date.now(),
      tanggalLahir: formData.tanggalLahir || new Date().toISOString().split('T')[0]
    };
    
    // Update state dan otomatis tersimpan ke localStorage via useEffect
    setDataKasra(prev => [...prev, newKasra]);
    toast.update(idd, {
        render: "Data berhasil ditambahkan",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    setFormData(initialFormState);
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const kasra = DataKasra.find(m => m.id === id);
    setDataEditKasra({ ...kasra });
    setShowModal(true);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    // Update data di state
    if (!dataEditKasra.nim || !dataEditKasra.nama || !dataEditKasra.email) {
        setEditErrorMessage("NIM, Nama, dan Email wajib diisi!");
        return;
      }
    setIsLoading(false);
    const idd = toast.loading("Edit Data Kasra...");
    setDataKasra(prev => 
    prev.map(item => 
      item.id === dataEditKasra.id ? {...dataEditKasra} : item
    )
  );
    
  toast.update(idd, {
    render: "Data berhasil diubah",
    type: "success",
    isLoading: false,
    autoClose: 1000,
  });
    setEditErrorMessage("");
    setShowModal(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Filter data dan update state
        const filteredData = DataKasra.filter(m => m.id !== id);
        setDataKasra(filteredData);
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }
    });
  };
  return (
    <>
    <ToastContainer />
      {showForm ? (
        <div className="flex flex-col justify-center items-center mt-5">
          <h1 className="text-3xl font-bold mb-5">Form Data Kasra</h1>
          <div className="flex flex-col bg-white p-10 rounded-xl divide-y w-full max-w-4xl">
            <div>
              <h1 className="text-2xl font-bold mb-5">Tambah Kasra Baru</h1>
              {errorMessage && (
                <p className="text-red-500 font-semibold mb-3">{errorMessage}</p>
              )}
            </div>
            <form onSubmit={handleSubmitAdd} className="pt-5 grid grid-cols-2 gap-4">
              {/* NIM */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                  NIM
                </label>
                <input
                  type="text"
                  name="nim"
                  value={formData.nim}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Nama */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Prodi */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                  Program Studi
                </label>
                <input
                  type="text"
                  name="prodi"
                  value={formData.prodi}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Gedung */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                  Gedung
                </label>
                <select
                  name="gedung"
                  value={formData.gedung}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {["TB1", "TB2", "TB3", "TB4", "TB5"].map((gedung) => (
                    <option key={gedung} value={gedung}>
                      {gedung}
                    </option>
                  ))}
                </select>
              </div>

              {/* No Kamar */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                  Nomor Kamar
                </label>
                <input
                  type="text"
                  name="noKamar"
                  value={formData.noKamar}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Tempat Lahir */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Asal */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                    Asal
                </label>
                <input
                  type="text"
                  name="asal"
                  value={formData.asal}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Golongan UKT */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                  Golongan UKT
                </label>
                <select
                  name="golonganUKT"
                  value={formData.golonganUKT}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {["1", "2", "3", "4", "5", "6", "7", "8"].map((golonganUKT) => (
                    <option key={golonganUKT} value={golonganUKT}>
                      {golonganUKT}
                    </option>
                  ))}
                </select>
              </div>

              {/* Beasiswa */}
              <div className="form-group">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                    Beasiswa
                </label>
                <input
                  type="text"
                  name="beasiswa"
                  value={formData.beasiswa}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Tombol */}
              <div className="col-span-2 flex justify-center gap-4 mt-6">
                <button
                  type="submit"
                  className="btn bg-orange-500 text-white hover:bg-orange-600"
                >
                  Tambah Kasra
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-ghost"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white m-5 rounded-lg">
          <div className="flex justify-between p-5">
            <h1 className="text-3xl font-bold">Data Kasra</h1>
            <button
              className="btn bg-[#FDE9CC] hover:bg-[#E0924A] text-gray-500 hover:text-white"
              onClick={() => setShowForm(true)}
            >
              <BsPlusLg size={20} />
              <span>Tambah Kasra</span>
            </button>
          </div>
          
          <div className="overflow-x-auto p-5">
            <table className="table w-full">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="bg-gray-100">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DataKasra.map((kasra) => (
                  <tr key={kasra.id}>
                    <td>{kasra.nim}</td>
                    <td>{kasra.nama}</td>
                    <td>{kasra.prodi}</td>
                    <td>{kasra.gedung}</td>
                    <td>{kasra.noKamar}</td>
                    <td>{kasra.email}</td>
                    <td>{kasra.tanggalLahir}</td>
                    <td>{kasra.tempatLahir}</td>
                    <td>{kasra.asal}</td>
                    <td>{kasra.beasiswa}</td>
                    <td>{kasra.golonganUKT}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(kasra.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FiEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(kasra.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <BsTrashFill size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {showModal ? (
  <>
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative w-auto my-6 mx-auto max-w-3xl">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex flex-col justify-center items-start px-5 pt-5 pb-2 border-b border-solid border-blueGray-200 rounded-t">
            <h3 className="text-3xl font-bold pb-2">
              Form Edit Data Kasra
            </h3>
            <p>Update Data Kasra dengan Teliti</p>
            <p className={`${editErrorMessage ? "py-3" : ""} text-red-500 font-semibold`}>
              {editErrorMessage}
            </p>
          </div>
          <div className="relative p-6 flex-auto">
            <form 
              className="grid grid-cols-2 gap-4"
              onSubmit={(e) => handleSubmitEdit(e, dataEditKasra.id)}
            >
              {/* Kolom Kiri */}
              <div className="space-y-4">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    NIM
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    value={dataEditKasra.nim || ''}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, nim: e.target.value})}
                    required
                  />
                </div>

                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Nama
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    value={dataEditKasra.nama || ''}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, nama: e.target.value})}
                    required
                  />
                </div>

                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Prodi
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    value={dataEditKasra.prodi || ''}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, prodi: e.target.value})}
                  />
                </div>

                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Gedung
                  </label>
                  <select
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    value={dataEditKasra.gedung || 'TB1'}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, gedung: e.target.value})}
                  >
                    {['TB1', 'TB2', 'TB3', 'TB4', 'TB5'].map(gedung => (
                      <option key={gedung} value={gedung}>{gedung}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-4">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    No Kamar
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    value={dataEditKasra.noKamar || ''}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, noKamar: e.target.value})}
                  />
                </div>

                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Email
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="email"
                    value={dataEditKasra.email || ''}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, email: e.target.value})}
                  />
                </div>

                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Tempat Lahir
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    value={dataEditKasra.tempatLahir || ''}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, tempatLahir: e.target.value})}
                  />
                </div>

                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Tanggal Lahir
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="date"
                    value={dataEditKasra.tanggalLahir || ''}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, tanggalLahir: e.target.value})}
                  />
                </div>
              </div>

              {/* Baris Bawah */}
              <div className="col-span-2 space-y-4">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Asal
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    value={dataEditKasra.asal || ''}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, asal: e.target.value})}
                  />
                </div>

                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Golongan UKT
                  </label>
                  <select
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    value={dataEditKasra.golonganUKT || 1}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, golonganUKT: e.target.value})}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(golongan => (
                      <option key={golongan} value={golongan}>Golongan {golongan}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Beasiswa
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    value={dataEditKasra.beasiswa || ''}
                    onChange={(e) => setDataEditKasra({...dataEditKasra, beasiswa: e.target.value})}
                  />
                </div>
              </div>

              {/* Tombol */}
              <div className="col-span-2 flex justify-center gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </>
) : null}
    </>
  );
};

export default DataKasra;