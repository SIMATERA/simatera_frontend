'use client';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  useEffect(() => {
    document.title = 'Login - Asrama ITERA';
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dummyData = [
    { email: 'admin@itera.ac.id', password: 'admin123', role: 'admin' },
    { email: 'kasra@itera.ac.id', password: 'kasra123', role: 'kakak-asrama' },
    {
      email: 'mahasiswa@itera.ac.id',
      password: 'mahasiswa123',
      role: 'mahasiswa',
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const toastId = 'login-toast';

    const user = dummyData.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Simpan user ke localStorage
      if (!toast.isActive(toastId)) {
        toast.success(`Login berhasil sebagai ${user.role}`, { toastId });
      }
      setTimeout(() => {
        window.location.href = `/${user.role}`; // Redirect sesuai peran
      }, 1500);
    } else {
      if (!toast.isActive(toastId)) {
        toast.error('Email atau password salah', { toastId });
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-orange-100">
      <img
        src="images/headerbackgrounditera.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative z-10 bg-white p-8 shadow-lg rounded-lg w-full max-w-md md:max-w-sm lg:max-w-md">
        <div className="flex justify-center">
          <img
            src="images/iteralogo.png"
            alt="ITERA Logo"
            className="h-20 mb-6"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-1">
          Selamat Datang di SIMATERA
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sistem Informasi Asrama Mahasiswa ITERA
        </p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer limit={1} position="top-right" />
    </div>
  );
};

export default LoginPage;
