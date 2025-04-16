// @/utils/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout as authLogout, changePassword as authChangePassword } from '../services/AuthService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Menandai bahwa komponen sudah di-mount di client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cek localStorage saat aplikasi dimuat di client
  useEffect(() => {
    if (!mounted) return;

    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Gunakan service untuk mendapatkan user saat ini
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        // Mengurangi delay untuk mencegah flash
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [mounted]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Gunakan service logout
      await authLogout();
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Fungsi untuk memperbarui password di data mahasiswa
  const updatePasswordInMahasiswaData = (nim, newPassword) => {
    // Implementasi jika diperlukan
    console.log(`Password updated for NIM: ${nim}`);
  };

  // Fungsi untuk memperbarui password
  const updatePassword = async (newPassword) => {
    if (!user) return false;

    try {
      // Gunakan service untuk mengubah password
      await authChangePassword(user.password, newPassword);
      
      // Jika user adalah mahasiswa, perbarui juga data mahasiswa
      if (user.role === 'mahasiswa' && user.nim) {
        updatePasswordInMahasiswaData(user.nim, newPassword);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Middleware untuk protected routes
export function withAuth(Component, requiredRole) {
  return function ProtectedRoute(props) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!mounted || isLoading) return;

      if (!user) {
        router.push('/auth');
      } else if (requiredRole && user.role !== requiredRole) {
        // Redirect ke halaman yang sesuai dengan role
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'kasra') {
          router.push('/kasra');
        } else if (user.role === 'mahasiswa') {
          router.push('/mahasiswa');
        }
      }
    }, [user, isLoading, mounted, router, requiredRole]);

    // Tampilkan loading atau null saat proses autentikasi
    if (!mounted || isLoading || !user || (requiredRole && user.role !== requiredRole)) {
      return null;
    }

    return <Component {...props} />;
  };
}
