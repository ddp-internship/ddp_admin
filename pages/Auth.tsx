import React, { useState } from 'react';
import { apiService } from '../services/api';
import { User } from '../types';
import { 
  ArrowRight, 
  LayoutDashboard, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

// --- Layout Dasar untuk Login & Register ---
const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => (
  <div className="min-h-screen flex bg-white font-sans">
    {/* Sisi Kiri - Area Branding (Hanya muncul di Desktop) */}
    <div className="hidden lg:flex w-1/2 bg-[#111827] relative overflow-hidden flex-col justify-between p-16 text-white">
      <div className="z-10">
        <div className="flex items-center gap-3 text-[#E3242B] mb-10">
          <div className="bg-white p-2 rounded-xl shadow-lg shadow-red-900/40">
            <img src="/img/logo-ddp.png" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">DDP <span className="text-[#E3242B]">ADMIN</span></span>
        </div>
        <h1 className="text-6xl font-black leading-[1.1] mb-6 tracking-tight">
          Data Desa <br /> <span className="text-[#E3242B]">Presisi.</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-md leading-relaxed">
          Platform manajemen data desa modern untuk mewujudkan kedaulatan data Indonesia.
        </p>
      </div>
      
      {/* Elemen Dekoratif Background */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[500px] h-[500px] rounded-full bg-[#E3242B]/10 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px]"></div>
      
      <div className="z-10 flex items-center gap-4 text-sm text-gray-500 font-medium tracking-widest uppercase">
        <span>Official Dashboard</span>
        <span className="w-10 h-[1px] bg-gray-800"></span>
        <span>v2.0</span>
      </div>
    </div>

    {/* Sisi Kanan - Area Form */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F9FAFB]">
      <div className="max-w-md w-full">
        {/* Logo Mobile */}
        <div className="mb-10 lg:hidden flex items-center justify-center gap-2">
            <div className="bg-white p-1.5 rounded-lg">
                <img src="/img/logo-ddp.png" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-2xl font-black text-[#111827]">DDP <span className="text-[#E3242B]">ADMIN</span></h1>
        </div>

        <div className="mb-10">
            <h2 className="text-4xl font-black text-[#111827] mb-3 tracking-tight">{title}</h2>
            <p className="text-gray-500 font-medium">{subtitle}</p>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
            {children}
        </div>

        <p className="mt-10 text-center text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">
            &copy; 2025 Unit Data Desa Presisi IPB
        </p>
      </div>
    </div>
  </div>
);

// --- MODUL LOGIN ---
export const Login: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await apiService.login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      // Ambil pesan error dari Laravel jika ada
      const message = err.response?.data?.message || 'Email atau Password salah.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Silakan masuk untuk mengelola data desa.">
        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-start gap-3 animate-shake">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span className="font-bold">{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 group-focus-within:text-[#E3242B] transition-colors">Email Address</label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E3242B] transition-colors" size={20} />
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#E3242B] outline-none transition-all text-gray-800 font-semibold"
                    placeholder="nama@email.com"
                />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 group-focus-within:text-[#E3242B] transition-colors">Security Password</label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E3242B] transition-colors" size={20} />
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#E3242B] outline-none transition-all text-gray-800 font-semibold"
                    placeholder="••••••••"
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E3242B] hover:bg-[#b01c22] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In To Dashboard'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-bold">
          <span className="text-gray-400 uppercase tracking-tighter">Belum punya akun?</span> 
          <a href="#/register" className="ml-2 text-[#E3242B] hover:underline decoration-2 underline-offset-4">Daftar Admin</a>
        </div>
    </AuthLayout>
  );
};

// --- MODUL REGISTER ---
export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiService.register(name, email, password);
      setSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registrasi gagal. Pastikan email belum terdaftar.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Tampilan Sukses (Menunggu Approval)
  if (success) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#111827] px-6">
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border-b-8 border-[#E3242B]">
                <div className="w-24 h-24 bg-red-50 text-[#E3242B] rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-inner">
                    <Clock size={48} />
                </div>
                <h2 className="text-3xl font-black text-[#111827] mb-4 tracking-tight">Pendaftaran Terkirim!</h2>
                <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                    Akun Anda berhasil dibuat. Namun, Anda memerlukan persetujuan <strong className="text-[#111827]">Super Admin</strong> sebelum dapat mengakses dashboard.
                </p>
                <a href="#/login" className="flex items-center justify-center gap-3 w-full py-4 bg-[#111827] text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-navy-900/30 uppercase tracking-widest text-xs">
                    Kembali ke Login
                </a>
            </div>
        </div>
      )
  }

  return (
    <AuthLayout title="Register" subtitle="Daftarkan diri Anda untuk mulai mengelola data.">
        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-[#E3242B]">Full Name</label>
            <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E3242B]" size={20} />
                <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#E3242B] outline-none transition-all text-gray-800 font-semibold"
                    placeholder="Masukkan nama lengkap"
                />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-[#E3242B]">Email Address</label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E3242B]" size={20} />
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#E3242B] outline-none transition-all text-gray-800 font-semibold"
                    placeholder="nama@email.com"
                />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-[#E3242B]">Password</label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E3242B]" size={20} />
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#E3242B] outline-none transition-all text-gray-800 font-semibold"
                    placeholder="Maksimal 8 karakter"
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E3242B] hover:bg-[#b01c22] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-bold">
          <span className="text-gray-400 uppercase tracking-tighter">Sudah punya akun?</span> 
          <a href="#/login" className="ml-2 text-[#E3242B] hover:underline decoration-2 underline-offset-4">Sign In</a>
        </div>
    </AuthLayout>
  );
};