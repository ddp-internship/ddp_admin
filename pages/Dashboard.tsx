import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { DashboardStats } from '../types';
import { 
  Database, FileText, Users, Activity, Zap, 
  LayoutDashboard, Map, MessageSquare, Camera, 
  Book, BarChart3, Globe 
} from 'lucide-react';

// --- Komponen Kartu Statistik Kecil ---
const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: number, icon: any, color: string, trend?: string }) => (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 flex items-start justify-between group hover:border-[#E3242B]/30 transition-all duration-500">
        <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{title}</p>
            <h3 className="text-4xl font-black text-[#111827] tabular-nums tracking-tighter">
                {value.toLocaleString('id-ID')}
            </h3>
            {trend && (
                <div className="flex items-center text-[9px] font-black text-emerald-500 bg-emerald-50/50 px-3 py-1 rounded-full w-fit border border-emerald-100 uppercase tracking-widest">
                    <Zap size={10} className="mr-1.5 fill-emerald-500" />
                    <span>{trend}</span>
                </div>
            )}
        </div>
        <div className={`p-5 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}>
            <Icon size={28} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        apiService.getStats().then(setStats);
    }, []);

    if (!stats) return (
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
            <div className="w-16 h-16 border-4 border-[#E3242B] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] animate-pulse">Menghimpun Database DDP...</p>
        </div>
    );

    return (
        <div className="space-y-12 pb-12">
            {/* --- 1. HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[#E3242B]">
                        <div className="p-2 bg-[#E3242B]/10 rounded-lg"><LayoutDashboard size={18} /></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.4em]">Analytics Command Center</span>
                    </div>
                    <h2 className="text-4xl font-black text-[#111827] tracking-tighter uppercase">Overview <span className="text-[#E3242B]">Sistem.</span></h2>
                    <p className="text-sm text-gray-500 font-medium font-bold uppercase tracking-tight">Monitoring Data Desa Presisi secara real-time.</p>
                </div>
                
                <div className="bg-white px-6 py-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest leading-none">Status Server</span>
                        <span className="text-[9px] font-bold text-emerald-500 uppercase mt-1">Connected & Encrypted</span>
                    </div>
                </div>
            </div>

            {/* --- 2. STATS GRID (KOMPREHENSIF 8 KARTU) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Capaian Desa" value={stats.totalDesa} icon={Map} color="bg-blue-600" trend="Wilayah Terdata" />
                <StatCard title="Warta & Berita" value={stats.totalBerita} icon={FileText} color="bg-[#E3242B]" trend="Publikasi Aktif" />
                <StatCard title="Suara Tokoh" value={stats.totalTestimoni} icon={MessageSquare} color="bg-purple-600" trend="Apresiasi" />
                <StatCard title="Arsip Galeri" value={stats.totalGaleri} icon={Camera} color="bg-orange-500" trend="Dokumentasi" />
                <StatCard title="Katalog Buku" value={stats.totalMonografi} icon={Book} color="bg-emerald-600" trend="Monografi" />
                <StatCard title="Visual Data" value={stats.totalInfografis} icon={BarChart3} color="bg-indigo-600" trend="Infografis" />
                <StatCard title="Jejaring Mitra" value={stats.totalMitra} icon={Globe} color="bg-slate-700" trend="Stakeholders" />
                <StatCard title="Admin Sistem" value={stats.totalUser} icon={Users} color="bg-slate-400" trend="Authorized" />
            </div>

            {/* --- 3. PLATFORM ANALYTICS SECTION --- */}
            <div className="bg-[#111827] rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#E3242B] opacity-5 blur-[120px] -mr-20 -mt-20"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="max-w-xl space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <Activity size={14} className="text-[#E3242B]" />
                            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">System Intelligence</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white uppercase tracking-tighter leading-[0.9]">
                            Integrasi Data <br /> <span className="text-[#E3242B]">Satu Desa Satu Data.</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                            Seluruh informasi yang masuk melalui modul admin telah melalui enkripsi database. Gunakan dashboard ini untuk memantau performa publikasi website Data Desa Presisi (DDP) secara menyeluruh.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-8 py-3.5 bg-[#E3242B] text-white text-[10px] font-black rounded-2xl hover:bg-white hover:text-[#111827] transition-all duration-500 uppercase tracking-widest shadow-xl shadow-red-900/20">
                                Analisis Spasial
                            </button>
                            <button className="px-8 py-3.5 bg-white/5 text-white border border-white/10 text-[10px] font-black rounded-2xl hover:bg-white/10 transition-all duration-500 uppercase tracking-widest">
                                Log Aktivitas
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-[450px] aspect-square bg-white/5 rounded-[3.5rem] border border-white/10 border-dashed flex flex-col items-center justify-center text-white/20 space-y-6 group-hover:border-[#E3242B]/50 transition-all duration-700">
                        <div className="relative">
                            <div className="p-10 bg-white/5 rounded-full border border-white/10 animate-pulse">
                                <Database size={70} className="text-[#E3242B]/50" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Engine Synced</span>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Optimizing Data Clusters 2.0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="flex flex-col items-center gap-4 opacity-40 pt-4">
                <div className="h-px w-24 bg-gray-400"></div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.8em]">Laboratory Data Desa Presisi IPB University</p>
            </div>
        </div>
    );
};