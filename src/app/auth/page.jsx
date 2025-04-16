'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import { login } from '@/services/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Gunakan service login dengan email
      const userData = await login(email, password);
      
      // Update context auth
      authLogin(userData);
      
      // Tampilkan toast sukses
      toast.success('Login berhasil!');
      
      // Redirect berdasarkan role
      if (userData.role === 'admin') {
        router.push('/admin');
      } else if (userData.role === 'kasra') {
        router.push('/kasra');
      } else if (userData.role === 'mahasiswa') {
        router.push('/mahasiswa');
      }
    } catch (error) {
      // Tampilkan toast error
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-orange-100">
      <img
        src="images/headerbackgrounditera.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative z-10 bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300"
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
      <ToastContainer limit={1} position="top-right" />
    </div>
  );
};

export default LoginPage;
