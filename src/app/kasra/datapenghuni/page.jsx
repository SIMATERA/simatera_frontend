'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import DataMahasiswa from '@/app/admin/datapenghuni/datamahasiswa';
import PageHeading from '@/components/PageHeading';

const KasraDataPenghuni = () => {
  const [categories, setCategories] = useState('Data Mahasiswa');


  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      {/* Dropdown Pilihan */}
      <div className="flex-1 flex flex-col">
        <PageHeading title="Data Mahasiswa" />
        <div className="mt-4">
          {' '}
          {/* Tambahin margin atas */}
        </div>
        {/* Konten yang dipilih */}
        <DataMahasiswa /> 
      </div>
    </div>
  );
};

export default KasraDataPenghuni;
