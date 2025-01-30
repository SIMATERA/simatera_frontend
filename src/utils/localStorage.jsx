export const getDataMahasiswa = () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('mahasiswaData');
      return data ? JSON.parse(data) : [];
    }
    return [];
  };
  
export const saveDataMahasiswa = (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahasiswaData', JSON.stringify(data));
    }
  };
  
export const clearDataMahasiswa = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mahasiswaData');
    }
  };

  // localStorage.js
export const getDataKasra = () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('kasraData');
      return data ? JSON.parse(data) : [];
    }
    return [];
  };
  
export const saveDataKasra = (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kasraData', JSON.stringify(data));
    }
  };
  
export const clearDataKasra = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kasraData');
    }
  };