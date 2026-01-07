import React, { useState, useEffect } from 'react';
import { 
  Home, Users, FileText, Database, Image as ImageIcon, BookOpen, UserCheck, 
  LogOut, Menu, Search, Bell, Camera, Book, MessageSquare, 
  ChevronRight, LayoutGrid, Globe, ShieldCheck, Settings
} from 'lucide-react';
import { User, UserRole } from '../types';

// --- Gaya CSS Khusus untuk Scrollbar & Animasi ---
const customStyles = `
  .custom-sidebar-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-sidebar-scrollbar::-webkit-scrollbar-track {
    background: #111827; 
  }
  .custom-sidebar-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(227, 36, 43, 0.2);
    border-radius: 10px;
  }
  .custom-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #E3242B;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

interface SidebarProps {
  currentUser: User | null;
  onLogout: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const MenuItem = ({ 
    icon: Icon, 
    label, 
    active, 
    onClick 
}: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group mb-1
      ${active 
        ? 'bg-[#E3242B] text-white shadow-lg shadow-red-900/40 translate-x-1' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
  >
    <div className="flex items-center space-x-3">
      <Icon size={18} className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-[#E3242B] transition-colors'}`} />
      <span className="font-semibold text-sm tracking-wide">{label}</span>
    </div>
    {active && <ChevronRight size={14} className="text-white/50" />}
  </button>
);

const MenuSection = ({ title }: { title: string }) => (
  <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em] mb-3 mt-8 px-4">
    {title}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentUser, onLogout, currentPath, onNavigate, isOpen, setIsOpen }) => {
  return (
    <>
      <style>{customStyles}</style>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-[#111827] z-[80] transform transition-transform duration-300 ease-in-out flex flex-col border-r border-white/5
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>


        {/* Logo Branding */}
<div className="h-24 flex items-center px-8 shrink-0">
  <div className="flex items-center gap-3">
            {/* Container Logo: Dibuat rounded-full (Lingkaran Sempurna) dan bg-white agar logo terlihat kontras & smooth */}
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg shadow-black/20 p-1.5 border border-white/10">
           <img 
            src="/img/logo-ddp.png" 
            alt="Logo DDP" 
            className="w-full h-full object-contain"  />
      </div>
    <div>
            {/* Teks: Menghapus 'italic' dan menggunakan font-bold agar tegak dan tegas */}
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
             DDP <span className="text-[#E3242B]">ADMIN</span>
            </h1>
              <p className="text-[9px] text-gray-500 font-bold tracking-widest mt-1 uppercase"> Presisi Untuk Negeri</p>
    </div>
  </div>
</div>

        {/* Menu Items dengan Custom Scrollbar */}
        <div className="px-4 overflow-y-auto flex-1 custom-sidebar-scrollbar pb-10">
          <MenuSection title="Main Engine" />
          <MenuItem icon={LayoutGrid} label="Dashboard" active={currentPath === '/'} onClick={() => onNavigate('/')} />
          
          {currentUser?.role_id === UserRole.SUPER_ADMIN && (
            <MenuItem icon={UserCheck} label="Approval Admin" active={currentPath === '/users'} onClick={() => onNavigate('/users')} />
          )}

          <MenuSection title="Descriptive Data" />
          <MenuItem icon={Database} label="Capaian Data" active={currentPath === '/capaian'} onClick={() => onNavigate('/capaian')} />
          <MenuItem icon={Camera} label="Galeri Kegiatan" active={currentPath === '/galeri'} onClick={() => onNavigate('/galeri')} />

          <MenuSection title="Information" />
          <MenuItem icon={FileText} label="Artikel & Berita" active={currentPath === '/artikel'} onClick={() => onNavigate('/artikel')} />
          <MenuItem icon={BookOpen} label="Monografi Desa" active={currentPath === '/monografi'} onClick={() => onNavigate('/monografi')} />
          <MenuItem icon={ImageIcon} label="Infografis DDP" active={currentPath === '/infografis'} onClick={() => onNavigate('/infografis')} />

          <MenuSection title="Resources" />
          <MenuItem icon={Book} label="Buku Digital" active={currentPath === '/buku'} onClick={() => onNavigate('/buku')} />
          <MenuItem icon={FileText} label="Jurnal Ilmiah" active={currentPath === '/jurnal'} onClick={() => onNavigate('/jurnal')} />

          <MenuSection title="Partnership" />
          <MenuItem icon={Users} label="Mitra Kerja Sama" active={currentPath === '/mitra'} onClick={() => onNavigate('/mitra')} />
          <MenuItem icon={MessageSquare} label="Testimoni Tokoh" active={currentPath === '/testimoni'} onClick={() => onNavigate('/testimoni')} />
        </div>

        {/* Profile Section Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20">
             <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E3242B] to-[#9b1318] flex items-center justify-center font-black text-white shadow-lg">
                  {currentUser?.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-white truncate">{currentUser?.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    {currentUser?.role_id === 1 ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
             </div>
             <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-xs uppercase tracking-widest"
              >
                <LogOut size={16} />
                <span>Logout System</span>
              </button>
        </div>
      </div>
    </>
  );
};

export const Topbar: React.FC<{ 
    currentUser: User | null, 
    onToggleSidebar: () => void 
}> = ({ currentUser, onToggleSidebar }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl sticky top-0 right-0 left-0 lg:left-72 z-40 px-8 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="p-2.5 rounded-xl hover:bg-gray-100 lg:hidden text-[#111827] transition-colors">
          <Menu size={24} />
        </button>
        <div className="hidden md:block">
          <p className="text-[10px] font-black text-[#E3242B] uppercase tracking-[0.3em]">Administrator Portal</p>
          <p className="text-sm font-black text-[#111827]">Sistem Data Desa Presisi IPB</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative group hidden sm:block">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E3242B] transition-colors" />
          <input 
            type="text" 
            placeholder="Search data..." 
            className="pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs w-56 focus:w-72 focus:ring-4 focus:ring-red-100 transition-all outline-none font-medium"
          />
        </div>
        
        <div className="h-10 w-[1px] bg-gray-100"></div>

        <button className="p-2.5 rounded-xl hover:bg-gray-50 relative text-gray-400 hover:text-[#E3242B] transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-[#E3242B] rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111827] flex items-center justify-center font-black text-white text-xs border-2 border-white shadow-md">
                {currentUser?.name.charAt(0)}
            </div>
        </div>
      </div>
    </header>
  );
};

export const Layout: React.FC<{ 
  children: React.ReactNode; 
  currentUser: User | null; 
  onLogout: () => void;
}> = ({ children, currentUser, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.hash.replace('#', '') || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.replace('#', '') || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-red-100 selection:text-[#E3242B]">
      <Sidebar 
        currentUser={currentUser} 
        onLogout={onLogout} 
        currentPath={currentPath} 
        onNavigate={navigate}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <main className="lg:ml-72 min-h-screen flex flex-col relative">
        <Topbar currentUser={currentUser} onToggleSidebar={() => setSidebarOpen(true)} />
        
        {/* Konten Utama dengan Animasi Fade In */}
        <div className="p-8 flex-1 animate-fade-in z-10">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </div>

        {/* Footer Kecil di Konten Utama */}
        <footer className="px-8 py-6 text-center lg:text-left border-t border-gray-100">
           <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">
             Official DDP Control Panel &copy; 2025
           </p>
        </footer>
      </main>
    </div>
  );
};