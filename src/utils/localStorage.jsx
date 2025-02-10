// Ambil data mahasiswa berdasarkan NIM
export const getDataMahasiswa = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('mahasiswaData');
    return data ? JSON.parse(data) : [];
  }
  return [];
};

// Ambil data pelanggaran untuk admin
export const getDataPelanggaranAdmin = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('pelanggaranAdminData');
    return data ? JSON.parse(data) : [];
  }
  return [];
};

// Simpan atau update data pelanggaran untuk admin
export const saveDataPelanggaranAdmin = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pelanggaranAdminData', JSON.stringify(data));
  }
};

// Simpan atau update data mahasiswa berdasarkan NIM
export const saveDataMahasiswa = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mahasiswaData', JSON.stringify(data));
  }
};

// Hapus data mahasiswa berdasarkan NIM
export const clearDataMahasiswa = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mahasiswaData');
  }
};

// Ambil semua mahasiswa yang tersimpan
export const getAllMahasiswa = () => {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith('mahasiswa_')
    );
    return keys.map((key) => JSON.parse(localStorage.getItem(key)));
  }
  return [];
};

// Fungsionalitas yang sama bisa diterapkan untuk Kasra, Pelanggaran, dan Pengumuman:
export const saveDataKasra = (nim, kasra) => {
  if (typeof window !== 'undefined') {
    let mahasiswa = getDataMahasiswa(nim) || {};
    mahasiswa.kasra = kasra;
    saveDataMahasiswa(nim, mahasiswa);
  }
};

export const getDataKasra = (nim) => {
  const mahasiswa = getDataMahasiswa(nim);
  return mahasiswa ? mahasiswa.kasra || [] : [];
};

// Fungsi untuk data pelanggaran per mahasiswa
export const getDataPelanggaranMahasiswa = (nim) => {
  if (typeof window !== 'undefined') {
    const nimKey = String(nim); // pastikan nim adalah string
    const data = localStorage.getItem(`pelanggaranData_${nimKey}`);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveDataPelanggaranMahasiswa = (nim, data) => {
  if (typeof window !== 'undefined') {
    const nimKey = String(nim); // pastikan nim adalah string
    localStorage.setItem(`pelanggaranData_${nimKey}`, JSON.stringify(data));
  }
};

// Fungsi untuk data pengaduan per mahasiswa
export const saveDataPengaduanMahasiswa = (nim, data) => {
  if (typeof window !== 'undefined') {
    try {
      // Simpan data dengan key berdasarkan NIM
      localStorage.setItem(`pengaduanData_${nim}`, JSON.stringify(data));
    } catch (error) {
      console.error('Gagal menyimpan data pengaduan:', error);
    }
  }
};

export const getDataPengaduanMahasiswa = (nim) => {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(`pengaduanData_${nim}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Gagal mengambil data pengaduan:', error);
      return [];
    }
  }
  return [];
};

// Hapus data pengaduan mahasiswa berdasarkan NIM
export const clearDataPengaduan = (nim) => {
  if (typeof window !== 'undefined') {
    let mahasiswa = getDataMahasiswa(nim);
    if (mahasiswa) {
      delete mahasiswa.pengaduan;
      saveDataMahasiswa(nim, mahasiswa);
    }
  }
};

// Fungsi agregator untuk mengambil _semua_ data pelanggaran dari seluruh mahasiswa
export const getAllPelanggaran = () => {
  if (typeof window !== 'undefined') {
    // Ambil semua key di localStorage yang dimulai dengan "pelanggaranData_"
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith('pelanggaranData_')
    );
    let allData = [];
    keys.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          // Pastikan data adalah string JSON yang valid
          if (typeof data === 'string' && data.trim().startsWith('[')) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              // Tambahkan key ke setiap item untuk menghindari duplikasi
              const dataWithKey = parsed.map((item) => ({
                ...item,
                storageKey: key, // Tambahkan key sebagai referensi
              }));
              allData = allData.concat(dataWithKey);
            }
          } else {
            console.warn(`Data for key ${key} is not a valid JSON array.`);
          }
        } catch (error) {
          console.error('Error parsing data for key', key, error);
        }
      } else {
        console.warn(`Data for key ${key} is undefined or null.`);
      }
    });
    return allData;
  }
  return [];
};

// Fungsi agregator untuk mengambil _semua_ data pengaduan dari seluruh mahasiswa
// Mengambil semua data pengaduan dari localStorage yang key-nya dimulai dengan "pengaduanData_"
export const getAllPengaduan = () => {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith('pengaduanData_')
    );
    let allData = [];
    keys.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          // Pastikan data adalah string JSON yang valid
          if (typeof data === 'string' && data.trim().startsWith('[')) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              // Tambahkan key ke setiap item untuk menghindari duplikasi
              const dataWithKey = parsed.map((item) => ({
                ...item,
                storageKey: key, // Tambahkan key sebagai referensi
              }));
              allData = allData.concat(dataWithKey);
            }
          } else {
            console.warn(`Data for key ${key} is not a valid JSON array.`);
          }
        } catch (error) {
          console.error('Error parsing data for key', key, error);
        }
      } else {
        console.warn(`Data for key ${key} is undefined or null.`);
      }
    });
    return allData;
  }
  return [];
};

export const getDataPengumuman = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('pengumumanData');
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveDataPengumuman = (pengumuman) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pengumumanData', JSON.stringify(pengumuman));
  }
};

export const clearDataPengumuman = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pengumumanData');
  }
};

export const getDataJadwalKegiatan = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('jadwalKegiatan');
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveDataJadwalKegiatan = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jadwalKegiatan', JSON.stringify(data));
  }
};

export function clearLocalStorage() {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
}
