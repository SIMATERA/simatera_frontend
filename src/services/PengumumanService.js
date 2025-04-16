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
 * Service untuk mengambil daftar pengumuman
 * @param {Object} params - Parameter untuk filtering dan pagination
 * @returns {Promise} - Promise yang berisi data pengumuman
 */
export const getPengumuman = async (params = {}) => {
  try {
    const response = await axios.get('/pengumuman', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data pengumuman');
  }
};

/**
 * Service untuk mengambil detail pengumuman
 * @param {string} id - ID pengumuman
 * @returns {Promise} - Promise yang berisi detail pengumuman
 */
export const getPengumumanById = async (id) => {
  try {
    const response = await axios.get(`/pengumuman/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil detail pengumuman');
  }
};

/**
 * Service untuk download file pengumuman
 * @param {string} id - ID pengumuman
 * @returns {Promise} - Promise yang berisi blob file
 */
export const downloadPengumuman = async (id) => {
  try {
    const response = await axios.get(`/pengumuman/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mendownload file pengumuman');
  }
};

/**
 * Service untuk membuat pengumuman baru
 * @param {Object} data - Data pengumuman yang akan dibuat
 * @returns {Promise} - Promise yang berisi data pengumuman yang dibuat
 */
export const createPengumuman = async (data) => {
  try {
    const formData = new FormData();
    formData.append('judul_pengumuman', data.judul_pengumuman);
    formData.append('isi_pengumuman', data.isi_pengumuman);
    formData.append('tanggal_pengumuman', data.tanggal_pengumuman);

    if (data.file_pengumuman) {
      formData.append('file_pengumuman', data.file_pengumuman);
    }

    const response = await axios.post('/pengumuman', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal membuat pengumuman');
  }
};

/**
 * Service untuk mengupdate pengumuman
 * @param {string} id - ID pengumuman
 * @param {Object} data - Data pengumuman yang akan diupdate
 * @returns {Promise} - Promise yang berisi data pengumuman yang diupdate
 */
export const updatePengumuman = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append('judul_pengumuman', data.judul_pengumuman);
    formData.append('isi_pengumuman', data.isi_pengumuman);
    formData.append('tanggal_pengumuman', data.tanggal_pengumuman);
    formData.append('_method', 'PUT'); // Laravel menggunakan _method untuk method spoofing

    if (data.file_pengumuman && data.file_pengumuman instanceof File) {
      formData.append('file_pengumuman', data.file_pengumuman);
    }

    const response = await axios.post(`/pengumuman/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengupdate pengumuman');
  }
};

/**
 * Service untuk menghapus pengumuman
 * @param {string} id - ID pengumuman
 * @returns {Promise} - Promise yang berisi status penghapusan
 */
export const deletePengumuman = async (id) => {
  try {
    const response = await axios.delete(`/pengumuman/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menghapus pengumuman');
  }
}; 