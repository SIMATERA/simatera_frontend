'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  PencilIcon, 
  BuildingOffice2Icon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PageHeading from '@/components/PageHeading';
import Search from '@/components/Search';
import Pagination from '@/components/Pagination';
import { getDataMahasiswa, getDataKasra } from '@/utils/localStorage';
import KamarService from '@/services/KamarService';
// Konfigurasi Gedung Asrama
const DORM_BUILDINGS = [
  { id: 'TB1', name: 'TB1', gender: 'Perempuan' },
  { id: 'TB2', name: 'TB2', gender: 'Laki-laki' },
  { id: 'TB3', name: 'TB3', gender: 'Laki-laki' },
  { id: 'TB4', name: 'TB4', gender: 'Perempuan' },
  { id: 'TB5', name: 'TB5', gender: 'Perempuan' }
];

const DataKamar = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({
    status: 'tersedia',
    kapasitas: 4,
    keterangan: ''
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);
  const [roomOccupants, setRoomOccupants] = useState({ mahasiswa: [], kasra: [] });
  const [stats, setStats] = useState({
    total: 0,
    tersedia: 0,
    terisi: 0,
    perbaikan: 0,
    totalKapasitas: 0,
    totalTerisi: 0
  });

  // Generate data kamar awal jika API gagal
  const generateInitialRooms = useCallback(() => {
    try {
      const roomsList = [];
      DORM_BUILDINGS.forEach((building, index) => {
        const buildingIndex = index + 1;
        for (let floor = 1; floor <= 5; floor++) {
          for (let room = 1; room <= 20; room++) {
            const roomNumber = `${buildingIndex}${floor}${room.toString().padStart(2, '0')}`;
            roomsList.push({
              id: roomNumber,
              gedung: building.id,
              lantai: floor,
              nomorKamar: roomNumber,
              status: 'tersedia',
              kapasitas: 4,
              terisi: 0,
              keterangan: ''
            });
          }
        }
      });
  
      if (roomsList.length === 0) {
        throw new Error('Failed to generate rooms');
      }
  
      return roomsList;
    } catch (error) {
      console.error('Error generating initial rooms:', error);
      return [];
    }
  }, []);

  // Filter rooms menggunakan useMemo untuk optimasi performa
  const filteredRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) return [];
    
    let result = [...rooms];

    // Filter berdasarkan gedung yang dipilih
    if (selectedBuilding !== 'all') {
      result = result.filter(room => room.gedung === selectedBuilding);
    }

    // Filter berdasarkan pencarian
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(room =>
        room.nomorKamar?.toLowerCase().includes(query) ||
        room.gedung?.toLowerCase().includes(query) ||
        room.status?.toLowerCase().includes(query) ||
        (room.keterangan && room.keterangan.toLowerCase().includes(query))
      );
    }

    return result;
  }, [rooms, selectedBuilding, searchQuery]);

  // Hitung total halaman berdasarkan data yang sudah difilter
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  // Dapatkan data untuk halaman saat ini dari data yang sudah difilter
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredRooms, currentPage, itemsPerPage]);

  // Fetch data kamar dan statistik dari API
  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch statistik kamar
      const statsData = await KamarService.getRoomStatistics();
      setStats(statsData);

      // Fetch semua kamar atau kamar berdasarkan gedung jika dipilih
      let roomsData;
      if (selectedBuilding === 'all') {
        roomsData = await KamarService.getAllRooms();
      } else {
        roomsData = await KamarService.getRoomsByBuilding(selectedBuilding);
      }

      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching room data:', error);
      setError('Gagal memuat data kamar');
      toast.error('Gagal memuat data kamar');

      // Fallback ke localStorage jika API gagal
      try {
        const savedRooms = localStorage.getItem('dormRooms');
        if (savedRooms && JSON.parse(savedRooms).length > 0) {
          setRooms(JSON.parse(savedRooms));
        } else {
          const initialRooms = generateInitialRooms();
          setRooms(initialRooms);
          localStorage.setItem('dormRooms', JSON.stringify(initialRooms));
        }

        // Calculate stats manually if API failed
        const localRooms = JSON.parse(localStorage.getItem('dormRooms') || '[]');
        const filteredForStats = selectedBuilding === 'all'
          ? localRooms
          : localRooms.filter(room => room.gedung === selectedBuilding);

        setStats({
          total: filteredForStats.length,
          tersedia: filteredForStats.filter(room => room.status === 'tersedia').length,
          terisi: filteredForStats.filter(room => room.terisi > 0).length,
          perbaikan: filteredForStats.filter(room => room.status === 'perbaikan').length,
          totalKapasitas: filteredForStats.reduce((sum, room) => sum + room.kapasitas, 0),
          totalTerisi: filteredForStats.reduce((sum, room) => sum + room.terisi, 0)
        });
      } catch (localError) {
        console.error('Error with local fallback:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedBuilding, generateInitialRooms]);

  // Effect untuk fetch data saat komponen mount atau gedung berubah
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Handle edit kamar
  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setEditForm({
      status: room.status || 'tersedia',
      kapasitas: isNaN(room.kapasitas) ? 1 : room.kapasitas,
      keterangan: room.keterangan || ''
    });
    setShowEditModal(true);
  };

  // Save perubahan kamar
  const handleSaveRoom = async () => {
  // Validasi
    if (!selectedRoom || !editForm) {
      toast.error('Data tidak valid');
      return;
    }

    // Pastikan kapasitas valid sebelum dikirim
    const kapasitas = isNaN(parseInt(editForm.kapasitas)) ? 1 : parseInt(editForm.kapasitas);
    if (kapasitas < 1 || kapasitas > 4) {
      toast.error('Kapasitas harus antara 1-4');
      return;
    }
  
    try {
      // Buat objek data yang akan diupdate
      const updatedRoomData = {
        nomor: selectedRoom.nomor,
        status: editForm.status || 'tersedia',
        kapasitas: kapasitas,
        keterangan: editForm.keterangan || ''
      };

      // Panggil API untuk update kamar
      await KamarService.updateRoom(selectedRoom.id, updatedRoomData);

      // Refresh data kamar setelah update
      fetchRooms();
      
      setShowEditModal(false);
      toast.success('Data kamar berhasil diperbarui');
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Terjadi kesalahan saat memperbarui data: ' + (error.message || 'Unknown error'));
    }
  };

  // Fungsi untuk menampilkan detail penghuni kamar
  const handleShowDetail = async (room) => {
    try {
      setIsDetailLoading(true);
      
      // Panggil API untuk mendapatkan penghuni kamar
      const occupantsData = await KamarService.getRoomOccupants(room.id);
      
      setRoomOccupants(occupantsData);
      setSelectedRoomDetail(room);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching room occupants:', error);
      toast.error('Gagal memuat data penghuni kamar');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Render loading state
  if (isLoading && !rooms.length) {
    return (
      <div className="flex bg-[#F5F6FA]">
        <div className="flex-1 flex flex-col">
          <PageHeading title="Data Kamar" />
          <div className="flex-1 p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Memuat data kamar...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !rooms.length) {
    return (
      <div className="flex bg-[#F5F6FA]">
        <div className="flex-1 flex flex-col">
          <PageHeading title="Data Kamar" />
          <div className="flex-1 p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchRooms}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-3"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => {
                  const initialRooms = generateInitialRooms();
                  setRooms(initialRooms);
                  localStorage.setItem('dormRooms', JSON.stringify(initialRooms));
                  toast.success('Data kamar berhasil direset');
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Reset Data Kamar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-[#F5F6FA]">
      <div className="flex-1 flex flex-col">
        <PageHeading title="Data Kamar" />

        <div className="flex-1 p-6">
          {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Kamar</p>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-500">Kapasitas: {stats.totalKapasitas}</p>
            </div>
            <BuildingOffice2Icon className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kamar Tersedia</p>
              <p className="text-2xl font-bold">{stats.tersedia}</p>
              <p className="text-sm text-gray-500">Siap Huni</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kamar Terisi</p>
              <p className="text-2xl font-bold">{stats.terisi}</p>
              <p className="text-sm text-gray-500">Penghuni: {stats.totalTerisi}</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dalam Perbaikan</p>
              <p className="text-2xl font-bold">{stats.perbaikan}</p>
              <p className="text-sm text-gray-500">Maintenance</p>
            </div>
            <WrenchScrewdriverIcon className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedBuilding('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedBuilding === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Semua Gedung
          </button>
          {DORM_BUILDINGS.map(building => (
            <button
              key={building.id}
              onClick={() => setSelectedBuilding(building.id)}
              className={`px-4 py-2 rounded-lg ${
                selectedBuilding === building.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {building.name} ({building.gender})
            </button>
          ))}
        </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Search */}
        <div className="w-full md:w-64">
          <Search
            value={searchQuery}
            onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset ke halaman pertama saat mencari
                  }}
            placeholder="Cari kamar..."
          />
        </div>
      </div>

      {/* Table Section - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gedung</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Kamar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lantai</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((room) => (
              <tr key={room.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.gedung}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.nomorKamar}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.lantai}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    room.status === 'tersedia' ? 'bg-green-100 text-green-800' :
                    room.status === 'terisi' ? 'bg-red-100 text-red-800' :
                      room.status === 'terisi_sebagian' ? 'bg-yellow-100 text-yellow-800' :
                        room.status === 'perbaikan' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                  }`}>
                    {room.status === 'tersedia' ? 'Tersedia' :
                      room.status === 'terisi' ? 'Terisi' :
                        room.status === 'terisi_sebagian' ? 'Terisi Sebagian' :
                          room.status === 'perbaikan' ? 'Perbaikan' :
                            room.status === 'tidak_tersedia' ? 'Tidak Tersedia' :
                              room.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.terisi}/{room.kapasitas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.keterangan || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleShowDetail(room)}
                      className="text-orange-600 hover:text-orange-900"
                      title="Lihat Penghuni"
                    >
                      <UserGroupIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditRoom(room)}
                      className="text-orange-600 hover:text-orange-900"
                      title="Edit Kamar"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card View - Shown only on smaller screens */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentItems.map(room => (
          <div key={room.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold">{room.gedung} - {room.nomorKamar}</h3>
                <p className="text-sm text-gray-500">Lantai {room.lantai}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleShowDetail(room)}
                  className="p-2 text-orange-600 hover:text-orange-900 rounded-full hover:bg-orange-50"
                  title="Lihat Penghuni"
                >
                  <UserGroupIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEditRoom(room)}
                  className="p-2 text-orange-600 hover:text-orange-900 rounded-full hover:bg-orange-50"
                  title="Edit Kamar"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <p className="text-gray-500">Status</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                  room.status === 'tersedia' ? 'bg-green-100 text-green-800' :
                  room.status === 'terisi' ? 'bg-red-100 text-red-800' :
                    room.status === 'terisi_sebagian' ? 'bg-yellow-100 text-yellow-800' :
                      room.status === 'perbaikan' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                }`}>
                  {room.status === 'tersedia' ? 'Tersedia' :
                    room.status === 'terisi' ? 'Terisi' :
                      room.status === 'terisi_sebagian' ? 'Terisi Sebagian' :
                        room.status === 'perbaikan' ? 'Perbaikan' :
                          room.status === 'tidak_tersedia' ? 'Tidak Tersedia' :
                            room.status}
                </span>
              </div>
              <div>
                <p className="text-gray-500">Kapasitas</p>
                <p className="font-medium mt-1">{room.terisi}/{room.kapasitas}</p>
              </div>
            </div>

            {room.keterangan && (
              <div className="mt-2 text-sm">
                <p className="text-gray-500">Keterangan:</p>
                <p className="text-gray-700">{room.keterangan}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination with responsive margins */}
      <div className="mt-4 sm:mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Edit Modal with responsive padding */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4 sm:mx-auto">
            <h3 className="text-lg font-medium mb-4">Edit Kamar {selectedRoom?.nomorKamar}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="tersedia">Tersedia</option>
                      <option value="terisi">Terisi</option>
                      <option value="terisi_sebagian">Terisi Sebagian</option>
                  <option value="perbaikan">Perbaikan</option>
                      <option value="tidak_tersedia">Tidak Tersedia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={editForm.kapasitas}
                      onChange={(e) => {
                        // Pastikan nilai kapasitas tidak NaN, default ke 1 jika kosong atau invalid
                        const newValue = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                        setEditForm({ ...editForm, kapasitas: isNaN(newValue) ? 1 : newValue });
                      }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {editForm.status === 'perbaikan' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea
                    value={editForm.keterangan}
                    onChange={(e) => setEditForm({...editForm, keterangan: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Masukkan keterangan perbaikan..."
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleSaveRoom}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Penghuni Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4 sm:mx-auto max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Penghuni Kamar {selectedRoomDetail?.gedung}-{selectedRoomDetail?.nomorKamar}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <InformationCircleIcon className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium">Informasi Kamar</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p><span className="font-medium">Status:</span> {selectedRoomDetail?.status}</p>
                    <p><span className="font-medium">Kapasitas:</span> {roomOccupants.totalOccupants || selectedRoomDetail?.terisi}/{selectedRoomDetail?.kapasitas}</p>
                {selectedRoomDetail?.keterangan && (
                  <p><span className="font-medium">Keterangan:</span> {selectedRoomDetail.keterangan}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Daftar Mahasiswa */}
              <div>
                <h4 className="text-sm font-medium mb-2">Mahasiswa ({roomOccupants.mahasiswa.length})</h4>
                {roomOccupants.mahasiswa.length > 0 ? (
                  <div className="space-y-2">
                    {roomOccupants.mahasiswa.map((mahasiswa) => (
                      <div key={mahasiswa.nim} className="bg-gray-50 p-3 rounded-md">
                        <p className="font-medium">{mahasiswa.nama}</p>
                        <p className="text-sm text-gray-500">NIM: {mahasiswa.nim}</p>
                        <p className="text-sm text-gray-500">Prodi: {mahasiswa.prodi || '-'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Tidak ada mahasiswa yang menempati kamar ini</p>
                )}
              </div>
              
              {/* Daftar Kasra */}
              <div>
                <h4 className="text-sm font-medium mb-2">Kasra ({roomOccupants.kasra.length})</h4>
                {roomOccupants.kasra.length > 0 ? (
                  <div className="space-y-2">
                    {roomOccupants.kasra.map((kasra) => (
                      <div key={kasra.id} className="bg-gray-50 p-3 rounded-md">
                        <p className="font-medium">{kasra.nama}</p>
                        <p className="text-sm text-gray-500">NIM: {kasra.nim}</p>
                        <p className="text-sm text-gray-500">Prodi: {kasra.prodi   || '-'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Tidak ada kasra yang menempati kamar ini</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
        
        </div>
      </div>

      
    </div>
  );
};

export default DataKamar;