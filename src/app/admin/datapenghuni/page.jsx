'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Select from '@/components/elements/Select';
import DataKasra from './datakasra'; // Import halaman Data Kasra
import DataMahasiswa from './datamahasiswa';

const KelolaData = () => {
  const [categories, setCategories] = useState('Data Mahasiswa');

  const valueOption = [
    { value: 'DEFAULT', label: 'Pilih Kategori', disabled: 'disabled' },
    { value: 'Data Kasra', label: 'Data Kasra', disabled: '' },
    { value: 'Data Mahasiswa', label: 'Data Mahasiswa', disabled: '' },
  ];

  return (
    <div>
      {/* Dropdown Pilihan */}
      <div className="w-full p-5">
        <Select
          className="w-full"
          selectedValue={categories}
          valueOption={valueOption}
          onChange={(e) => setCategories(e.target.value)}
        />
      </div>

      {/* Konten yang dipilih */}
      {categories === 'Data Mahasiswa' ? <DataMahasiswa /> : <DataKasra />}
    </div>
  );
};

export default KelolaData;
