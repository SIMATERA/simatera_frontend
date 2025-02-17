import { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import {
  ExclamationTriangleIcon,
  TrashIcon,
  PlusIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import 'react-toastify/dist/ReactToastify.css';
import {
  getDataMahasiswa,
  saveDataMahasiswa,
  clearDataMahasiswa,
  getDataPelanggaranMahasiswa,
  saveDataPelanggaranMahasiswa,
} from '@/utils/localStorage';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ActionDropdown from '@/components/ActionDropdown';

dayjs.extend(customParseFormat);
const formatTanggal = (tanggal) => {
  if (!tanggal) return 'Invalid Date';

  // Jika berupa angka (serial Excel)
  if (typeof tanggal === 'number') {
    return dayjs(new Date((tanggal - 25569) * 86400 * 1000)).format(
      'DD/MM/YYYY'
    );
  }

  // Jika berupa string dengan berbagai format tanggal
  const parsedDate = dayjs(
    tanggal,
    ['DD/MM/YYYY', 'D/M/YYYY', 'YYYY-MM-DD'],
    true
  );

  return parsedDate.isValid()
    ? parsedDate.format('DD/MM/YYYY')
    : 'Invalid Date';
};

const TABLE_HEAD = [
  'NIM',
  'Nama',
  'Prodi',
  'Gedung',
  'No Kamar',
  'Email',
  'Tanggal Lahir',
  'Tempat Lahir',
  'Asal',
  'Status',
  'Golongan UKT',
  'Jenis Kelamin',
  'Aksi',
];

// Data dummy mahasiswa
const dummyData = [
  {
    id: 1,
    nim: '120140001',
    nama: 'John Doe',
    prodi: 'Teknik Informatika',
    gedung: 'TB1',
    noKamar: 'A101',
    email: 'john@example.com',
    tempatLahir: 'Jakarta',
    tanggalLahir: '01/01/2001',
    asal: 'Jakarta',
    golonganUKT: 3,
    status: 'Aktif Tinggal',
    jenisKelamin: 'Laki-laki',
    password: 'mahasiswa123',
    role: 'mahasiswa',
  },
];

const DataMahasiswa = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editErrorMessage, setEditErrorMessage] = useState('');
  const [dataMahasiswa, setDataMahasiswa] = useState(() => {
    const savedData = getDataMahasiswa();
    return savedData.length > 0 ? savedData : dummyData;
  });
  const [dataEditMahasiswa, setDataEditMahasiswa] = useState({});
  const [dataPelanggaran, setDataPelanggaran] = useState(() => {
    const savedData = getDataPelanggaranMahasiswa();
    return savedData.length > 0 ? savedData : [];
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('Pilih file...');
  const [mounted, setMounted] = useState(false);

  const initialFormState = {
    nim: '',
    nama: '',
    prodi: '',
    gedung: 'TB1',
    noKamar: '',
    email: '',
    tempatLahir: '',
    tanggalLahir: '',
    asal: '',
    golonganUKT: 1,
    status: 'Aktif Tinggal',
    jenisKelamin: 'Laki-laki',
    password: '',
    role: 'mahasiswa',
  };
  const [formData, setFormData] = useState(initialFormState);
  const [pelanggaran, setPelanggaran] = useState('');

  const [showPelanggaranForm, setShowPelanggaranForm] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  const handleTambahPelanggaran = (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setFormData({
      nim: mahasiswa.nim,
      nama: mahasiswa.nama,
      gedung: mahasiswa.gedung,
      noKamar: mahasiswa.noKamar,
      tanggalPelanggaran: '', // Pastikan tidak undefined
      keteranganPelanggaran: '',
    });
    setShowPelanggaranForm(true);
  };

  const handleSubmitPelanggaran = (e) => {
    e.preventDefault();

    // Ambil data pelanggaran lama dari localStorage
    const existingPelanggaran = getDataPelanggaranMahasiswa(
      selectedMahasiswa.nim
    );

    // Tambahkan data baru tanpa menghapus yang lama
    const updatedPelanggaran = [
      ...existingPelanggaran,
      { ...formData, id: existingPelanggaran.length + 1 },
    ];

    // Simpan kembali ke localStorage
    saveDataPelanggaranMahasiswa(selectedMahasiswa.nim, updatedPelanggaran);

    // Update state
    setPelanggaran(updatedPelanggaran);

    setShowPelanggaranForm(false);
    setFormData({
      nim: '',
      nama: '',
      gedung: '',
      noKamar: '',
      tanggalPelanggaran: '',
      keteranganPelanggaran: '',
    });

    toast.success('Data pelanggaran berhasil ditambahkan');
  };

  useEffect(() => {
    setMounted(true);
    const savedData = getDataMahasiswa();
    setDataMahasiswa(savedData.length > 0 ? savedData : dummyData);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveDataMahasiswa(dataMahasiswa);
    }
  }, [dataMahasiswa, mounted]);

  useEffect(() => {
    if (pelanggaran && pelanggaran.length > 0) {
      saveDataPelanggaranMahasiswa(pelanggaran);
    }
  }, [pelanggaran]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'jenisKelamin') {
      if (value === 'laki-laki') {
        setFormData({ ...formData, gedung: 'TB1' }); // Default Gedung for Laki-laki
      } else if (value === 'perempuan') {
        setFormData({ ...formData, gedung: 'TB3' }); // Default Gedung for Perempuan
      }
    }
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!formData.nim || !formData.nama || !formData.email) {
      setErrorMessage('NIM, Nama, dan Email wajib diisi!');
      return;
    }
    setIsLoading(true);
    const idd = toast.loading('Create Data Mahasiswa...');

    const newMahasiswa = {
      ...formData,
      id: Date.now(),
      tanggalLahir:
        formData.tanggalLahir || new Date().toISOString().split('T')[0],
      password: formData.password || 'mahasiswa123',
      role: 'mahasiswa',
    };

    const updatedData = [...dataMahasiswa, newMahasiswa];
    setDataMahasiswa(updatedData);
    // Simpan data ke localStorage
    saveDataMahasiswa(updatedData);
    toast.update(idd, {
      render: 'Data berhasil ditambahkan',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
    });
    setFormData(initialFormState);
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const mahasiswa = dataMahasiswa.find((m) => m.id === id);
    setDataEditMahasiswa({ ...mahasiswa });
    setShowModal(true);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    // Update data di state
    if (
      !dataEditMahasiswa.nim ||
      !dataEditMahasiswa.nama ||
      !dataEditMahasiswa.email
    ) {
      setEditErrorMessage('NIM, Nama, dan Email wajib diisi!');
      return;
    }
    setIsLoading(false);
    const idd = toast.loading('Edit Data Mahasiswa...');
    setDataMahasiswa((prev) =>
      prev.map((item) =>
        item.id === dataEditMahasiswa.id ? { ...dataEditMahasiswa } : item
      )
    );

    toast.update(idd, {
      render: 'Data berhasil diubah',
      type: 'success',
      isLoading: false,
      autoClose: 2000,
    });
    setEditErrorMessage('');
    setShowModal(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
    }).then((result) => {
      if (result.isConfirmed) {
        const filteredData = dataMahasiswa.filter((m) => m.id !== id);
        setDataMahasiswa(filteredData);
        Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
      }
    });
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('Pilih file terlebih dahulu!');
      return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension === 'csv' || fileExtension === 'xlsx') {
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_json(sheet);

        const formatDate = (excelDate) => {
          if (typeof excelDate === 'number') {
            return dayjs(new Date((excelDate - 25569) * 86400 * 1000)).format(
              'DD/MM/YYYY'
            );
          } else if (typeof excelDate === 'string') {
            const parsedDate = dayjs(
              excelDate,
              ['DD/MM/YYYY', 'D/M/YYYY', 'YYYY-MM-DD'],
              true
            );
            if (parsedDate.isValid()) {
              return parsedDate.format('DD/MM/YYYY');
            } else {
              console.warn('Format tanggal tidak dikenali:', excelDate);
              return 'Invalid Date';
            }
          }
          return 'Invalid Date';
        };

        // Konstanta untuk struktur gedung
        const FLOORS_PER_BUILDING = 5;
        const ROOMS_PER_FLOOR = 23;
        const MAX_PER_ROOM = 4;
        const GEDUNG_LAKI = ['TB1', 'TB2'];
        const GEDUNG_PEREMPUAN = ['TB3', 'TB4', 'TB5'];

        // Struktur data untuk tracking okupansi
        const occupancy = {
          TB1: { floors: {}, totalOccupants: 0 },
          TB2: { floors: {}, totalOccupants: 0 },
          TB3: { floors: {}, totalOccupants: 0 },
          TB4: { floors: {}, totalOccupants: 0 },
          TB5: { floors: {}, totalOccupants: 0 }
        };

        // Inisialisasi struktur lantai dan kamar
        Object.keys(occupancy).forEach(gedung => {
          for (let floor = 1; floor <= FLOORS_PER_BUILDING; floor++) {
            occupancy[gedung].floors[floor] = {
              rooms: {},
              totalOccupants: 0
            };
            for (let room = 1; room <= ROOMS_PER_FLOOR; room++) {
              occupancy[gedung].floors[floor].rooms[room] = 0;
            }
          }
        });

        // Format nomor kamar: LKNN (L=Lantai, K=Kamar)
        const formatRoomNumber = (floor, roomNum) => {
          return `${floor}${roomNum.toString().padStart(2, '0')}`;
        };

        // Mendapatkan gedung yang tersedia
        const getAvailableBuilding = (jenisKelamin) => {
          const gedungList = jenisKelamin.toLowerCase() === 'laki-laki'
            ? GEDUNG_LAKI
            : GEDUNG_PEREMPUAN;

          return gedungList.reduce((selected, current) => {
            if (!selected) return current;
            if (occupancy[current].totalOccupants < occupancy[selected].totalOccupants) {
              return current;
            }
            return selected;
          });
        };

        // Mendapatkan kamar yang tersedia di gedung tertentu
        const getAvailableRoom = (gedung) => {
          for (let floor = 1; floor <= FLOORS_PER_BUILDING; floor++) {
            for (let room = 1; room <= ROOMS_PER_FLOOR; room++) {
              if (occupancy[gedung].floors[floor].rooms[room] < MAX_PER_ROOM) {
                return {
                  floor: floor,
                  roomNum: room,
                  formattedNumber: formatRoomNumber(floor, room)
                };
              }
            }
          }
          throw new Error(`Gedung ${gedung} sudah penuh`);
        };

        try {
          // Proses data dengan assignment kamar
          data = data.map((item) => {
            const jenisKelamin = item['Jenis Kelamin'];
            const gedung = getAvailableBuilding(jenisKelamin);
            const { floor, roomNum, formattedNumber } = getAvailableRoom(gedung);

            // Update tracking occupancy
            occupancy[gedung].floors[floor].rooms[roomNum]++;
            occupancy[gedung].floors[floor].totalOccupants++;
            occupancy[gedung].totalOccupants++;

            return {
              id: Date.now() + Math.random(),
              nim: String(item.NIM),
              nama: item.Nama,
              prodi: item.Prodi,
              gedung: gedung,
              lantai: floor,
              noKamar: formattedNumber,
              email: item.Email,
              tempatLahir: item['Tempat Lahir'],
              tanggalLahir: formatDate(item['Tanggal Lahir']),
              asal: item.Asal,
              status: item.Status,
              golonganUKT: item['Golongan UKT'],
              jenisKelamin: jenisKelamin,
              password: String(item.NIM) || 'mahasiswa123',
              role: 'mahasiswa',
            };
          });

          // Log statistik penempatan
          console.log('Statistik Penempatan:', occupancy);

          setDataMahasiswa((prevState) => [...prevState, ...data]);
          toast.success('Data mahasiswa berhasil diupload dan kamar telah diassign!');

        } catch (error) {
          console.error('Error dalam assignment kamar:', error);
          toast.error(`Terjadi kesalahan: ${error.message}`);
        }
      };

      reader.readAsBinaryString(file);
    } else {
      alert('Hanya file CSV atau XLSX yang diperbolehkan.');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {showForm ? (
        <div className="flex flex-col justify-center items-center mt-5 px-4 sm:px-0">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
            Form Data Mahasiswa
          </h1>
          <div className="flex flex-col bg-white shadow-lg rounded-xl divide-y w-full max-w-4xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-5 text-gray-800">Tambah Mahasiswa Baru</h2>
              {errorMessage && (
                <p className="text-red-500 font-semibold mb-3">{errorMessage}</p>
              )}
            </div>
            <form onSubmit={handleSubmitAdd} className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
              {/* NIM */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">NIM</label>
                <input
                  type="text"
                  name="nim"
                  value={formData.nim}
                  onChange={handleInputChange}
                  className="input input-bordered w-full p-3 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Nama */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="input input-bordered w-full p-3 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Program Studi */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Program Studi</label>
                <input
                  type="text"
                  name="prodi"
                  value={formData.prodi}
                  onChange={handleInputChange}
                  className="input input-bordered w-full p-3 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Gedung */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Gedung</label>
                <select
                  name="gedung"
                  value={formData.gedung}
                  onChange={handleInputChange}
                  className="select select-bordered w-full p-3 text-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
                >
                  {['TB1', 'TB2', 'TB3', 'TB4', 'TB5'].map((gedung) => (
                    <option key={gedung} value={gedung}>
                      {gedung}
                    </option>
                  ))}
                </select>
              </div>

              {/* No Kamar */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Nomor Kamar</label>
                <input
                  type="text"
                  name="noKamar"
                  value={formData.noKamar}
                  onChange={handleInputChange}
                  className="input input-bordered w-full p-3 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered w-full p-3 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Tempat Lahir */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Tempat Lahir</label>
                <input
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleInputChange}
                  className="input input-bordered w-full p-3 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleInputChange}
                  className="input input-bordered w-full p-3 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Asal */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Asal</label>
                <input
                  type="text"
                  name="asal"
                  value={formData.asal}
                  onChange={handleInputChange}
                  className="input input-bordered w-full p-3 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Golongan UKT */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Golongan UKT</label>
                <select
                  name="golonganUKT"
                  value={formData.golonganUKT}
                  onChange={handleInputChange}
                  className="select select-bordered w-full p-3 text-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
                >
                  {['1', '2', '3', '4', '5', '6', '7', '8'].map((golonganUKT) => (
                    <option key={golonganUKT} value={golonganUKT}>
                      {golonganUKT}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Tinggal */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Status Tinggal</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="select select-bordered w-full p-3 text-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
                >
                  {['Aktif Tinggal', 'Checkout'].map((statusTinggal) => (
                    <option key={statusTinggal} value={statusTinggal}>
                      {statusTinggal}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input input-bordered w-full p-3 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-center gap-6 mt-6">
                <button
                  type="submit"
                  className="bg-orange-500 text-white hover:bg-orange-600 py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all"
                >
                  Tambah Mahasiswa
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white hover:bg-gray-600 py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-4 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            {/* Judul */}
            <h1 className="text-2xl md:text-3xl font-bold">Data Mahasiswa</h1>

            {/* Action Buttons */}
            <div className="w-full md:w-auto flex flex-col-reverse md:flex-row gap-3">
              {/* Upload Section */}
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <input
                  type="file"
                  accept=".csv, .xlsx"
                  onChange={handleFileChange}
                  className="border p-2 rounded w-full md:w-48 lg:w-64 text-sm"
                />
                <button
                  onClick={handleUpload}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                >
                  <ArrowUpTrayIcon className="h-5 w-5" />
                  <span className="text-sm md:text-base">Upload</span>
                </button>
              </div>

              {/* Tambah Buttons */}
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <button
                  className="btn bg-[#FDE9CC] hover:bg-[#E0924A] text-gray-500 hover:text-white flex items-center justify-center gap-2 p-2 md:p-3 rounded text-sm md:text-base"
                  onClick={() => setShowForm(true)}
                >
                  <PlusIcon className="h-5 w-5 text-green-500" />
                  <span>Tambah Mahasiswa</span>
                  </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full">
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
              <tbody className="divide-y divide-gray-200">
                {dataMahasiswa.map((mahasiswa) => (
                  <tr
                    key={mahasiswa.id}
                    className="odd:bg-[#FDE9CC] even:bg-white"
                  >
                    {/* Table Cells */}
                    <td className="px-4 py-2 text-sm">{mahasiswa.nim}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.nama}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.prodi}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.gedung}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.noKamar}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.email}</td>
                    <td className="px-4 py-2 text-sm">
                      {formatTanggal(mahasiswa.tanggalLahir)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {mahasiswa.tempatLahir}
                    </td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.asal}</td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.status}</td>
                    <td className="px-4 py-2 text-sm text-center">
                      {mahasiswa.golonganUKT}
                    </td>
                    <td className="px-4 py-2 text-sm">{mahasiswa.jenisKelamin}</td>

                    {/* Action Buttons */}
                    <ActionDropdown
                      mahasiswa={mahasiswa}
                      handleEdit={handleEdit}
                      handleTambahPelanggaran={handleTambahPelanggaran}
                      handleDelete={handleDelete}
                      showEdit={true}
                      showAddViolation={true}
                      showPrint={true}
                    />
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
                    Form Edit Data Mahasiswa
                  </h3>
                  <p>Update Data Mahasiswa dengan Teliti</p>
                  <p
                    className={`${editErrorMessage ? 'py-3' : ''} text-red-500 font-semibold`}
                  >
                    {editErrorMessage}
                  </p>
                </div>
                <div className="relative p-6 flex-auto">
                  <form
                    className="grid grid-cols-2 gap-4"
                    onSubmit={(e) => handleSubmitEdit(e, dataEditMahasiswa.id)}
                  >
                    {/* Kolom Kiri */}
                    <div className="space-y-4">
                      <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          NIM
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          value={dataEditMahasiswa.nim || ''}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              nim: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Nama
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          value={dataEditMahasiswa.nama || ''}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              nama: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Prodi
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          value={dataEditMahasiswa.prodi || ''}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              prodi: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Gedung
                        </label>
                        <select
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          value={dataEditMahasiswa.gedung || 'TB1'}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              gedung: e.target.value,
                            })
                          }
                        >
                          {['TB1', 'TB2', 'TB3', 'TB4', 'TB5'].map((gedung) => (
                            <option key={gedung} value={gedung}>
                              {gedung}
                            </option>
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
                          value={dataEditMahasiswa.noKamar || ''}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              noKamar: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Email
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          type="email"
                          value={dataEditMahasiswa.email || ''}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Tempat Lahir
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          value={dataEditMahasiswa.tempatLahir || ''}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              tempatLahir: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Tanggal Lahir
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          type="date"
                          value={dataEditMahasiswa.tanggalLahir || ''}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              tanggalLahir: e.target.value,
                            })
                          }
                          max={new Date().toISOString().split('T')[0]}
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
                          value={dataEditMahasiswa.asal || ''}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              asal: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Golongan UKT
                        </label>
                        <select
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          value={dataEditMahasiswa.golonganUKT || 1}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              golonganUKT: e.target.value,
                            })
                          }
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((golongan) => (
                            <option key={golongan} value={golongan}>
                              Golongan {golongan}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Status Tinggal
                        </label>
                        <select
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          value={dataEditMahasiswa.status || ''}
                          onChange={(e) =>
                            setDataEditMahasiswa({
                              ...dataEditMahasiswa,
                              status: e.target.value,
                            })
                          }
                        >
                          {['Aktif Tinggal', 'Checkout'].map(
                            (statusTinggal) => (
                              <option key={statusTinggal} value={statusTinggal}>
                                {statusTinggal}
                              </option>
                            )
                          )}
                        </select>
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
      <>
        {showPelanggaranForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Tambah Pelanggaran</h2>
              <form onSubmit={handleSubmitPelanggaran}>
                <div className="mb-4">
                  <label className="block mb-2">NIM</label>
                  <input
                    type="text"
                    value={formData.nim}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Nama</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Gedung</label>
                  <input
                    type="text"
                    value={formData.gedung}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">No. Kamar</label>
                  <input
                    type="text"
                    value={formData.noKamar}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Tanggal Pelanggaran</label>
                  <input
                    type="date"
                    value={formData.tanggalPelanggaran || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tanggalPelanggaran: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Keterangan</label>
                  <textarea
                    value={formData.keterangan}
                    onChange={(e) =>
                      setFormData({ ...formData, keterangan: e.target.value })
                    }
                    className="resize-none w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPelanggaranForm(false)}
                    className="bg-red-500 text-white px-4 py-2 ml-2 rounded"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
      <ToastContainer limit={1} position="top-right" />
    </>
  );
};

export default DataMahasiswa;
