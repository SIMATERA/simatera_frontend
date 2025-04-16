import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Konfigurasi axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

// Interceptor untuk menambahkan token ke header
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Service untuk mengambil semua data kamar
 * @param {Object} params - Parameter untuk filtering dan pagination
 * @returns {Promise} - Promise yang berisi data kamar
 */
const getAllRooms = async (params = {}) => {
    try {
        const response = await axios.get('/kamar', { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil data kamar');
    }
};

/**
 * Service untuk mengambil data kamar berdasarkan gedung
 * @param {string} gedung - Gedung (TB1, TB2, dst)
 * @returns {Promise} - Promise yang berisi data kamar
 */
const getRoomsByBuilding = async (gedung) => {
    try {
        const response = await axios.get('/kamar', { params: { gedung } });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching rooms by building:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil data kamar berdasarkan gedung');
    }
};

/**
 * Service untuk mengambil data kamar berdasarkan lantai
 * @param {string} gedung - Gedung (TB1, TB2, dst)
 * @param {number} lantai - Lantai (1, 2, 3, dst)
 * @returns {Promise} - Promise yang berisi data kamar
 */
const getRoomsByFloor = async (gedung, lantai) => {
    try {
        const response = await axios.get('/kamar', { params: { gedung, lantai } });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching rooms by floor:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil data kamar berdasarkan lantai');
    }
};

/**
 * Service untuk mengambil data kamar berdasarkan status
 * @param {string} status - Status kamar (tersedia, terisi, perbaikan, dst)
 * @returns {Promise} - Promise yang berisi data kamar
 */
const getRoomsByStatus = async (status) => {
    try {
        const response = await axios.get('/kamar', { params: { status } });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching rooms by status:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil data kamar berdasarkan status');
    }
};

/**
 * Service untuk mengambil data kamar yang tersedia berdasarkan jenis kelamin
 * @param {string} gender - Jenis kelamin (Laki-laki, Perempuan)
 * @returns {Promise} - Promise yang berisi data kamar yang tersedia
 */
const getAvailableRoomsByGender = async (gender) => {
    try {
        const response = await axios.get(`/kamar-available/${gender}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil data kamar tersedia');
    }
};

/**
 * Service untuk mengambil detail kamar
 * @param {string} id - ID kamar
 * @returns {Promise} - Promise yang berisi detail kamar
 */
const getRoomDetail = async (id) => {
    try {
        const response = await axios.get(`/kamar/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching room detail:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail kamar');
    }
};

/**
 * Service untuk menambah kamar baru
 * @param {Object} data - Data kamar baru
 * @returns {Promise} - Promise yang berisi data kamar yang baru ditambahkan
 */
const createRoom = async (data) => {
    try {
        const response = await axios.post('/kamar', data);
        return response.data.data;
    } catch (error) {
        console.error('Error creating room:', error);
        throw new Error(error.response?.data?.message || 'Gagal menambah kamar baru');
    }
};

/**
 * Service untuk mengupdate data kamar
 * @param {string} id - ID kamar
 * @param {Object} data - Data kamar yang diupdate
 * @returns {Promise} - Promise yang berisi data kamar yang sudah diupdate
 */
const updateRoom = async (id, data) => {
    try {
        const response = await axios.put(`/kamar/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.error('Error updating room:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengupdate data kamar');
    }
};

/**
 * Service untuk menghapus kamar
 * @param {string} id - ID kamar
 * @returns {Promise} - Promise yang berisi status penghapusan
 */
const deleteRoom = async (id) => {
    try {
        const response = await axios.delete(`/kamar/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting room:', error);
        throw new Error(error.response?.data?.message || 'Gagal menghapus kamar');
    }
};

/**
 * Service untuk mendapatkan penghuni kamar
 * @param {string} id - ID kamar
 * @returns {Promise} - Promise yang berisi data penghuni kamar
 */
const getRoomOccupants = async (id) => {
    try {
        const response = await axios.get(`/kamar/${id}/occupants`);
        return {
            mahasiswa: response.data.data.mahasiswa || [],
            kasra: response.data.data.kasra || [],
            totalOccupants: response.data.data.total_occupants || 0
        };
    } catch (error) {
        console.error('Error fetching room occupants:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil data penghuni kamar');
    }
};

/**
 * Service untuk mendapatkan statistik kamar
 * @param {Object} params - Parameter untuk filter statistik (misal: gedung)
 * @returns {Promise} - Promise yang berisi data statistik kamar
 */
const getRoomStatistics = async (params = {}) => {
    try {
        const response = await axios.get('/kamar-statistics', { params });
        const stats = response.data.data;

        // Format ulang data untuk menyesuaikan dengan format yang diharapkan frontend
        return {
            total: stats.total,
            tersedia: stats.tersedia,
            terisi: stats.terisi + stats.terisi_sebagian,
            perbaikan: stats.perbaikan,
            tidakTersedia: stats.tidak_tersedia,
            totalKapasitas: stats.total_kapasitas,
            totalTerisi: stats.total_terisi,
            persentaseTerisi: stats.persentase_terisi,
            byBuilding: stats.by_building
        };
    } catch (error) {
        console.error('Error fetching room statistics:', error);
        // Fallback jika API gagal
        try {
            // Fetch semua kamar untuk menghitung statistik secara manual
            const response = await axios.get('/kamar');
            const rooms = response.data.data;

            // Hitung statistik
            const stats = {
                total: rooms.length,
                tersedia: rooms.filter(room => room.status === 'tersedia').length,
                terisi: rooms.filter(room => room.terisi > 0).length,
                perbaikan: rooms.filter(room => room.status === 'perbaikan').length,
                tidakTersedia: rooms.filter(room => room.status === 'tidak_tersedia').length,
                totalKapasitas: rooms.reduce((sum, room) => sum + room.kapasitas, 0),
                totalTerisi: rooms.reduce((sum, room) => sum + room.terisi, 0)
            };

            return stats;
        } catch (fallbackError) {
            console.error('Error with fallback statistics calculation:', fallbackError);
            throw new Error('Gagal mengambil statistik kamar');
        }
    }
};

// Export semua service
const KamarService = {
    getAllRooms,
    getRoomsByBuilding,
    getRoomsByFloor,
    getRoomsByStatus,
    getAvailableRoomsByGender,
    getRoomDetail,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomOccupants,
    getRoomStatistics,
};

export default KamarService; 