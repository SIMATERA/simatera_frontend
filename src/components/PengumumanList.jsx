'use client';

import { useState, useEffect } from 'react';
import { getPengumuman, downloadPengumuman } from '@/services/PengumumanService';
import { formatDate } from '@/utils/dateFormatter';
import Link from 'next/link';
import Pagination from './Pagination';
import Search from './Search';
import ActionDropdown from './ActionDropdown';

const PengumumanList = () => {
    const [pengumuman, setPengumuman] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });

    const fetchPengumuman = async () => {
        try {
            setLoading(true);
            const params = {
                search: searchTerm,
                page: currentPage
            };

            if (dateFilter.startDate && dateFilter.endDate) {
                params.start_date = dateFilter.startDate;
                params.end_date = dateFilter.endDate;
            }

            const response = await getPengumuman(params);
            setPengumuman(response.data);
            setTotalPages(response.meta?.last_page || 1);
            setError(null);
        } catch (err) {
            console.error('Error fetching pengumuman:', err);
            setError('Gagal mengambil data pengumuman. Silakan coba lagi nanti.');
            setPengumuman([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPengumuman();
    }, [currentPage, searchTerm, dateFilter]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleDateFilter = (start, end) => {
        setDateFilter({
            startDate: start,
            endDate: end
        });
        setCurrentPage(1);
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
        } catch (err) {
            console.error('Error downloading file:', err);
            alert('Gagal mengunduh file. Silakan coba lagi nanti.');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <Search
                    placeholder="Cari pengumuman..."
                    onSearch={handleSearch}
                />
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="px-3 py-2 border rounded-md"
                        value={dateFilter.startDate}
                        onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                    />
                    <input
                        type="date"
                        className="px-3 py-2 border rounded-md"
                        value={dateFilter.endDate}
                        onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                    />
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        onClick={() => handleDateFilter(dateFilter.startDate, dateFilter.endDate)}
                    >
                        Filter
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : pengumuman.length === 0 ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    Tidak ada pengumuman yang ditemukan.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No
                                </th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Judul
                                </th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dibuat Oleh
                                </th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pengumuman.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {(currentPage - 1) * 10 + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <Link href={`/pengumuman/${item.id}`} className="text-blue-600 hover:text-blue-800">
                                            {item.judul_pengumuman}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(item.tanggal_pengumuman)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.creator?.name || 'Admin'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <ActionDropdown
                                            actions={[
                                                {
                                                    label: 'Lihat Detail',
                                                    icon: 'eye',
                                                    href: `/pengumuman/${item.id}`
                                                },
                                                item.file_pengumuman && {
                                                    label: 'Download File',
                                                    icon: 'download',
                                                    onClick: () => handleDownload(item.id)
                                                }
                                            ].filter(Boolean)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default PengumumanList; 