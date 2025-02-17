'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeading from '@/components/PageHeading';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { getDataMahasiswa, getDataPembayaran } from '@/utils/localStorage';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    borderBottom: 1,
    paddingBottom: 10,
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  logo: {
    width: 60,
    height: 60,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 140,
  },
  value: {
    flex: 1,
  },
  signatureSection: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: 200,
    alignItems: 'center',
  },
  signatureLine: {
    width: '100%',
    borderBottom: 1,
    marginTop: 50,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
});

// PDF Document Component
const PaymentReceipt = ({ dataMahasiswa, dataPembayaran }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image
          style={styles.logo}
          src="/images/logoasrama.png" // Make sure to add your logo in the public folder
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>BUKTI PEMBAYARAN ASRAMA</Text>
          <Text style={styles.subtitle}>Institut Teknologi Sumatera</Text>
          <Text style={styles.subtitle}>Jl. Terusan Ryacudu, Way Huwi, Kec. Jati Agung, Kabupaten Lampung Selatan, Lampung 35365</Text>
        </View>
      </View>

      {/* Student Information */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Nama</Text>
          <Text style={styles.value}>: {dataMahasiswa.nama}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>NIM</Text>
          <Text style={styles.value}>: {dataMahasiswa.nim}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gedung</Text>
          <Text style={styles.value}>: {dataMahasiswa.gedung}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kamar</Text>
          <Text style={styles.value}>: {dataMahasiswa.noKamar}</Text>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Periode</Text>
          <Text style={styles.value}>: {dataPembayaran.periode}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nominal</Text>
          <Text style={styles.value}>: Rp. {dataPembayaran.nominal.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status Pembayaran</Text>
          <Text style={styles.value}>: {dataPembayaran.statusPembayaran}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tanggal Pembayaran</Text>
          <Text style={styles.value}>: {dataPembayaran.tanggalPembayaran || '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Metode Pembayaran</Text>
          <Text style={styles.value}>: {dataPembayaran.metodePembayaran}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Catatan</Text>
          <Text style={styles.value}>: {dataPembayaran.catatan || '-'}</Text>
        </View>
      </View>

      {/* Signature Section */}
      <View style={styles.signatureSection}>
        <View style={styles.signatureBox}>
          <Text>Pembayar,</Text>
          <View style={styles.signatureLine} />
          <Text>{dataMahasiswa.nama}</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text>Petugas,</Text>
          <View style={styles.signatureLine} />
          <Text>(_________________)</Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Dokumen ini diterbitkan secara elektronik dan sah tanpa tanda tangan basah
      </Text>
    </Page>
  </Document>
);

// Main Component
const DataPembayaranMahasiswa = () => {
  const { user } = useAuth();
  const [dataPembayaran, setDataPembayaran] = useState(null);
  const [dataMahasiswa, setDataMahasiswa] = useState(null);

  useEffect(() => {
    if (user && user.nim) {
      const savedData = getDataMahasiswa();
      const mahasiswa = savedData.find(item => item.nim === user.nim);

      if (mahasiswa) {
        setDataMahasiswa(mahasiswa);
      } else {
        toast.error("Data mahasiswa tidak ditemukan!");
      }

      const pembayaran = getDataPembayaran(user.nim);
      if (pembayaran) {
        setDataPembayaran(pembayaran);
      } else {
        toast.error("Data pembayaran tidak ditemukan!");
      }
    }
  }, [user]);

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col">
        <PageHeading title="Bukti Pembayaran" />

        {dataMahasiswa && dataPembayaran ? (
          <div className="flex-1 p-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">NIM</th>
                  <th className="border p-2">Nama</th>
                  <th className="border p-2">Gedung</th>
                  <th className="border p-2">Kamar</th>
                  <th className="border p-2">Status Pembayaran</th>
                  <th className="border p-2">Periode</th>
                  <th className="border p-2">Nominal</th>
                  <th className="border p-2">Metode Pembayaran</th>
                  <th className="border p-2">Tanggal Pembayaran</th>
                  <th className="border p-2">Catatan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">{dataMahasiswa.nim}</td>
                  <td className="border p-2">{dataMahasiswa.nama}</td>
                  <td className="border p-2">{dataMahasiswa.gedung}</td>
                  <td className="border p-2">{dataMahasiswa.noKamar}</td>
                  <td className="border p-2">{dataPembayaran.statusPembayaran}</td>
                  <td className="border p-2">{dataPembayaran.periode}</td>
                  <td className="border p-2">Rp. {dataPembayaran.nominal.toLocaleString()}</td>
                  <td className="border p-2">{dataPembayaran.metodePembayaran}</td>
                  <td className="border p-2">{dataPembayaran.tanggalPembayaran || '-'}</td>
                  <td className="border p-2">{dataPembayaran.catatan || '-'}</td>
                </tr>
              </tbody>
            </table>

              <PDFDownloadLink
              document={<PaymentReceipt dataMahasiswa={dataMahasiswa} dataPembayaran={dataPembayaran} />}
              fileName={`bukti_pembayaran_${dataMahasiswa.nim}.pdf`}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Menyiapkan dokumen...' : 'Cetak Bukti Pembayaran'
              }
            </PDFDownloadLink>
          </div>
        ) : (
          <p className="p-6">Loading data pembayaran...</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default DataPembayaranMahasiswa;