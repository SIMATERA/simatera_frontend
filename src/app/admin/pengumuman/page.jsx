'use client';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getPengumuman,
  getPengumumanById,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
  downloadPengumuman
} from '@/services/PengumumanService';
import { formatDate } from '@/utils/dateFormatter';
import PageHeading from '@/components/PageHeading';

const CreatePengumuman = () => {
  const [formData, setFormData] = useState({
    judul_pengumuman: '',
    isi_pengumuman: '',
    tanggal_pengumuman: new Date().toISOString().split('T')[0],
    file_pengumuman: null
  });
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const fetchPengumuman = async () => {
    try {
      setFetchLoading(true);
      const response = await getPengumuman();
      setPengumuman(response.data);
    } catch (error) {
      console.error('Error fetching pengumuman:', error);
      toast.error('Gagal mengambil data pengumuman');
    } finally {
      setFetchLoading(false);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('File harus berformat PDF, Word, atau Excel!');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('Ukuran file maksimal 5MB!');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFormData({
        ...formData,
        file_pengumuman: selectedFile
      });
      setFileName(selectedFile.name);

      // Clear error for this field
      if (errors.file_pengumuman) {
        setErrors({
          ...errors,
          file_pengumuman: null
        });
      }
    } else {
      e.target.value = null;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.judul_pengumuman.trim()) {
      newErrors.judul_pengumuman = 'Judul pengumuman harus diisi';
    }

    if (!formData.isi_pengumuman.trim()) {
      newErrors.isi_pengumuman = 'Isi pengumuman harus diisi';
    }

    if (!formData.tanggal_pengumuman) {
      newErrors.tanggal_pengumuman = 'Tanggal pengumuman harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await updatePengumuman(editId, formData);
        toast.success('Pengumuman berhasil diperbarui!');
        setEditId(null);
      } else {
        await createPengumuman(formData);
        toast.success('Pengumuman berhasil dibuat!');
      }

      // Reset form
      setFormData({
        judul_pengumuman: '',
        isi_pengumuman: '',
        tanggal_pengumuman: new Date().toISOString().split('T')[0],
        file_pengumuman: null
      });
      setFileName('');

      // Refresh data
      fetchPengumuman();
    } catch (error) {
      console.error('Error saving pengumuman:', error);

      // Handle validation errors from server
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.message || 'Gagal menyimpan pengumuman');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const blob = await downloadPengumuman(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pengumuman-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Gagal mengunduh file');
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getPengumumanById(id);
      const item = response.data;

      setFormData({
        judul_pengumuman: item.judul_pengumuman,
        isi_pengumuman: item.isi_pengumuman,
        tanggal_pengumuman: item.tanggal_pengumuman.split('T')[0],
        file_pengumuman: null
      });

      if (item.file_pengumuman) {
        // Extract filename from path
        const pathParts = item.file_pengumuman.split('/');
        setFileName(pathParts[pathParts.length - 1]);
      } else {
        setFileName('');
      }

      setEditId(id);
    } catch (error) {
      console.error('Error fetching pengumuman detail:', error);
      toast.error('Gagal mengambil detail pengumuman');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      try {
        setLoading(true);
        await deletePengumuman(id);
        toast.success('Pengumuman berhasil dihapus!');

        // Refresh data
        fetchPengumuman();
      } catch (error) {
        console.error('Error deleting pengumuman:', error);
        toast.error('Gagal menghapus pengumuman');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex bg-[#F5F6FA]">
      <div className="flex-1 flex flex-col">
        <PageHeading title="Pengumuman" />
        <ToastContainer />

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">
            {editId ? 'Edit Pengumuman' : 'Buat Pengumuman'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul</label>
              <input
                type="text"
                name="judul_pengumuman"
                value={formData.judul_pengumuman}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${errors.judul_pengumuman ? 'border-red-500' : ''
                  }`}
                required
              />
              {errors.judul_pengumuman && (
                <p className="mt-1 text-sm text-red-600">{errors.judul_pengumuman}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tanggal</label>
              <input
                type="date"
                name="tanggal_pengumuman"
                value={formData.tanggal_pengumuman}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${errors.tanggal_pengumuman ? 'border-red-500' : ''
                  }`}
                required
              />
              {errors.tanggal_pengumuman && (
                <p className="mt-1 text-sm text-red-600">{errors.tanggal_pengumuman}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi
              </label>
              <textarea
                name="isi_pengumuman"
                value={formData.isi_pengumuman}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${errors.isi_pengumuman ? 'border-red-500' : ''
                  }`}
                rows="5"
                required
              />
              {errors.isi_pengumuman && (
                <p className="mt-1 text-sm text-red-600">{errors.isi_pengumuman}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Upload File (PDF/Word/Excel, max 5MB)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
              />
              {fileName && (
                <p className="text-sm text-gray-500 mt-1">
                  File terpilih: {fileName}
                </p>
              )}
              {errors.file_pengumuman && (
                <p className="mt-1 text-sm text-red-600">{errors.file_pengumuman}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : editId ? 'Update Pengumuman' : 'Buat Pengumuman'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      judul_pengumuman: '',
                      isi_pengumuman: '',
                      tanggal_pengumuman: new Date().toISOString().split('T')[0],
                      file_pengumuman: null
                    });
                    setFileName('');
                    setEditId(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Daftar Pengumuman</h2>
            {fetchLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : pengumuman.length > 0 ? (
                <div className="space-y-3">
                  {pengumuman.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                      <h3 className="text-lg font-semibold">{item.judul_pengumuman}</h3>
                      <p className="text-sm text-gray-500 mb-1">{formatDate(item.tanggal_pengumuman)}</p>
                      <p className="text-gray-700">{item.isi_pengumuman}</p>
                      {item.file_pengumuman && (
                      <div className="mt-2">
                        <button
                            onClick={() => handleDownload(item.id)}
                          className="text-blue-500 hover:underline flex items-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                            Download File
                        </button>
                      </div>
                    )}
                    <div className="mt-2 flex gap-4">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">Belum ada pengumuman.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePengumuman;
