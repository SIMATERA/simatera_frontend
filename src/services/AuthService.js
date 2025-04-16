import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Konfigurasi axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

/**
 * Service untuk login user
 * @param {string} email - Email pengguna
 * @param {string} password - Password pengguna
 * @returns {Promise} - Promise yang berisi data user jika berhasil login
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post('/login', {
      email,
      password
    });

    if (response.data.status) {
      // Simpan token ke localStorage
      localStorage.setItem('token', response.data.data.token);
      // Simpan data user ke localStorage
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      // Set token untuk semua request selanjutnya
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      
      return response.data.data.user;
    } else {
      throw new Error(response.data.message || 'Login gagal');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat login';
    throw new Error(errorMessage);
  }
};

/**
 * Service untuk logout user
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan');
    }

    const response = await axios.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Hapus token dan data user dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Hapus default header authorization
    delete axios.defaults.headers.common['Authorization'];

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Terjadi kesalahan saat logout';
  }
};

/**
 * Service untuk mengubah password user
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan');
    }

    const response = await axios.post('/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengubah password';
  }
};

/**
 * Service untuk mendapatkan user yang sedang login
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      // Set token untuk semua request
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return JSON.parse(user);
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Interceptor untuk menangani error response
 */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hapus token dan user data jika unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);
