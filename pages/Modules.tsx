import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { User as UserType, CapaianData, Artikel, UserRole } from '../types'; 
import { 
  // Ikon Umum & Navigasi
  Trash2, Edit2, Plus, Search, Check, X, Filter, ChevronDown, 
  MoreHorizontal, ChevronRight, ChevronLeft, Layout, ExternalLink,
  
  // Ikon Database & Statistik
  Database, BarChart3, Map, Home, Activity, Zap, Layers,
  
  // Ikon Modul (Berita, Galeri, Pustaka)
  Image as ImageIcon, Book, FileText, Camera, BookOpen, Bookmark, Globe, 
  
  // Ikon User & Gender
  Users, User, Venus, Mars, MessageSquare, Info, Calendar, GraduationCap
} from 'lucide-react';

// --- Setelah import ini, baru masuk ke kode komponen Dashboard, UserManagement, dll ---
// ... import lainnya seperti apiService tetap biarkan ...

// --- Shared UI Components ---

// --- Shared Components (Perbaikan untuk menghilangkan 105 Problems) ---

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50 border-b border-gray-200">
    <tr>{children}</tr>
  </thead>
);

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const Button: React.FC<{ 
  onClick?: (e: any) => void; 
  variant?: 'primary' | 'secondary' | 'danger'; 
  children: React.ReactNode; 
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}> = ({ onClick, variant = 'primary', children, className = '', type = 'button', disabled = false }) => {
    const base = "px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50";
    const styles = {
        primary: "bg-[#E3242B] text-white hover:bg-[#b01c22] shadow-md shadow-red-900/20",
        secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
    };
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
        {children}
      </button>
    );
};

const Modal = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111827]/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-[#111827]">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8">{children}</div>
            </div>
        </div>
    );
};

