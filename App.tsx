import React, { useState, useEffect } from 'react';
import { Login, Register } from './pages/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';

// SOP: IMPORT SEMUA MODUL SECARA TERPISAH
import { 
  UserManagement, 
  CapaianModule, 
  ArtikelModule, 
  MonografiModule, 
  InfografisModule, 
  BukuModule,      // Sudah dipisah
  JurnalModule,    // Sudah dipisah
  MitraModule,     // Sudah dipisah
  TestimoniModule, // Sudah dipisah
  GaleriModule,    // Modul baru ditambahkan
  GenericPlaceholderModule 
} from './pages/Modules';
import { User, UserRole } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    // Mengecek apakah ada user yang tersimpan di memori browser (Session)
    const savedUser = localStorage.getItem('ddp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // Listener untuk mendeteksi perubahan menu (URL Hash)
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('ddp_user', JSON.stringify(loggedInUser));
    window.location.hash = '#/';
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ddp_user');
    localStorage.removeItem('token'); // Menghapus token akses API
    window.location.hash = '#/login';
  };

  // Tampilan loading saat aplikasi pertama kali dibuka
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#111827] text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E3242B] mx-auto mb-4"></div>
        <p className="font-bold tracking-widest uppercase text-xs">Memuat Sistem DDP...</p>
      </div>
    </div>
  );

  // Jika belum login, tampilkan halaman Login atau Register
  if (!user) {
    if (route === '#/register') return <Register />;
    return <Login onLoginSuccess={handleLogin} />;
  }

  // --- SISTEM ROUTING (NAVIGASI KONTEN) ---
  const renderContent = () => {
    const path = route.replace('#', '');
    
    switch (path) {
      case '/': 
      case '':
        return <Dashboard />;
        
      case '/users':
        // Proteksi: Hanya Super Admin (Role 1) yang bisa mengelola User
        if (user.role_id !== UserRole.SUPER_ADMIN) {
            return (
                <div className="p-10 bg-white rounded-2xl shadow-sm border border-red-100 text-center">
                    <h3 className="text-red-500 font-bold text-xl mb-2">Akses Ditolak</h3>
                    <p className="text-gray-500">Anda tidak memiliki izin untuk mengakses Manajemen User.</p>
                </div>
            );
        }
        return <UserManagement />;

      case '/capaian':
        return <CapaianModule />;

      case '/artikel':
        return <ArtikelModule />;

      case '/monografi':
        return <MonografiModule />;

      case '/infografis':
        return <InfografisModule />;

      // Modul Literatur yang sudah dipisah
      case '/buku':
        return <BukuModule />;

      case '/jurnal':
        return <JurnalModule />;

      // Modul Pihak Luar yang sudah dipisah
      case '/mitra':
        return <MitraModule />;

      case '/testimoni':
        return <TestimoniModule />;

      // Modul Baru: Galeri
      case '/galeri':
        return <GaleriModule />;

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <h2 className="text-2xl font-bold text-gray-300">404 - Halaman Tidak Ditemukan</h2>
            <button 
                onClick={() => window.location.hash = '#/'} 
                className="mt-4 px-6 py-2 bg-[#111827] text-white rounded-xl text-sm font-bold hover:bg-black transition-all"
            >
                Kembali ke Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <Layout currentUser={user} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
}

export default App;