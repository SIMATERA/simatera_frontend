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
 * Service untuk mengambil semua data mahasiswa
 * @param {Object} params - Parameter untuk filtering dan pagination
 * @returns {Promise} - Promise yang berisi data mahasiswa
 */
const getAllMahasiswa = async (params = {}) => {
    try {
        const response = await axios.get('/mahasiswa', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching mahasiswa:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil data mahasiswa');
    }
};

/**
 * Service untuk mengambil detail mahasiswa berdasarkan NIM
 * @param {string} nim - NIM mahasiswa
 * @returns {Promise} - Promise yang berisi detail mahasiswa
 */
const getMahasiswaByNim = async (nim) => {
    try {
        const response = await axios.get(`/mahasiswa/${nim}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching mahasiswa detail:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail mahasiswa');
    }
};

/**
 * Service untuk membuat data mahasiswa baru
 * @param {Object} data - Data mahasiswa yang akan dibuat
 * @returns {Promise} - Promise yang berisi data mahasiswa yang dibuat
 */
const createMahasiswa = async (data) => {
    try {
        // Pastikan format tanggal lahir dalam bentuk YYYY-MM-DD
        if (data.tanggal_lahir) {
            if (!(data.tanggal_lahir instanceof Date)) {
                data.tanggal_lahir = new Date(data.tanggal_lahir);
            }
            data.tanggal_lahir = data.tanggal_lahir.toISOString().split('T')[0];
        }

        const response = await axios.post('/mahasiswa', data);
        return response.data;
    } catch (error) {
        console.error('Error creating mahasiswa:', error);
        throw new Error(error.response?.data?.message || 'Gagal membuat data mahasiswa');
    }
};

/**
 * Service untuk mengupdate data mahasiswa berdasarkan NIM
 * @param {string} nim - NIM mahasiswa
 * @param {Object} data - Data mahasiswa yang akan diupdate
 * @returns {Promise} - Promise yang berisi data mahasiswa yang diupdate
 */
const updateMahasiswa = async (nim, data) => {
    try {
        // Pastikan format tanggal lahir dalam bentuk YYYY-MM-DD
        if (data.tanggal_lahir) {
            if (!(data.tanggal_lahir instanceof Date)) {
                data.tanggal_lahir = new Date(data.tanggal_lahir);
            }
            data.tanggal_lahir = data.tanggal_lahir.toISOString().split('T')[0];
        }

        const response = await axios.put(`/mahasiswa/${nim}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating mahasiswa:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengupdate data mahasiswa');
    }
};

/**
 * Service untuk menghapus data mahasiswa berdasarkan NIM
 * @param {string} nim - NIM mahasiswa
 * @returns {Promise} - Promise yang berisi status penghapusan
 */
const deleteMahasiswa = async (nim) => {
    try {
        const response = await axios.delete(`/mahasiswa/${nim}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting mahasiswa:', error);
        throw new Error(error.response?.data?.message || 'Gagal menghapus data mahasiswa');
    }
};

/**
 * Service untuk mengimport data mahasiswa dari file Excel
 * @param {File} file - File Excel yang berisi data mahasiswa
 * @returns {Promise} - Promise yang berisi hasil import
 */
const importMahasiswa = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/mahasiswa/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error importing mahasiswa:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengimport data mahasiswa');
    }
};

/**
 * Service untuk mendapatkan opsi kamar berdasarkan jenis kelamin
 * @param {string} jenisKelamin - Jenis kelamin (Laki-laki, Perempuan)
 * @returns {Promise} - Promise yang berisi data opsi kamar
 */
const getKamarOptions = async (jenisKelamin) => {
    try {
        const response = await axios.get('/mahasiswa/kamar-options', {
            params: { jenis_kelamin: jenisKelamin }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching kamar options:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil opsi kamar');
    }
};

/**
 * Service untuk menempatkan mahasiswa ke kamar
 * @param {string} kamarId - ID kamar
 * @param {string} mahasiswaId - ID/NIM mahasiswa
 * @returns {Promise} - Promise yang berisi hasil penempatan
 */
const assignMahasiswa = async (kamarId, mahasiswaId) => {
    try {
        const response = await axios.post(`/kamar/${kamarId}/assign-mahasiswa`, {
            mahasiswa_id: mahasiswaId
        });
        return response.data;
    } catch (error) {
        console.error('Error assigning mahasiswa to room:', error);
        throw new Error(error.response?.data?.message || 'Gagal menempatkan mahasiswa ke kamar');
    }
};

/**
 * Service untuk memindahkan mahasiswa dari kamar
 * @param {string} kamarId - ID kamar
 * @param {string} mahasiswaId - ID/NIM mahasiswa
 * @returns {Promise} - Promise yang berisi hasil pemindahan
 */
const removeMahasiswa = async (kamarId, mahasiswaId) => {
    try {
        const response = await axios.post(`/kamar/${kamarId}/remove-mahasiswa`, {
            mahasiswa_id: mahasiswaId
        });
        return response.data;
    } catch (error) {
        console.error('Error removing mahasiswa from room:', error);
        throw new Error(error.response?.data?.message || 'Gagal memindahkan mahasiswa dari kamar');
    }
};

// Export semua fungsi API
const MahasiswaService = {
    getAllMahasiswa,
    getMahasiswaByNim,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    importMahasiswa,
    getKamarOptions,
    assignMahasiswa,
    removeMahasiswa
};

export default MahasiswaService; 