const ActionButton = ({ onClick, icon: Icon, color }: any) => (
    <button onClick={onClick} className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${color}`}>
        <Icon size={18} />
    </button>
);



// --- 1. Module: User Management ---

export const UserManagement: React.FC = () => {
    // Perbaikan: Ganti <User[]> menjadi <UserType[]> agar tidak bentrok dengan ikon
    const [users, setUsers] = useState<UserType[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => { loadUsers(); }, []);
    const loadUsers = async () => { setUsers(await apiService.getUsers()); };

    const toggleStatus = async (id: number) => {
        await apiService.toggleApproval(id);
        loadUsers();
    };

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

    // ... sisa kode return JSX di bawahnya tetap sama ...

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#111827]">Manajemen User</h2>
                    <p className="text-sm text-gray-500">Setujui (ACC) Admin untuk akses sistem</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="text" placeholder="Cari nama..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border rounded-xl outline-none w-64 shadow-sm" />
                </div>
            </div>
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <TableHeader><Th>Nama & Email</Th><Th>Role</Th><Th>Status</Th><Th>Aksi</Th></TableHeader>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                        {user.role_id === 1 ? 'Super Admin' : 'Admin'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => toggleStatus(user.id)} disabled={user.role_id === 1}
                                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${user.is_approved ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${user.is_approved ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    {user.role_id !== 1 && <ActionButton onClick={async () => { if(window.confirm('Hapus?')) { await apiService.deleteData('users', user.id); loadUsers(); } }} icon={Trash2} color="text-red-500" />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Module: Capaian Data Desa (Full Rewrite - Premium Analytics Dashboard) ---
export const CapaianModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const resetForm = {
        desa: 0, dusun: 0, rw: 0, kelurahan: 0, 
        bangunan: 0, kk: 0, jiwa: 0, laki: 0, perempuan: 0 
    };
    
    const [formData, setFormData] = useState<any>(resetForm);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const res = await apiService.getData('capaian');
        setData(res);
    };

    // FUNGSI LOGIKA: Menghitung Total Akumulasi untuk Dashboard Atas
    const calculateTotal = (field: string) => {
        return data.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.saveData('capaian', formData);
            setIsModalOpen(false);
            setFormData(resetForm);
            loadData();
            alert("Sinkronisasi Data Berhasil!");
        } catch (error) {
            alert("Gagal menyimpan data statistik.");
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (item: any) => {
        setFormData(item);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-10">
            {/* --- 1. HEADER & TOTAL SUMMARY (MINI DASHBOARD) --- */}
            <div className="space-y-8">
                <div className="flex justify-between items-end px-2">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Capaian Presisi</h2>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                            <Database size={14} className="text-[#E3242B]" /> Real-time Statistical Database
                        </p>
                    </div>
                    <Button onClick={() => { setFormData(resetForm); setIsModalOpen(true); }} className="shadow-xl shadow-red-900/10">
                        <Plus size={18} /> Update Data Baru
                    </Button>
                </div>

                {/* Grid Ringkasan Statistik (Mewah) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Desa', value: calculateTotal('desa'), icon: Map, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Total Bangunan', value: calculateTotal('bangunan'), icon: Home, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { label: 'Total Jiwa', value: calculateTotal('jiwa'), icon: Users, color: 'text-[#E3242B]', bg: 'bg-red-50' },
                        { label: 'Total KK', value: calculateTotal('kk'), icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <h3 className="text-xl font-black text-[#111827] tracking-tight">{stat.value.toLocaleString('id-ID')}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* --- 2. DATA GRID LIST (Pengganti Tabel) --- */}
            <div className="space-y-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] px-2">History Input Terakhir</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.map((item) => (
                        <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                            <div className="p-8 space-y-6">
                                {/* Row 1: Wilayah */}
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="bg-gray-900 text-white p-3 rounded-2xl">
                                            <Map size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[#111827] uppercase tracking-tighter">Sebaran Wilayah</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.created_at?.split('T')[0] || 'Recently'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <ActionButton onClick={() => openEdit(item)} icon={Edit2} color="text-blue-500" />
                                        <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('capaian', item.id); loadData(); } }} icon={Trash2} color="text-red-500" />
                                    </div>
                                </div>

                                {/* Row 2: Grid Angka Statistik */}
                                <div className="grid grid-cols-3 gap-4 border-y border-gray-50 py-6">
                                    {[
                                        { l: 'Desa', v: item.desa, i: Map },
                                        { l: 'Dusun', v: item.dusun, i: ChevronRight },
                                        { l: 'RW', v: item.rw, i: ChevronRight },
                                        { l: 'Kelurahan', v: item.kelurahan, i: Map },
                                        { l: 'Bangunan', v: item.bangunan, i: Home },
                                        { l: 'KK', v: item.kk, i: BarChart3 },
                                    ].map((stats, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{stats.l}</p>
                                            <p className="text-sm font-black text-[#111827]">{stats.v.toLocaleString('id-ID')}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Row 3: Gender Split (Mewah) */}
                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Total Jiwa</p>
                                            <p className="text-lg font-black text-[#E3242B]">{item.jiwa.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                                            <div className="h-full bg-blue-500" style={{ width: `${(item.laki/item.jiwa)*100}%` }}></div>
                                            <div className="h-full bg-pink-500" style={{ width: `${(item.perempuan/item.jiwa)*100}%` }}></div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase">
                                                <Mars size={10} /> {item.laki.toLocaleString('id-ID')} Laki-laki
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-pink-600 uppercase">
                                                <Venus size={10} /> {item.perempuan.toLocaleString('id-ID')} Perempuan
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- 3. MODAL FORM (PREMIUM GRID) --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Data Statistik" : "Input Statistik Desa Baru"}>
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-inner">
                        {[
                            { f: 'desa', l: 'Jumlah Desa', i: Map },
                            { f: 'kelurahan', l: 'Kelurahan', i: Map },
                            { f: 'dusun', l: 'Jumlah Dusun', i: ChevronRight },
                            { f: 'rw', l: 'Jumlah RW', i: ChevronRight },
                            { f: 'bangunan', l: 'Total Bangunan', i: Home },
                            { f: 'kk', l: 'Total KK', i: BarChart3 },
                            { f: 'jiwa', l: 'Total Jiwa', i: Users },
                            { f: 'laki', l: 'Laki-laki', i: Mars },
                            { f: 'perempuan', l: 'Perempuan', i: Venus },
                        ].map(field => (
                            <div key={field.f} className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">
                                    {field.l} <span className="text-[#E3242B]">*</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E3242B] transition-colors">
                                        <field.i size={16} />
                                    </div>
                                    <input 
                                        type="number" 
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-[#E3242B] outline-none transition-all font-black text-[#111827]" 
                                        value={formData[field.f]} 
                                        onChange={e => setFormData({...formData, [field.f]: Number(e.target.value)})}
                                        onFocus={(e) => e.target.value === '0' && setFormData({...formData, [field.f]: ''})}
                                        onBlur={(e) => e.target.value === '' && setFormData({...formData, [field.f]: 0})}
                                        required 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button type="submit" disabled={loading} className="w-full py-5 bg-[#111827] hover:bg-[#E3242B] text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-[10px]">
                            {loading ? "Menyinkronkan Database..." : (formData.id ? "Perbarui Statistik" : "Simpan Statistik Baru")}
                        </Button>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#111827] transition-colors py-2">
                            Batalkan Perubahan
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// --- Module: Artikel & Berita (Full Rewrite + Kategori + Index Indicator) ---

export const ArtikelModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State awal form: Tambahkan kategori default 'Berita'
    const [formData, setFormData] = useState<any>({ 
        judul_artikel: '', 
        kategori: 'Berita', // Default pilihan
        penulis: '', 
        tanggal: '', 
        isi_artikel: '', 
        gambar: null 
    });
    
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);
    
    const load = async () => { 
        // Mengambil semua data berita dari backend
        const res = await apiService.getData('beritaartikel');
        setData(res); 
    };

    const openEdit = (item: any) => {
        setFormData({ ...item, gambar: null });
        setPreview(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.saveData('beritaartikel', formData);
            setIsModalOpen(false);
            // Reset Form
            setFormData({ judul_artikel: '', kategori: 'Berita', penulis: '', tanggal: '', isi_artikel: '', gambar: null });
            setPreview(null);
            load();
            alert("Berhasil disimpan!");
        } catch (error: any) {
            console.error(error.response?.data);
            alert("Gagal simpan! Pastikan semua kolom terisi dengan benar.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if(window.confirm('Hapus berita ini selamanya?')){
            try {
                await apiService.deleteData('beritaartikel', id);
                load();
            } catch (error) {
                alert("Gagal menghapus.");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Module */}
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-2xl font-bold text-[#111827]">Artikel & Berita</h2>
                    <p className="text-sm text-gray-500 font-medium">Kelola publikasi konten Beranda dan Arsip</p>
                </div>
                <Button onClick={() => {setFormData({ judul_artikel: '', kategori: 'Berita', penulis: '', tanggal: '', isi_artikel: '', gambar: null }); setPreview(null); setIsModalOpen(true)}}>
                    <Plus size={18} /> Tulis Berita Baru
                </Button>
            </div>

            {/* Grid Berita */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.map((item, index) => (
                    <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        
                        {/* --- INDIKATOR LIVE FRONTEND --- */}
                        {/* Karena frontend ambil 3 terbaru, maka index 0, 1, dan 2 adalah yang sedang LIVE */}
                        {index < 3 && (
                            <div className="absolute top-0 right-0 z-20">
                                <div className="bg-[#E3242B] text-white text-[8px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
                                    Live on Index
                                </div>
                            </div>
                        )}

                        <div className="h-52 bg-gray-50 rounded-[2.5rem] mb-6 overflow-hidden border border-gray-50 relative shadow-inner">
                            {item.gambar ? (
                                <img src={`http://ddp_api.test/storage/${item.gambar}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon size={48} /></div>
                            )}
                            <div className="absolute bottom-4 left-6">
                                <span className="bg-white/90 backdrop-blur-md text-[#111827] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                                    {item.kategori || 'Berita'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="px-2 space-y-3">
                            <h3 className="font-bold text-lg text-[#111827] line-clamp-2 leading-tight uppercase tracking-tighter">
                                {item.judul_artikel}
                            </h3>
                            <div className="flex items-center justify-between pt-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Oleh: {item.penulis}</p>
                                <p className="text-[10px] font-black text-[#E3242B] uppercase tracking-widest">{item.tanggal}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-50">
                            <ActionButton onClick={() => openEdit(item)} icon={Edit2} color="text-blue-600" />
                            <ActionButton onClick={() => handleDelete(item.id)} icon={Trash2} color="text-red-500" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Perbarui Konten" : "Terbitkan Konten Baru"}>
                <form onSubmit={handleSave} className="space-y-5">
                    
                    {/* Input Judul */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Judul Artikel / Berita *</label>
                        <input className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm" value={formData.judul_artikel || ''} onChange={e => setFormData({...formData, judul_artikel: e.target.value})} required placeholder="Masukkan judul utama..." />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Dropdown Kategori */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Kategori Konten *</label>
                            <select 
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm appearance-none"
                                value={formData.kategori || 'Berita'}
                                onChange={e => setFormData({...formData, kategori: e.target.value})}
                                required
                            >
                                <option value="Berita">Berita (News)</option>
                                <option value="Artikel">Artikel (Article)</option>
                            </select>
                        </div>
                        {/* Input Penulis */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Penulis *</label>
                            <input className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm" value={formData.penulis || ''} onChange={e => setFormData({...formData, penulis: e.target.value})} required placeholder="Nama penulis..." />
                        </div>
                    </div>

                    {/* Input Tanggal */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Tanggal Terbit *</label>
                        <input type="date" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm" value={formData.tanggal || ''} onChange={e => setFormData({...formData, tanggal: e.target.value})} required />
                    </div>

                    {/* Input Konten */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Isi Artikel Lengkap *</label>
                        <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl h-44 outline-none focus:ring-2 focus:ring-red-100 resize-none font-medium text-sm" value={formData.isi_artikel || ''} onChange={e => setFormData({...formData, isi_artikel: e.target.value})} required placeholder="Tuliskan narasi berita di sini..." />
                    </div>

                    {/* Input Gambar */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">
                            {formData.id ? 'Ganti Sampul (Kosongkan jika tidak diubah)' : 'Upload Gambar Sampul *'}
                        </label>
                        <div className="relative group">
                            <input type="file" className="w-full p-3 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-bold text-gray-400" onChange={e => {
                                if(e.target.files && e.target.files[0]) {
                                    setFormData({...formData, gambar: e.target.files[0]});
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }
                            }} required={!formData.id} />
                        </div>
                        {preview && <img src={preview} className="h-32 w-full object-cover mt-4 rounded-3xl border-4 border-white shadow-sm" alt="Preview" />}
                    </div>

                    <Button type="submit" disabled={loading} className="w-full py-5 bg-[#E3242B] text-white font-black rounded-2xl shadow-xl shadow-red-900/20 uppercase tracking-[0.2em] text-[10px]">
                        {loading ? "Sinkronisasi..." : (formData.id ? "Simpan Perubahan" : "Terbitkan Sekarang")}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};
// --- Module: Monografi Desa (Full Rewrite - Premium Library Look) ---

export const MonografiModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);
    
    const load = async () => { 
        const res = await apiService.getData('monografi');
        setData(res); 
    };

    const handleToggleFeatured = async (id: number) => {
        try {
            const res = await apiService.toggleMonografiFeatured(id);
            alert(res.message);
            load();
        } catch (error: any) {
            alert(error.response?.data?.message || "Gagal mengubah status.");
        }
    };

    // --- PERBAIKAN LOGIKA SIMPAN (MENCEGAH ERROR 422/500) ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Kita bersihkan data agar yang dikirim hanya field yang dibutuhkan database saja
            const cleanData: any = {
                desa: formData.desa,
                kecamatan: formData.kecamatan,
                kota: formData.kota,
                provinsi: formData.provinsi,
                tahun: formData.tahun,
                ringkasan: formData.ringkasan,
                link: formData.link,
            };

            // Jika ada file gambar baru, masukkan ke data
            if (formData.gambar instanceof File) {
                cleanData.gambar = formData.gambar;
            }

            // Jika sedang EDIT (ada ID), sertakan ID-nya agar apiService tahu ini UPDATE
            if (formData.id) {
                cleanData.id = formData.id;
            }

            await apiService.saveData('monografi', cleanData);
            setIsModalOpen(false);
            setFormData({});
            setPreview(null);
            load();
            alert("Katalog Monografi Berhasil Diperbarui!");
        } catch (error: any) {
            console.error("Error Detail:", error.response?.data);
            const msg = error.response?.data?.message || "Pastikan format link (http/https) dan data terisi benar.";
            alert("Gagal Simpan: " + msg);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if(window.confirm('Hapus Monografi ini selamanya?')){
            try {
                await apiService.deleteData('monografi', id);
                load();
                alert("Data berhasil dihapus!");
            } catch (error) {
                alert("Gagal menghapus data.");
            }
        }
    };

    const openEdit = (item: any) => {
        // Saat edit, kita ambil datanya tapi gambar string lama jangan dimasukkan ke input file
        setFormData({ ...item, gambar: null });
        setPreview(`http://ddp_api.test/storage/${item.gambar}`);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-10">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-2 gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter text-shadow-sm">Monografi Desa</h2>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-12 bg-[#E3242B] rounded-full"></div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Digital Book Repository</p>
                    </div>
                </div>
                <Button onClick={() => {setFormData({}); setPreview(null); setIsModalOpen(true)}} className="shadow-2xl shadow-red-900/20 px-8 py-6">
                    <Plus size={20} /> Tambah Katalog
                </Button>
            </div>
            
            {/* --- GRID KATALOG MEWAH --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {data.map((item) => (
                    <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 p-5 shadow-sm hover:shadow-2xl transition-all duration-700 group relative">
                        
                        {/* Featured Badge */}
                        {item.is_featured && (
                            <div className="absolute top-8 right-8 z-10 scale-90 group-hover:scale-100 transition-transform">
                                <div className="bg-[#E3242B] text-white text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                                    Featured
                                </div>
                            </div>
                        )}

                        {/* Cover Image (Portrait) */}
                        <div className="aspect-[3/4] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-inner border border-gray-50">
                            {item.gambar ? (
                                <img src={`http://ddp_api.test/storage/${item.gambar}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-200"><Book size={60} /></div>
                            )}
                            
                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-[#111827]/60 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[3px] flex flex-col items-center justify-center gap-4">
                                <button onClick={() => openEdit(item)} className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="w-12 h-12 bg-white text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Info Konten */}
                        <div className="px-3 space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-[#E3242B] uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md">Tahun {item.tahun}</span>
                                </div>
                                <h4 className="font-black text-lg text-[#111827] uppercase tracking-tighter leading-tight line-clamp-1 group-hover:text-[#E3242B] transition-colors">
                                    Desa {item.desa}
                                </h4>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                    {item.kecamatan}, {item.kota}
                                </p>
                            </div>

                            {/* Logic Toggle Featured di Card */}
                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Pajang di Home</span>
                                <button 
                                    onClick={() => handleToggleFeatured(item.id)} 
                                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-500 ${item.is_featured ? 'bg-[#E3242B] shadow-lg shadow-red-200' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-500 ${item.is_featured ? 'translate-x-7' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL FORM PREMIUM --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Update Katalog Monografi" : "Input Katalog Baru"}>
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[3rem] border border-gray-100 shadow-inner">
                        {['desa', 'kecamatan', 'kota', 'provinsi', 'tahun', 'link'].map(f => (
                            <div key={f} className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block px-2 tracking-[0.2em]">{f} *</label>
                                <input 
                                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#E3242B] font-bold text-sm shadow-sm transition-all" 
                                    placeholder={`Ketik ${f}...`}
                                    value={formData[f] || ''} 
                                    onChange={e => setFormData({...formData, [f]: e.target.value})} 
                                    required 
                                />
                            </div>
                        ))}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block px-2 tracking-[0.2em]">Ringkasan Profil Desa *</label>
                            <textarea 
                                className="w-full p-5 bg-white border border-gray-100 rounded-[2rem] h-32 outline-none focus:ring-2 focus:ring-[#E3242B] font-medium text-sm shadow-sm resize-none" 
                                value={formData.ringkasan || ''} 
                                onChange={e => setFormData({...formData, ringkasan: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block px-2 tracking-[0.2em]">
                                {formData.id ? 'Perbarui Sampul (Biarkan kosong jika tidak diubah)' : 'Upload Sampul Katalog *'}
                            </label>
                            <input 
                                type="file" 
                                className="w-full p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-bold text-gray-400" 
                                onChange={e => {
                                    if(e.target.files){
                                        setFormData({...formData, gambar: e.target.files[0]});
                                        setPreview(URL.createObjectURL(e.target.files[0]));
                                    }
                                }} 
                                required={!formData.id} 
                            />
                            {preview && (
                                <div className="mt-4 w-32 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                                    <img src={preview} className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <Button type="submit" disabled={loading} className="w-full py-5 bg-[#111827] hover:bg-[#E3242B] text-white font-black rounded-2xl shadow-2xl transition-all uppercase tracking-[0.3em] text-[10px]">
                        {loading ? "Menyinkronkan Database..." : (formData.id ? "Simpan Perubahan" : "Terbitkan Katalog")}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

// --- 5. Module: Infografis (Multiple Upload) ---

export const InfografisModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // 1. State Form Lengkap (Substansi Utuh)
    const [formData, setFormData] = useState<any>({ 
        judul: '', 
        keterangan: '', 
        link: '', 
        gambar: [] 
    });
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => { 
        loadData(); 
    }, []);

    // --- FUNGSI AMBIL DATA ---
    const loadData = async () => {
        try {
            const res = await apiService.getData('infografis');
            setData(res);
        } catch (error) {
            console.error("Sinkronisasi Gagal");
        }
    };

    // --- FUNGSI PILIH GAMBAR (MULTIPLE) ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files) as File[];
            setFormData({ ...formData, gambar: filesArray });

            // Generate Preview URL
            const urlPreviews = filesArray.map((file: File) => URL.createObjectURL(file));
            setPreviews(urlPreviews);
        }
    };

    // --- FUNGSI SAKLAR BERANDA (FEATURED) ---
    const handleToggleHome = async (id: number) => {
        try {
            const res = await apiService.toggleInfografisHome(id);
            alert(res.message);
            loadData();
        } catch (error: any) {
            // Menampilkan pesan error jika sudah mencapai batas 4 data
            alert(error.response?.data?.message || "Gagal memperbarui status beranda.");
        }
    };

    // --- FUNGSI MODAL TRIGGER ---
    const openCreate = () => {
        setFormData({ judul: '', keterangan: '', link: '', gambar: [] });
        setPreviews([]);
        setIsModalOpen(true);
    };

    const openEdit = (item: any) => {
        // PENTING: ID disertakan agar API mengenali perintah UPDATE
        setFormData({ 
            id: item.id,
            judul: item.judul,
            keterangan: item.keterangan || '',
            link: item.link || '',
            gambar: [] // Gambar baru kosong kecuali diunggah ulang
        });
        setPreviews([]);
        setIsModalOpen(true);
    };

    // --- FUNGSI SIMPAN (TAMBAH & UPDATE) ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mengirim data ke api.ts (Otomatis handle FormData & Method Spoofing)
            await apiService.saveData('infografis', formData);
            
            setIsModalOpen(false);
            setFormData({ judul: '', keterangan: '', link: '', gambar: [] });
            setPreviews([]);
            loadData();
            alert("Data Infografis Berhasil Disimpan!");
        } catch (error: any) {
            console.error("Gagal simpan:", error.response?.data);
            alert("Gagal simpan. Periksa ukuran file (Maks 10MB) atau koneksi server.");
        } finally {
            setLoading(false);
        }
    };

    // --- FUNGSI HAPUS ---
    const handleDelete = async (id: number) => {
        if (window.confirm('Hapus seluruh album infografis ini?')) {
            try {
                await apiService.deleteData('infografis', id);
                loadData();
            } catch (error) {
                alert("Gagal menghapus.");
            }
        }
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center px-4">
                <div>
                    <h2 className="text-3xl font-black text-[#111827] tracking-tighter uppercase">Infografis & Visual</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Manajemen Data Visual Beranda</p>
                </div>
                <Button onClick={openCreate} className="px-8">
                    <Plus size={18} /> Unggah Baru
                </Button>
            </div>
            
            {/* --- GRID KARTU (Layout Premium) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                {data.map(item => (
                    <div key={item.id} className={`group bg-white border-2 rounded-[2.5rem] p-6 transition-all duration-500 shadow-sm hover:shadow-2xl ${item.is_approved_home ? 'border-[#E3242B] shadow-red-900/5' : 'border-gray-100'}`}>
                        
                        {/* Area Preview Cover */}
                        <div className="aspect-[4/3] bg-gray-50 rounded-[2rem] mb-6 flex items-center justify-center overflow-hidden border border-gray-100 relative shadow-inner">
                            {item.gambar && item.gambar.length > 0 ? (
                                <img 
                                    src={`http://ddp_api.test/storage/${item.gambar[0]}`} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt="Cover" 
                                />
                            ) : <ImageIcon size={40} className="text-gray-200" />}
                            
                            <div className="absolute top-4 right-4 bg-[#111827]/80 backdrop-blur-md text-white text-[9px] px-3 py-1 rounded-full font-black uppercase border border-white/10">
                                {item.gambar?.length || 0} Slides
                            </div>
                        </div>
                        
                        {/* Judul & Status */}
                        <div className="space-y-1 mb-6">
                            <h4 className="font-black text-sm text-[#111827] truncate uppercase tracking-tight">{item.judul}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1">{item.keterangan || 'Tanpa Keterangan'}</p>
                        </div>
                        
                        {/* SAKLAR KONTROL BERANDA */}
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Beranda</span>
                                <span className={`text-[10px] font-bold mt-1 uppercase ${item.is_approved_home ? 'text-emerald-500' : 'text-gray-300'}`}>
                                    {item.is_approved_home ? 'Aktif' : 'Draft'}
                                </span>
                            </div>
                            <button 
                                onClick={() => handleToggleHome(item.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${item.is_approved_home ? 'bg-emerald-500 shadow-md shadow-emerald-900/20' : 'bg-gray-300'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.is_approved_home ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        {/* TOMBOL AKSI */}
                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                            <ActionButton icon={Edit2} color="text-blue-500" onClick={() => openEdit(item)} />
                            <ActionButton icon={Trash2} color="text-red-500" onClick={() => handleDelete(item.id)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL FORM KOMPREHENSIF --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Album Infografis" : "Unggah Publikasi Baru"}>
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Grid Inputs */}
                    <div className="grid grid-cols-1 gap-5 bg-gray-50 p-8 rounded-[3rem] border border-gray-100">
                        
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Judul Album <span className="text-red-500">*</span></label>
                            <input 
                                className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-[#E3242B] outline-none transition-all font-bold text-navy" 
                                value={formData.judul} 
                                onChange={e => setFormData({...formData, judul: e.target.value})} 
                                required 
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Keterangan Ringkas</label>
                            <textarea 
                                className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-[#E3242B] outline-none transition-all font-medium text-sm min-h-[100px] resize-none" 
                                value={formData.keterangan} 
                                onChange={e => setFormData({...formData, keterangan: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Link Eksternal (Download Drive)</label>
                            <input 
                                className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-[#E3242B] outline-none transition-all font-bold text-blue-600" 
                                value={formData.link} 
                                onChange={e => setFormData({...formData, link: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">
                                {formData.id ? 'Ganti Kumpulan Poster (Pilih baru jika ingin ganti)' : 'Pilih Gambar (Multiple Upload) *'}
                            </label>
                            <input 
                                type="file" 
                                multiple 
                                className="w-full p-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-xs font-bold text-gray-400" 
                                onChange={handleFileChange} 
                                required={!formData.id} 
                            />
                        </div>

                        {/* Preview Section */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-5 gap-3 pt-2">
                                {previews.map((url, i) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-white shadow-md">
                                        <img src={url} className="w-full h-full object-cover" alt="Preview" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="px-8">Batal</Button>
                        <Button type="submit" disabled={loading} className="px-12 uppercase tracking-widest font-black">
                            {loading ? "Sinkronisasi..." : "Simpan Album"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// --- 6. Module: Buku ---

// --- Module: Koleksi Buku DDP (Full Rewrite - Fixed Pagination & Map Error) ---

// --- Module: Koleksi Buku DDP (Full Rewrite - Fixed Neat Layout & Pagination) ---

export const BukuModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ judul: '', penulis: '', ringkasan: '', link_drive: '', gambar: null });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // --- State Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => { load(currentPage); }, [currentPage]);

    const load = async (page: number) => {
        try {
            const res = await apiService.getData(`buku?page=${page}`);
            // SOP: Handle Paginasi Laravel agar tidak error .map
            if (res && res.data) {
                setData(res.data);
                setCurrentPage(res.current_page);
                setLastPage(res.last_page);
            } else {
                setData(Array.isArray(res) ? res : []);
            }
        } catch (error) {
            console.error("Gagal load data buku:", error);
            setData([]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, gambar: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.saveData('buku', formData);
            setIsModalOpen(false);
            setPreview(null);
            setFormData({ judul: '', penulis: '', ringkasan: '', link_drive: '', gambar: null });
            load(currentPage);
            alert("Koleksi Berhasil Disimpan!");
        } catch (error) {
            alert("Gagal simpan. Cek format link dan gambar.");
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (item: any) => {
        setFormData({ ...item, gambar: null });
        setPreview(`http://ddp_api.test/storage/${item.gambar}`);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-10">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-2 gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Koleksi Buku DDP</h2>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-12 bg-[#E3242B] rounded-full"></div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Digital Library Management</p>
                    </div>
                </div>
                <Button onClick={() => { setFormData({ judul: '', penulis: '', ringkasan: '', link_drive: '', gambar: null }); setPreview(null); setIsModalOpen(true); }} className="shadow-2xl shadow-red-900/10">
                    <Plus size={18} /> Tambah Buku Baru
                </Button>
            </div>
            
            {/* --- GRID DISPLAY (Sangat Rapi & Tidak Tertumpuk) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {Array.isArray(data) && data.length > 0 ? data.map((item) => (
                    <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 p-5 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
                        
                        {/* Area Sampul (Locked Aspect Ratio) */}
                        <div className="aspect-[3/4] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 relative border border-gray-50 shadow-inner shrink-0">
                            <img src={`http://ddp_api.test/storage/${item.gambar}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt="Cover" />
                            
                            {/* Overlay Aksi */}
                            <div className="absolute inset-0 bg-[#111827]/60 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center gap-4">
                                <button onClick={() => openEdit(item)} className="w-12 h-12 bg-white text-[#111827] rounded-2xl flex items-center justify-center hover:bg-[#E3242B] hover:text-white transition-all shadow-xl">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={async () => { if(window.confirm('Hapus buku ini?')){ await apiService.deleteData('buku', item.id); load(currentPage); } }} className="w-12 h-12 bg-white text-red-50 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Area Teks (Flex Grow agar tombol selalu di bawah) */}
                        <div className="flex-1 flex flex-col px-2">
                            <div className="space-y-2 mb-6">
                                <span className="text-[9px] font-black text-[#E3242B] uppercase tracking-[0.2em] bg-red-50 px-2 py-0.5 rounded">Verified Archive</span>
                                <h4 className="font-black text-base text-[#111827] uppercase tracking-tighter leading-tight line-clamp-2 min-h-[2.5rem]">
                                    {item.judul}
                                </h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.penulis}</p>
                            </div>
                            
                            <p className="text-[11px] text-gray-400 font-medium line-clamp-3 leading-relaxed uppercase mb-6 flex-1">
                                {item.ringkasan}
                            </p>

                            <div className="pt-4 border-t border-gray-50">
                                <a href={item.link_drive} target="_blank" rel="noreferrer" className="w-full py-3 bg-gray-50 text-[#111827] rounded-2xl flex items-center justify-center gap-3 font-black text-[9px] uppercase tracking-widest hover:bg-[#E3242B] hover:text-white transition-all">
                                    <Globe size={14} /> Akses G-Drive
                                </a>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-32 text-center opacity-20 flex flex-col items-center gap-6">
                        <Layers size={64} />
                        <p className="font-black uppercase tracking-[0.4em] text-xs">Katalog Pustaka Kosong</p>
                    </div>
                )}
            </div>

            {/* --- PAGINATION (Tesla Style) --- */}
            {lastPage > 1 && (
                <div className="flex justify-center items-center gap-6 pt-10 border-t border-gray-50">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#E3242B] disabled:opacity-20 transition-all"
                    >
                        <ChevronLeft size={18} /> Prev
                    </button>
                    
                    <div className="flex gap-2">
                        {[...Array(lastPage)].map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all ${currentPage === i + 1 ? 'bg-[#111827] text-white shadow-xl scale-110' : 'bg-gray-50 text-gray-400 hover:bg-white border border-gray-100'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                        disabled={currentPage === lastPage}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#E3242B] disabled:opacity-20 transition-all"
                    >
                        Next <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* --- MODAL FORM --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Update Buku" : "Publikasi Baru"}>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100 shadow-inner text-left">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Judul Buku *</label>
                            <input className="w-full p-4 bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm" value={formData.judul || ''} onChange={e => setFormData({...formData, judul: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Penulis *</label>
                            <input className="w-full p-4 bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm" value={formData.penulis || ''} onChange={e => setFormData({...formData, penulis: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Link Drive *</label>
                            <input className="w-full p-4 bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm" value={formData.link_drive || ''} onChange={e => setFormData({...formData, link_drive: e.target.value})} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Ringkasan *</label>
                            <textarea className="w-full p-5 bg-white border-none rounded-[2rem] h-32 outline-none focus:ring-2 focus:ring-red-100 font-medium text-sm resize-none" value={formData.ringkasan || ''} onChange={e => setFormData({...formData, ringkasan: e.target.value})} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Upload Sampul *</label>
                            <input type="file" className="w-full p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-bold text-gray-400" onChange={handleFileChange} required={!formData.id} />
                            {preview && <img src={preview} className="mt-6 w-32 aspect-[3/4] object-cover rounded-2xl border-4 border-white shadow-2xl" />}
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full py-5 bg-[#111827] hover:bg-[#E3242B] text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-[10px]">
                        {loading ? "Menyinkronkan..." : "Terbitkan Koleksi"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

// --- 7. Module: Jurnal ---

// --- Module: Jurnal Ilmiah (Full Rewrite - Fixed handleFileChange Error) ---

export const JurnalModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ judul: '', penulis: '', link: '', gambar: null });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // --- State Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => { load(currentPage); }, [currentPage]);

    const load = async (page: number) => {
        try {
            const res = await apiService.getData(`jurnal?page=${page}`);
            if (res && res.data) {
                setData(res.data);
                setCurrentPage(res.current_page);
                setLastPage(res.last_page);
            } else {
                setData(Array.isArray(res) ? res : []);
            }
        } catch (error) {
            console.error("Gagal load jurnal:", error);
            setData([]);
        }
    };

    // --- FUNGSI YANG TADI ERROR: handleFileChange ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, gambar: file });
            setPreview(URL.createObjectURL(file)); // Membuat pratinjau gambar
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.saveData('jurnal', formData);
            setIsModalOpen(false);
            setPreview(null);
            setFormData({ judul: '', penulis: '', link: '', gambar: null });
            load(currentPage);
            alert("Jurnal Berhasil Dipublikasikan!");
        } catch (error) {
            alert("Gagal simpan data.");
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (item: any) => {
        setFormData({ ...item, gambar: null });
        setPreview(`http://ddp_api.test/storage/${item.gambar}`);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-10">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-2 gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Jurnal Ilmiah</h2>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-12 bg-[#E3242B] rounded-full"></div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Academic Research Repository</p>
                    </div>
                </div>
                <Button onClick={() => { setFormData({ judul: '', penulis: '', link: '', gambar: null }); setPreview(null); setIsModalOpen(true); }} className="shadow-2xl shadow-red-900/10">
                    <Plus size={18} /> Tambah Jurnal Baru
                </Button>
            </div>
            
            {/* --- GRID DISPLAY --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.isArray(data) && data.length > 0 ? data.map((item) => (
                    <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 group relative">
                        <div className="flex gap-6">
                            <div className="w-28 h-36 bg-gray-50 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-inner border border-gray-50 relative">
                                <img src={`http://ddp_api.test/storage/${item.gambar}`} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                                <div className="absolute inset-0 bg-[#111827]/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <FileText size={20} className="text-white" />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="space-y-2 text-left">
                                    <h4 className="font-black text-sm text-[#111827] uppercase tracking-tighter leading-tight line-clamp-2">{item.judul}</h4>
                                    <p className="text-[10px] text-[#E3242B] font-black uppercase tracking-[0.1em]">{item.penulis}</p>
                                    <div className="flex items-center gap-2 pt-2">
                                        <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-100">Indexed</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-4">
                                    <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all uppercase border border-blue-100">
                                        <ExternalLink size={12} /> Link
                                    </a>
                                    <div className="flex gap-2">
                                        <ActionButton icon={Edit2} color="text-blue-500" onClick={() => openEdit(item)} />
                                        <ActionButton icon={Trash2} color="text-red-500" onClick={async () => { if(window.confirm('Hapus jurnal ini?')){ await apiService.deleteData('jurnal', item.id); load(currentPage); } }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center opacity-20 flex flex-col items-center gap-4">
                        <Layers size={50} />
                        <p className="font-black uppercase tracking-[0.3em] text-xs">Arsip Jurnal Kosong</p>
                    </div>
                )}
            </div>

            {/* --- PAGINATION --- */}
            {lastPage > 1 && (
                <div className="flex justify-center items-center gap-4 pt-10">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-[#111827] hover:text-white disabled:opacity-20 transition-all bg-white"><ChevronLeft size={20}/></button>
                    <div className="bg-white px-8 py-3 rounded-2xl border border-gray-100 shadow-sm"><span className="text-xs font-black text-[#111827] uppercase tracking-[0.3em]">{currentPage} / {lastPage}</span></div>
                    <button disabled={currentPage === lastPage} onClick={() => setCurrentPage(p => p + 1)} className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-[#111827] hover:text-white disabled:opacity-20 transition-all bg-white"><ChevronRight size={20}/></button>
                </div>
            )}

            {/* --- MODAL FORM --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Update Jurnal" : "Tambah Jurnal Ilmiah"}>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100 shadow-inner text-left">
                        <div className="md:col-span-2 text-left">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Judul Lengkap Jurnal *</label>
                            <input className="w-full p-4 bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm shadow-sm" value={formData.judul || ''} onChange={e => setFormData({...formData, judul: e.target.value})} required />
                        </div>
                        <div className="text-left">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Penulis Utama *</label>
                            <input className="w-full p-4 bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm shadow-sm" value={formData.penulis || ''} onChange={e => setFormData({...formData, penulis: e.target.value})} required />
                        </div>
                        <div className="text-left">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Link Publikasi (URL) *</label>
                            <input className="w-full p-4 bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm shadow-sm" placeholder="https://..." value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} required />
                        </div>
                        <div className="md:col-span-2 text-left">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Cover Jurnal *</label>
                            {/* --- TRIGGER FUNGSI: handleFileChange --- */}
                            <input type="file" className="w-full p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-bold text-gray-400" onChange={handleFileChange} required={!formData.id} />
                            {preview && <img src={preview} className="mt-6 w-32 h-44 object-cover rounded-2xl border-4 border-white shadow-2xl" />}
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full py-5 bg-[#111827] hover:bg-[#E3242B] text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-[10px]">
                        {loading ? "Menyinkronkan..." : "Publish Jurnal"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};
// --- 8. Module: Mitra ---

export const MitraModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Inisialisasi awal kategori ke 'pemerintah'
    const [formData, setFormData] = useState<any>({ nama_mitra: '', kategori: 'pemerintah', gambar: null });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('mitra')); };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, gambar: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const openEdit = (item: any) => {
        setFormData({ ...item, gambar: null }); 
        setPreview(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.saveData('mitra', formData);
            setIsModalOpen(false);
            setPreview(null);
            load();
            alert("Data Berhasil Disimpan!");
        } catch (error) {
            alert("Gagal simpan. Cek koneksi server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-2xl font-bold text-[#111827]">Mitra Strategis</h2>
                    <p className="text-sm text-gray-500 font-medium">Klasifikasi logo instansi kerja sama</p>
                </div>
                <Button onClick={() => { setFormData({ nama_mitra: '', kategori: 'pemerintah', gambar: null }); setPreview(null); setIsModalOpen(true); }}>
                    <Plus size={18} /> Tambah Mitra
                </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {data.map(item => (
                    <div key={item.id} className="bg-white border rounded-2xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-all group relative border-gray-100">
                        <div className="h-20 w-full flex items-center justify-center mb-4">
                            <img src={`http://ddp_api.test/storage/${item.gambar}`} className="max-h-full grayscale group-hover:grayscale-0 transition-all duration-500" alt={item.nama_mitra} />
                        </div>
                        <span className="text-[10px] font-black uppercase text-center text-gray-400 tracking-tighter mb-1 h-8 line-clamp-2">{item.nama_mitra}</span>
                        {/* Label Kategori Kecil */}
                        <span className="text-[8px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase">{item.kategori}</span>
                        
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => openEdit(item)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                                <Edit2 size={12} />
                            </button>
                            <button onClick={async () => { if(window.confirm('Hapus mitra?')){ await apiService.deleteData('mitra', item.id); load(); } }} 
                                className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Mitra" : "Tambah Mitra Baru"}>
                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Nama Instansi/Mitra *</label>
                        <input className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-red-100" value={formData.nama_mitra || ''} onChange={e => setFormData({...formData, nama_mitra: e.target.value})} required />
                    </div>

                    {/* --- DROPDOWN KATEGORI --- */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Klasifikasi Mitra *</label>
                        <select 
                            className="w-full p-2.5 border rounded-xl outline-none bg-white font-bold text-sm text-[#111827]"
                            value={formData.kategori || 'pemerintah'}
                            onChange={e => setFormData({...formData, kategori: e.target.value})}
                            required
                        >
                            <option value="pemerintah">PEMERINTAH & INSTANSI</option>
                            <option value="akademisi">AKADEMISI & RISET</option>
                            <option value="lembaga">LEMBAGA STRATEGIS</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                            {formData.id ? "Ganti Logo (Opsional)" : "Upload Logo *"}
                        </label>
                        <input type="file" className="w-full p-2 border border-dashed rounded-xl" onChange={handleFileChange} required={!formData.id} />
                        {preview && <img src={preview} className="h-20 mt-3 mx-auto border rounded-lg p-1" />}
                    </div>
                    <Button type="submit" disabled={loading} className="w-full py-4 uppercase tracking-[0.2em]">
                        {loading ? "Sinkronisasi..." : "Simpan Perubahan"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};


// --- Module: Testimoni (Full Rewrite) ---

export const TestimoniModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State awal form
    const [formData, setFormData] = useState<any>({ nama: '', jabatan: '', tanggal: '', isi: '', gambar: null });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);
    
    // Fungsi Ambil Data
    const load = async () => { 
        const res = await apiService.getData('testimoni');
        setData(res); 
    };

    // Fungsi Khusus: Toggle Pilih 3 Testimoni
    const handleToggleTampil = async (id: number) => {
        try {
            // Kita panggil route yang tadi sudah dibuat di api.php
            const res = await apiService.toggleTestimoniTampil(id);
            alert(res.message);
            load(); // Reload data supaya status switch berubah
        } catch (error: any) {
            // Jika sudah 3 data, Laravel akan kirim error 422 dan ditangkap di sini
            alert(error.response?.data?.message || "Gagal mengubah status.");
        }
    };

    const openEdit = (item: any) => {
        setFormData({ ...item, gambar: null });
        setPreview(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.saveData('testimoni', formData);
            setIsModalOpen(false);
            setPreview(null);
            setFormData({ nama: '', jabatan: '', tanggal: '', isi: '', gambar: null });
            load();
            alert("Berhasil disimpan!");
        } catch (error: any) {
            console.error(error.response?.data);
            alert("Gagal simpan! Pastikan semua kolom terisi.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if(window.confirm('Hapus testimoni ini?')){
            await apiService.deleteData('testimoni', id);
            load();
        }
    };

    return (
        <div className="space-y-6">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-2xl font-bold text-[#111827]">Testimoni Tokoh</h2>
                    <p className="text-sm text-gray-500 font-medium">Pilih maksimal 3 testimoni untuk Beranda</p>
                </div>
                <Button onClick={() => { setFormData({ nama: '', jabatan: '', tanggal: '', isi: '', gambar: null }); setPreview(null); setIsModalOpen(true); }}>
                    <Plus size={18} /> Tambah Testimoni
                </Button>
            </div>

            {/* --- LIST DATA (GRID) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map(item => (
                    <div key={item.id} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm relative group hover:shadow-md transition-all">
                        {/* Tombol Aksi (Edit/Hapus) */}
                        <div className="absolute top-6 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <ActionButton icon={Edit2} color="text-blue-500" onClick={() => openEdit(item)} />
                            <ActionButton icon={Trash2} color="text-red-500" onClick={() => handleDelete(item.id)} />
                        </div>

                        <p className="text-gray-600 italic mb-8 leading-relaxed">"{item.isi}"</p>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                                    {item.gambar && <img src={`http://ddp_api.test/storage/${item.gambar}`} className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-[#111827]">{item.nama}</h4>
                                    <p className="text-[10px] font-bold text-[#E3242B] uppercase tracking-wider">{item.jabatan}</p>
                                    <p className="text-[9px] text-gray-400 mt-1">{item.tanggal}</p> 
                                </div>
                            </div>

                            {/* --- FITUR SWITCH (PILIH 3) --- */}
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Tampilkan</span>
                                <button 
                                    onClick={() => handleToggleTampil(item.id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${item.is_tampil ? 'bg-[#E3242B]' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${item.is_tampil ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL FORM --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Testimoni" : "Tambah Testimoni"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Nama Tokoh *</label>
                            <input className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-100" value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Tanggal *</label>
                            <input type="date" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-100" value={formData.tanggal || ''} onChange={e => setFormData({...formData, tanggal: e.target.value})} required />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Jabatan *</label>
                        <input className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-100" value={formData.jabatan || ''} onChange={e => setFormData({...formData, jabatan: e.target.value})} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Kutipan Testimoni *</label>
                        <textarea className="w-full p-3 border rounded-xl h-28 outline-none focus:ring-2 focus:ring-red-100" value={formData.isi || ''} onChange={e => setFormData({...formData, isi: e.target.value})} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{formData.id ? 'Ganti Foto (Kosongkan jika tetap)' : 'Foto Tokoh *'}</label>
                        <input type="file" className="w-full p-2.5 border border-dashed rounded-xl" onChange={e => {if(e.target.files){ setFormData({...formData, gambar: e.target.files[0]}); setPreview(URL.createObjectURL(e.target.files[0])) }}} required={!formData.id} />
                        {preview && <img src={preview} className="h-20 w-20 object-cover mt-3 rounded-xl border-2 border-white shadow-sm" />}
                    </div>
                    <Button type="submit" disabled={loading} className="w-full py-3">
                        {loading ? "Menyimpan..." : "Simpan Testimoni"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

// --- Module: Galeri Kegiatan (Full Rewrite - Premium Dashboard Look) ---

export const GaleriModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ nama_kegiatan: '', tanggal: '', deskripsi: '', gambar: null });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);
    
    const load = async () => { 
        // Mengambil seluruh data galeri untuk admin
        const res = await apiService.getData('galeri');
        setData(res); 
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, gambar: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.saveData('galeri', formData);
            setIsModalOpen(false);
            setPreview(null);
            setFormData({ nama_kegiatan: '', tanggal: '', deskripsi: '', gambar: null });
            load();
            alert("Galeri Berhasil Disinkronkan!");
        } catch (error) {
            alert("Gagal menyimpan data galeri.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if(window.confirm('Hapus dokumentasi ini selamanya?')){
            try {
                await apiService.deleteData('galeri', id);
                load();
            } catch (error) {
                alert("Gagal menghapus.");
            }
        }
    };

    const openEdit = (item: any) => {
        setFormData({ ...item, gambar: null });
        setPreview(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-10">
            {/* --- HEADER MODULE --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-2 gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Galeri Kegiatan</h2>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-12 bg-[#E3242B] rounded-full"></div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                            Total: {data.length} Dokumentasi Visual
                        </p>
                    </div>
                </div>
                <Button onClick={() => { setFormData({ nama_kegiatan: '', tanggal: '', deskripsi: '', gambar: null }); setPreview(null); setIsModalOpen(true); }} className="shadow-xl shadow-red-900/10">
                    <Plus size={18} /> Tambah Dokumentasi
                </Button>
            </div>
            
            {/* --- GRID GALERI PREMIUM --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.map((item, index) => (
                    <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 p-4 shadow-sm group hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
                        
                        {/* INDICATOR 11 TERBARU (LIVE ON INDEX) */}
                        {index < 11 && (
                            <div className="absolute top-6 left-6 z-20">
                                <div className="bg-[#E3242B] text-white text-[7px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-white animate-ping"></div>
                                    Live on Index
                                </div>
                            </div>
                        )}

                        {/* Image Container */}
                        <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden relative shadow-inner">
                            <img 
                                src={`http://ddp_api.test/storage/${item.gambar}`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" 
                                alt={item.nama_kegiatan}
                            />
                            
                            {/* Overlay Aksi saat Hover */}
                            <div className="absolute inset-0 bg-[#111827]/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center gap-4">
                                <button onClick={() => openEdit(item)} className="w-12 h-12 bg-white text-[#111827] rounded-2xl flex items-center justify-center hover:bg-[#E3242B] hover:text-white transition-all transform hover:-translate-y-1 shadow-xl">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="w-12 h-12 bg-white text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Info Content */}
                        <div className="px-4 py-5 space-y-2">
                            <div className="flex items-center gap-2">
                                <Calendar size={10} className="text-[#E3242B]" />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.tanggal}</span>
                            </div>
                            <h4 className="font-black text-sm text-[#111827] uppercase tracking-tighter leading-tight line-clamp-1 group-hover:text-[#E3242B] transition-colors">
                                {item.nama_kegiatan}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-medium line-clamp-2 leading-relaxed">
                                {item.deskripsi}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL FORM (PREMIUM DESIGN) --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Update Dokumentasi" : "Input Dokumentasi Baru"}>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Nama Kegiatan *</label>
                            <input className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm transition-all" value={formData.nama_kegiatan || ''} onChange={e => setFormData({...formData, nama_kegiatan: e.target.value})} required placeholder="E.g. Sosialisasi DDP..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Tanggal Pelaksanaan *</label>
                                <input type="date" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold text-sm" value={formData.tanggal || ''} onChange={e => setFormData({...formData, tanggal: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Lampiran Foto *</label>
                                <input type="file" className="w-full p-3.5 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-bold text-gray-400" onChange={handleFileChange} required={!formData.id} />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Deskripsi Singkat Dokumentasi *</label>
                            <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl h-32 outline-none focus:ring-2 focus:ring-red-100 resize-none font-medium text-sm" value={formData.deskripsi || ''} onChange={e => setFormData({...formData, deskripsi: e.target.value})} required placeholder="Ceritakan sedikit tentang kegiatan ini..." />
                        </div>

                        {/* Image Preview Area */}
                        {preview && (
                            <div className="relative w-full h-40 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                                <img src={preview} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Preview Sampul Baru</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={loading} className="w-full py-5 bg-[#E3242B] text-white font-black rounded-2xl shadow-xl shadow-red-900/20 uppercase tracking-[0.2em] text-[10px] hover:bg-[#111827] transition-all">
                        {loading ? "Menyinkronkan..." : (formData.id ? "Perbarui Dokumentasi" : "Simpan Dokumentasi")}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

// --- 11. Generic Placeholder ---

export const GenericPlaceholderModule: React.FC<{title: string}> = ({ title }) => (
    <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="p-6 bg-gray-50 rounded-full mb-4"><Database size={40} className="text-gray-300" /></div>
        <h2 className="text-2xl font-bold text-[#111827] mb-2">{title} Module</h2>
        <p className="max-w-md text-center text-gray-500">Modul ini sedang dalam tahap sinkronisasi kodingan.</p>
    </div>
);